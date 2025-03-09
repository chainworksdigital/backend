const express = require("express");
const Trade = require("../models/Trade"); // Trade model for MongoDB
const { spawn } = require("child_process"); // To run Python script
const path = require("path"); // Manage file paths
const fs = require("fs"); // File system for checking script existence

const router = express.Router();

// ✅ POST Route: Save Trade Data & Trigger Python Script
router.post("/save", async (req, res) => {
  try {
    const { tradeType, moduleName, topicName, noOfQues, levels, dataFormat, aiModelPurpose } = req.body;

    // ✅ Log Incoming Request Data
    console.log("📌 Incoming Trade Data:", JSON.stringify(req.body, null, 2));

    // ✅ Validate Incoming Data
    if (!tradeType || !moduleName || !topicName || !noOfQues || !levels || !Array.isArray(levels) || levels.length === 0 || !aiModelPurpose) {
      console.error("❌ ERROR: Missing required fields or invalid levels array");
      return res.status(400).json({ error: "Missing required fields or invalid levels array" });
    }

    // ✅ Validate AI Model Purpose
    const validAiModelPurposes = ["External API", "Internal NIMI Model"];
    if (!validAiModelPurposes.includes(aiModelPurpose)) {
      console.error("❌ ERROR: Invalid AI Model Purpose");
      return res.status(400).json({ error: "Invalid AI Model Purpose. Allowed values: 'External API' or 'Internal NIMI Model'" });
    }

    // ✅ Validate Levels & Set Default numQuestions
    const validLevels = levels.map(level => ({
      level: level.level, // L1, L2, L3
      numQuestions: level.numQuestions ?? 0, // ✅ Default to 0 if not provided
      type: level.type, // MCQ, True/False, Descriptive
      mcqOptions: level.type === "MCQ" ? level.mcqOptions : null, // ✅ MCQ-specific field
    }));

    // ✅ Save Data to MongoDB
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

    // ✅ Log Saved Trade Entry
    console.log("✅ Trade Entry Saved in MongoDB:", JSON.stringify(savedEntry, null, 2));

    
    const topicNameExtracted = savedEntry.modules[0]?.topics[0]?.name;
    console.log(`🟢 Extracted Topic Name: "${topicNameExtracted}"`);

    // ✅ Ensure Topic Name Exists
    if (!topicNameExtracted) {
      console.error("❌ ERROR: Topic name is missing!");
      return res.status(500).json({ error: "Topic name missing from saved entry." });
    }

    console.log("✅ Trade entry saved. Running Python script...");

    // ✅ Path to Python Script
    const pythonScriptPath = path.join(__dirname, "..", "scripts", "script.py");

    // ✅ Ensure Python Script Exists
    if (!fs.existsSync(pythonScriptPath)) {
      console.error(`❌ ERROR: Python script not found at path: ${pythonScriptPath}`);
      return res.status(500).json({ error: "Python script not found." });
    }

    console.log(`📌 Python Script Path: ${pythonScriptPath}`);
    console.log("📌 Sending Data to Python Script:", JSON.stringify(savedEntry, null, 2));

    // ✅ Spawn Python Process
    const pythonProcess = spawn("python3", [pythonScriptPath]);

    // ✅ Send JSON Data to Python Script
    pythonProcess.stdin.write(JSON.stringify(savedEntry));
    pythonProcess.stdin.end();

    let pythonOutput = "";
    let pythonError = "";

    // ✅ Collect Output from Python
    pythonProcess.stdout.on("data", (data) => {
      pythonOutput += data.toString();
      console.log(`🟢 Python Output: ${data.toString()}`);
    });

    // ✅ Collect Errors from Python
    pythonProcess.stderr.on("data", (data) => {
      pythonError += data.toString();
      console.error(`🔴 Python Script Error: ${data.toString()}`);
    });

    // ✅ Handle Python Process Exit
    pythonProcess.on("close", (code) => {
      console.log(`📌 Python Process Exit Code: ${code}`);
      console.log("📌 Final Python Output:", pythonOutput.trim());
      console.log("📌 Final Python Error:", pythonError.trim());

      if (code !== 0) {
        console.error("❌ Python script execution failed.");
        return res.status(500).json({
          error: "Python script execution failed.",
          pythonError: pythonError.trim(),
        });
      }

      console.log(`✅ Python script executed successfully! Exit code: ${code}`);

      res.status(201).json({
        message: "Data saved successfully! Python script executed.",
        trade: savedEntry,
        pythonResponse: pythonOutput.trim(),
      });
    });

  } catch (error) {
    console.error("🔴 Error saving trade:", error);
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

module.exports = router;
