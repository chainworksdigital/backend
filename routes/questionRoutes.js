const express = require("express");
const Trade = require("../models/Trade"); // Trade model for MongoDB
const NimiQuestion = require("../models/NimiQuestion"); // NimiQuestion model for MongoDB
const { spawn } = require("child_process"); // To run Python script
const path = require("path"); // Manage file paths
const fs = require("fs"); // File system for checking script existence

const router = express.Router();

router.post("/save", async (req, res) => {
  try {
    const { tradeType, moduleName, topicName, noOfQues, levels, dataFormat, aiModelPurpose } = req.body;

    console.log("📌 Incoming Trade Data:", JSON.stringify(req.body, null, 2));

    if (!tradeType || !moduleName || !topicName || !noOfQues || !levels || !Array.isArray(levels) || levels.length === 0) {
      return res.status(400).json({ error: "Missing required fields or invalid levels array" });
    }

    if (!["External API", "Internal NIMI Model"].includes(aiModelPurpose)) {
      return res.status(400).json({ error: "Invalid AI Model Purpose. Allowed: 'External API' or 'Internal NIMI Model'" });
    }

    // ✅ Ensure Each Level Has Correct `questions_and_answers` Format
    const validLevels = levels.map(level => ({
      level: level.level,
      numQuestions: level.numQuestions ?? 0,
      type: level.type,
      mcqOptions: level.type === "MCQ" ? level.mcqOptions : null,
      questions: Array.isArray(level.questions) // Use `questions` instead of `questions_and_answers`
        ? level.questions.map(q => ({
            question: q.question,
            options: q.options,
            correct_answer: q.correct_answer,
            difficulty_level: q.difficulty_level,
            type: q.type,
          }))
        : [],
    }));

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

    console.log("📌 New Trade Entry to be Saved:", JSON.stringify(newTradeEntry, null, 2));

    let savedEntry;
    try {
      savedEntry = await newTradeEntry.save();
      console.log("✅ Trade Entry Saved in MongoDB:", JSON.stringify(savedEntry, null, 2));
    } catch (error) {
      console.error("🔴 Error saving trade entry:", error.message);
      return res.status(500).json({ error: "Failed to save trade entry.", details: error.message });
    }

    const scriptFile = aiModelPurpose === "External API" ? "script.py" : "script1.py";
    const pythonScriptPath = path.join(__dirname, "..", "scripts", scriptFile);

    if (!fs.existsSync(pythonScriptPath)) {
      return res.status(500).json({ error: `Python script ${scriptFile} not found.` });
    }

    console.log(`📌 Running: ${scriptFile}`);

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
      console.error(`🔴 Python Script Error: ${data.toString()}`);
    });

    const outputFilePath = path.join(__dirname, "../output2.json");

    pythonProcess.on("close", async (code) => {
      console.log(`📌 Python Process Exit Code: ${code}`);

      if (code !== 0) {
        return res.status(500).json({ error: "Python script execution failed." });
      }

      if (!fs.existsSync(outputFilePath)) {
        return res.status(500).json({ error: "Output file not found." });
      }

      fs.readFile(outputFilePath, "utf8", async (err, data) => {
        if (err) {
          return res.status(500).json({ error: "Failed to read output2.json" });
        }

        console.log("📌 Raw output2.json content:", data);

        try {
          const parsedData = JSON.parse(data);
          if (!Array.isArray(parsedData.questions_and_answers) || parsedData.questions_and_answers.length === 0) {
            return res.status(500).json({ error: "No questions generated." });
          }

          console.log("✅ Parsed Questions:", JSON.stringify(parsedData.questions_and_answers, null, 2));

          // Fetch the latest trade entry by its ID
          const trade = await Trade.findById(savedEntry._id);
          console.log(trade);

          if (!trade) return res.status(404).json({ error: "Trade not found." });
          
          const moduleIndex = trade.modules.findIndex(m => m.name === moduleName);
          const topicIndex = trade.modules[moduleIndex]?.topics.findIndex(t => t.name === topicName);
          
          if (topicIndex === -1) return res.status(404).json({ error: "Topic not found." });
          
          // ✅ Map difficulty levels to L1, L2, L3
          const levelWiseQuestions = {};

          parsedData.questions_and_answers.forEach((qa) => {
              const level = qa.difficulty_level === "Easy" ? "L1" :
                            qa.difficulty_level === "Medium" ? "L2" :
                            qa.difficulty_level === "Hard" ? "L3" : null;

              if (!level) return; 

              if (!levelWiseQuestions[level]) {
                  levelWiseQuestions[level] = [];
              }
              levelWiseQuestions[level].push(qa);
          });

          console.log("✅ Grouped Questions by Level:", levelWiseQuestions);

          const updateFields = {};

          Object.keys(levelWiseQuestions).forEach((level) => {
              const levelIndex = trade.modules[moduleIndex].topics[topicIndex].levels.findIndex(
                  (l) => l.level === level
              );

              if (levelIndex === -1) {
                  console.log(`⏩ Skipping Level: ${level} (not found in DB)`);
                  return;
              }

              // Use the correct field name: `questions` instead of `questions_and_answers`
              const updatePath = `modules.${moduleIndex}.topics.${topicIndex}.levels.${levelIndex}.questions`;
              updateFields[updatePath] = { $each: levelWiseQuestions[level] }; // Use $each with $push
          });

          console.log("📌 Update Fields:", updateFields);

          if (Object.keys(updateFields).length === 0) {
              return res.status(400).json({ error: "No valid levels to update." });
          }

          const updatedTrade = await Trade.findOneAndUpdate(
              { _id: trade._id },
              { $push: updateFields }, // Use $push to append to the array
              { new: true }
          );

          console.log("📌 Updated Trade Entry:", updatedTrade);

          if (!updatedTrade) return res.status(500).json({ error: "Trade update failed." });

          console.log("✅ Updated Trade Entry:", JSON.stringify(updatedTrade, null, 2));
          
          res.status(201).json({ message: "Data saved and questions added successfully!", trade: updatedTrade });

        } catch (error) {
          res.status(500).json({ error: "Failed to parse/store questions.", details: error.message });
        }
      });
    });

  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});
// ✅ POST Route: Add Additional Question to a Topic
router.post("/addQuestion", async (req, res) => {
  try {
    const { tradeId, moduleName, topicName, newQuestion } = req.body;

    if (!tradeId || !moduleName || !topicName || !newQuestion) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const trade = await Trade.findById(tradeId);
    if (!trade) {
      return res.status(404).json({ error: "Trade not found." });
    }

    // ✅ Find Module & Topic
    const module = trade.modules.find(m => m.name === moduleName);
    if (!module) {
      return res.status(404).json({ error: "Module not found." });
    }

    const topic = module.topics.find(t => t.name === topicName);
    if (!topic) {
      return res.status(404).json({ error: "Topic not found." });
    }

    // ✅ Add Question
    topic.questions = topic.questions || []; // Ensure the array exists
    topic.questions.push(newQuestion);

    await trade.save();
    console.log("✅ New question added:", newQuestion);

    res.status(200).json({ message: "Question added successfully.", trade });

  } catch (error) {
    console.error("🔴 Error adding question:", error);
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
  const filePath = path.join(__dirname, "../output2.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("❌ Error reading output2.json:", err);
      return res.status(500).json({ error: "Failed to load questions" });
    }
    try {
      const questions = JSON.parse(data);
      res.json(questions);
    } catch (parseError) {
      console.error("❌ JSON Parse Error:", parseError);
      res.status(500).json({ error: "Invalid JSON format in output2.json" });
    }
  });
});

router.post("/saveNimiQuestion", async (req, res) => {
  try {
    const { tradeType, modules, selectedQuestions } = req.body;

    // Loop through each module, topic, and level to ensure questions_and_answers is an array
    modules.forEach((module) => {
      module.topics.forEach((topic) => {
        topic.levels.forEach((level) => {
          // Check if questions_and_answers is an array, if not, initialize it as an empty array
          if (!Array.isArray(level.questions_and_answers)) {
            level.questions_and_answers = [];
          }

          // Add the selected questions to the respective level's questions_and_answers
          level.questions_and_answers.push(...selectedQuestions); // Ensure selected questions are properly formatted
        });
      });
    });

    // Create a new NimiQuestion document based on the incoming request body
    const nimiQuestion = new NimiQuestion({
      tradeType,
      modules,
    });

    // Save the document to the database
    await nimiQuestion.save();

    // Respond with success
    res.status(201).json({
      message: "Data saved successfully",
      savedData: nimiQuestion,
    });
  } catch (error) {
    console.error("Error saving NimiQuestion data:", error);
    res.status(500).json({
      message: "Error saving data",
      error: error.message,
    });
  }
});


module.exports = router;
