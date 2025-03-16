const express = require("express");
const Trade = require("../models/Trade"); // Trade model for MongoDB
const { spawn } = require("child_process"); // To run Python script
const path = require("path"); // Manage file paths
const fs = require("fs"); // File system for checking script existence

const router = express.Router();

router.post("/save", async (req, res) => {
  try {
    const { tradeType, moduleName, topicName, noOfQues, levels, dataFormat, aiModelPurpose } = req.body;

    // Validate incoming data
    if (!tradeType || !moduleName || !topicName || !noOfQues || !levels || !Array.isArray(levels) || levels.length === 0 || !aiModelPurpose) {
      return res.status(400).json({ error: "Missing required fields or invalid levels array" });
    }

    // Validate AI Model Purpose
    const validAiModelPurposes = ["External API", "Internal NIMI Model"];
    if (!validAiModelPurposes.includes(aiModelPurpose)) {
      return res.status(400).json({ error: "Invalid AI Model Purpose. Allowed values: 'External API' or 'Internal NIMI Model'" });
    }

    // Validate Levels & Set Default numQuestions
    const validLevels = levels.map(level => ({
      level: level.level,
      numQuestions: level.numQuestions ?? 0,
      type: level.type,
      mcqOptions: level.type === "MCQ" ? level.mcqOptions : null,
    }));

    // Save Data to MongoDB
    const newTradeEntry = new Trade({
      tradeType,
      modules: [
        {
          name: moduleName,
          topics: [
            {
              name: topicName,
              totalQuestions: noOfQues,
              format: dataFormat,
              aiModelPurpose,
              levels: validLevels,
            },
          ],
        },
      ],
    });

    const savedEntry = await newTradeEntry.save();

    // Extract Topic Name
    const topicNameExtracted = savedEntry.modules[0]?.topics[0]?.name;
    if (!topicNameExtracted) {
      return res.status(500).json({ error: "Topic name missing from saved entry." });
    }

    // Determine Python Script Based on `aiModelPurpose`
    let scriptFile = aiModelPurpose === "External API" ? "script.py" : "script1.py";
    const pythonScriptPath = path.join(__dirname, "..", "scripts", scriptFile);

    if (!fs.existsSync(pythonScriptPath)) {
      return res.status(500).json({ error: `Python script ${scriptFile} not found.` });
    }

    // Spawn Python Process
    const pythonProcess = spawn("python3", [pythonScriptPath]);
    pythonProcess.stdin.write(JSON.stringify(savedEntry));
    pythonProcess.stdin.end();

    let pythonOutput = "";
    let pythonError = "";

    pythonProcess.stdout.on("data", (data) => {
      pythonOutput += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      pythonError += data.toString();
    });

    pythonProcess.on("close", async (code) => {
      if (code !== 0) {
        return res.status(500).json({
          error: "Python script execution failed.",
          pythonError: pythonError.trim(),
        });
      }

      try {
        const questionsData = JSON.parse(pythonOutput.trim());
        console.log("questionsData",questionsData);
        const questions = questionsData.questions_and_answers;
        console.log("questionss",questions);

        // Update the savedEntry with the generated questions
        savedEntry.modules[0].topics[0].levels.forEach((level, index) => {
          if (level.numQuestions > 0) {
            level.questions = questions.filter(q => q.difficulty_level === map_difficulty(level.level));
          }
        });

        // Save the updated entry back to the database
        await savedEntry.save();

        res.status(201).json({
          message: `Data saved successfully! Python script ${scriptFile} executed.`,
          trade: savedEntry,
          pythonResponse: pythonOutput.trim(),
        });
      } catch (error) {
        console.error("Error parsing Python output or saving questions:", error);
        res.status(500).json({ error: "Error parsing Python output or saving questions", details: error.message });
      }
    });

  } catch (error) {
    console.error("Error saving trade:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// ✅ GET Route: Fetch All Trades
router.get("/getTrades", async (req, res) => {
  try {
    const trades = await Trade.find();
    console.log("📌 Fetching all trade entries...");
    console.log(trades);

    if (!trades || trades.length === 0) {
      console.warn("⚠️ No trade data found.");
      return res.status(404).json({ message: "No trade data found." });
    }

    res.status(200).json(trades);
  } catch (error) {
    console.error("🔴 Error fetching trades:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});
// ✅ GET Route: Fetch Questions from output2.json
router.get("/fetchQuestions", (req, res) => {
  const filePath = path.join(__dirname, "../output2.json"); // Ensure correct path

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("❌ Error reading output2.json:", err);
      return res.status(500).json({ error: "Failed to load questions" });
    }
    try {
      const questions = JSON.parse(data); // ✅ Convert JSON string to object
      res.json(questions); // ✅ Send questions to frontend
    } catch (parseError) {
      console.error("❌ JSON Parse Error:", parseError);
      res.status(500).json({ error: "Invalid JSON format in output2.json" });
    }
  });
});



module.exports = router;