const mongoose = require("mongoose");

// Define the Question Schema
const QuestionSchema = new mongoose.Schema({
  question: { type: String }, 
  options: { type: [String] }, 
  correct_answer: { type: String }, 
  difficulty_level: { type: String, enum: ["Easy", "Medium", "Hard"] },
  type: { type: String, enum: ["mcq"] },
});

// Define the Level Schema
const LevelSchema = new mongoose.Schema({
  level: { type: String, enum: ["L1", "L2", "L3"] }, // Level (L1, L2, L3)
  numQuestions: { type: Number, default: 0 }, // Number of questions for this level
  questions: [QuestionSchema], // Array of questions for this level
  type: { 
    type: String, 
    required: function() { return this.numQuestions > 0; } 
  },
  mcqOptions: { type: Number }, // Number of MCQ options (if applicable)
});

const TopicSchema = new mongoose.Schema({
  name: { type: String }, // Topic name
  totalQuestions: { type: Number }, // Total number of questions
  format: { type: String, enum: ["Text", "Image"] }, // Format (Text or Image)
  aiModelPurpose: { type: String, enum: ["External API", "Internal NIMI Model"] }, // AI Model Purpose
  levels: [LevelSchema], // Array of levels for this topic
});

// Define the Module Schema
const ModuleSchema = new mongoose.Schema({
  name: { type: String },
  topics: [TopicSchema],
});

// Define the Trade Schema
const TradeSchema = new mongoose.Schema({
  tradeType: { type: String },
  modules: [ModuleSchema],
});

module.exports = mongoose.model("Trade", TradeSchema);
