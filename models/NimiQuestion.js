const mongoose = require("mongoose");

// Define the Question Schema
const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correct_answer: { type: String, required: true },
  difficulty_level: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
  type: { type: String, enum: ["mcq"], required: true },
} ,{ _id: false }); // Disable _id for questions

// Define the Level Schema
const LevelSchema = new mongoose.Schema({
  level: { type: String, enum: ["L1", "L2", "L3"], required: true },
  numQuestions: { type: Number },
  questions: [QuestionSchema], // Array of questions for this level
  type: {
    type: String,
    required: function () {
      return this.numQuestions > 0;
    },
  },
  mcqOptions: { type: Number },
}, { _id: false }); // Disable _id for levels

// Define the Topic Schema
const TopicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  format: { type: String },
  aiModelPurpose: { type: String},
  levels: [LevelSchema], // Array of levels for this topic
}, { _id: false }); // Disable _id for topics

// Define the Module Schema
const ModuleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  topics: [TopicSchema], // Array of topics for this module
}, { _id: false }); // Disable _id for modules

// Define the Nimi Question Schema
const NimiQuestionSchema = new mongoose.Schema({
  tradeType: { type: String, required: true },
  modules: [ModuleSchema], // Array of modules for this trade
  aiModelPurpose: { type: String },
});

module.exports = mongoose.model("NimiQuestion", NimiQuestionSchema);