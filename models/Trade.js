const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true }, // Ensure questions have text
});

const LevelSchema = new mongoose.Schema({
  level: { type: String, enum: ["L1", "L2", "L3"], required: true },
  numQuestions: { type: Number },
  questions: [QuestionSchema],
  type: { type: String, required: true }, // MCQ, Subjective, True/False
  mcqOptions: { type: Number, required: false }, // Only required for MCQ
});

const TopicSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Ensure topic name is stored
  totalQuestions: { type: Number, required: true },
  format: { type: String, enum: ["Text", "Image"], required: true },
  aiModelPurpose: { type: String, enum: ["External API", "Internal NIMI Model"], required: true }, // New field for AI Model Purpose
  levels: [LevelSchema],
});

const ModuleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: false }, // Ensure module name is stored
  topics: [TopicSchema],
});

const TradeSchema = new mongoose.Schema({
  tradeType: { type: String, required: true, unique: false }, // Store Trade name
  modules: [ModuleSchema],
});

module.exports = mongoose.model("Trade", TradeSchema);