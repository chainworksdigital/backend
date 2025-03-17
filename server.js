const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
const { PythonShell } = require("python-shell");
const connectDB = require("./config/db");
const questionRoutes = require("./routes/questionRoutes");



dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/questions", questionRoutes);



// ✅ API Route to Execute Python Script
app.post("/api/generate-questions", (req, res) => {
  const requestData = req.body; // Get data from frontend request
  console.log("🚀 Received Request:", JSON.stringify(req.body, null, 2)); // Log the request data

  // ✅ Determine which script to run based on aiModelPurpose
  let scriptFile = "script.py"; // Default to script.py
  if (requestData.aiModelPurpose === "Internal NIMI Model") {
    scriptFile = "script1.py"; // Use script1.py for internal model
  }

  // ✅ Define options for PythonShell
  let options = {
    mode: "json", // Expect JSON output
    pythonPath: "python3", // Ensure Python 3 is installed
    scriptPath: path.join(__dirname, "scripts"), // Path to scripts directory
    args: [JSON.stringify(requestData)], // Pass request data as argument
  };

  console.log(`📌 Running Python Script: ${scriptFile}`); // Log selected script

  let pyshell = new PythonShell(scriptFile, options);

  let outputData = [];

  // Capture JSON output from Python
  pyshell.on("message", function (message) {
    outputData.push(message);
  });

  // Handle Python script errors
  pyshell.on("stderr", function (stderr) {
    console.error("⚠️ Python STDERR:", stderr);
  });

  // Send response after Python script execution
  pyshell.end(function (err) {
    if (err) {
      console.error("❌ Python execution error:", err);
      return res.status(500).json({ error: "Python script execution failed" });
    }

    try {
      res.json(outputData[0]); // ✅ Send JSON response to frontend
    } catch (parseError) {
      console.error("❌ Error parsing Python output:", parseError);
      res.status(500).json({ error: "Invalid response from Python script" });
    }
  });
});

// ✅ Express server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
