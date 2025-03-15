const mongoose = require("mongoose");

// Define the Question Schema
const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true }, // The question text
  type: { type: String, enum: ["MCQ", "Subjective", "True/False"], required: true }, // Question type
  options: [{ type: String }], // Options for MCQ or True/False questions
  correct_answer: { type: String }, // Correct answer for MCQ or True/False questions
  difficulty_level: { type: String, enum: ["L1", "L2", "L3"], required: true }, // Difficulty level
});

// Define the Level Schema
const LevelSchema = new mongoose.Schema({
  level: { type: String, enum: ["L1", "L2", "L3"], required: true }, // Level (L1, L2, L3)
  numQuestions: { type: Number, default: 0 }, // Number of questions for this level
  questions: [QuestionSchema], // Array of questions for this level
  type: { 
    type: String, 
    required: function() { return this.numQuestions > 0; } // Required only if numQuestions > 0
  },
  mcqOptions: { type: Number, required: false }, // Number of MCQ options (if applicable)
});

// Define the Topic Schema
const TopicSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Topic name
  totalQuestions: { type: Number, required: true }, // Total number of questions
  format: { type: String, enum: ["Text", "Image"], required: true }, // Format (Text or Image)
  aiModelPurpose: { type: String, enum: ["External API", "Internal NIMI Model"], required: true }, // AI Model Purpose
  levels: [LevelSchema], // Array of levels for this topic
});

// Define the Module Schema
const ModuleSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Module name
  topics: [TopicSchema], // Array of topics for this module
});

// Define the Trade Schema
const TradeSchema = new mongoose.Schema({
  tradeType: { type: String, required: true }, // Trade name
  modules: [ModuleSchema], // Array of modules for this trade
});

// Export the Trade model
module.exports = mongoose.model("Trade", TradeSchema);