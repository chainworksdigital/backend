const express = require("express");
const Trade = require("../models/Trade"); // Trade model for MongoDB
const { spawn } = require("child_process"); // To run Python script
const path = require("path"); // Manage file paths
const fs = require("fs"); // File system for checking script existence

const router = express.Router();

router.post("/save", async (req, res) => {
  try {
    const { tradeType, moduleName, topicName, noOfQues, levels, dataFormat, aiModelPurpose, questions } = req.body;

    // Log the incoming request body
    console.log("📌 Incoming Request Body:", JSON.stringify(req.body, null, 2));

    // Validate incoming data
    if (!tradeType || !moduleName || !topicName || !noOfQues || !levels || !Array.isArray(levels) || levels.length === 0 || !aiModelPurpose || !questions) {
      console.error("❌ ERROR: Missing required fields or invalid levels array");
      return res.status(400).json({ error: "Missing required fields or invalid levels array" });
    }

    // Map questions to levels
    const validLevels = levels.map(level => {
      // Filter questions for this level
      const levelQuestions = questions.filter(q => q.difficulty_level === level.level);

      return {
        level: level.level, // L1, L2, L3
        numQuestions: level.numQuestions ?? 0, // Default to 0 if not provided
        type: level.type, // MCQ, True/False, Descriptive
        mcqOptions: level.type === "MCQ" ? level.mcqOptions : null, // MCQ-specific field
        questions: levelQuestions, // Assign filtered questions to this level
      };
    });

    // Save data to MongoDB
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

    // Log saved trade entry
    console.log("✅ Trade Entry Saved in MongoDB:", JSON.stringify(savedEntry, null, 2));

    res.status(201).json({
      message: "Data saved successfully!",
      trade: savedEntry,
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