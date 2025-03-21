const mongoose = require("mongoose");

// Define the Question Schema
const QuestionSchema = new mongoose.Schema({
  question: { type: String }, 
  options: { type: [String] }, 
  correct_answer: { type: String }, 
  difficulty_level: { type: String, enum: ["Easy", "Medium", "Hard"] },
  type: { type: String, enum: ["MCQ"] },
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
  name: { type: String, required: true },
  totalQuestions: { type: Number, required: true },
  format: { type: String, enum: ["Text", "Image"]},
  aiModelPurpose: { type: String, enum: ["External API", "Internal NIMI Model"]}, 
  levels: [LevelSchema],
});

// Define the Module Schema
const ModuleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: false },
  topics: [TopicSchema],
});

// Define the Trade Schema
const TradeSchema = new mongoose.Schema({
  tradeType: { type: String, required: true, unique: false },
  modules: [ModuleSchema],
});

module.exports = mongoose.model("Trade", TradeSchema);
