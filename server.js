const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path"); // Import path module
const { PythonShell } = require("python-shell"); // Import python-shell
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
  console.log("Request headers:", req.headers);
  console.log("Request body:", req.body);
    console.log("🚀 Received Request:", JSON.stringify(req.body, null, 2)); // Log the request data
  

  let options = {
    mode: "text",
    pythonPath: "python3",
    scriptPath: path.join(__dirname, "scripts"),
    args: [JSON.stringify(requestData)],
  };

  let pyshell = new PythonShell("script.py", options);

  let outputData = ""; // Store Python output

  pyshell.on("message", function (message) {
    outputData += message;
  });

  pyshell.on("stderr", function (stderr) {
    console.error("⚠️ Python STDERR:", stderr);
  });

  pyshell.end(function (err) {
    if (err) {
      console.error("❌ Python execution error:", err);
      return res.status(500).json({ error: "Python script execution failed" });
    }

    try {
      const parsedOutput = JSON.parse(outputData);
      res.json(parsedOutput);
    } catch (parseError) {
      console.error("❌ Error parsing Python output:", parseError);
      res.status(500).json({ error: "Invalid response from Python script" });
    }
  });
});

// ✅ Express server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
