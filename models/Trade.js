const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true }, 
  options: { type: [String], required: true }, 
  correct_answer: { type: String, required: true }, 
  difficulty_level: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
  type: { type: String, enum: ["mcq", "true/false"], required: true },
});

const LevelSchema = new mongoose.Schema({
  level: { type: String, enum: ["L1", "L2", "L3"], required: true },
  numQuestions: { type: Number }, 
  questions_and_answers: [QuestionSchema], // Updated to store full questions
  type: { 
    type: String, 
    required: function() { return this.numQuestions > 0; } 
  },
  mcqOptions: { type: Number, required: false },
});

const TopicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalQuestions: { type: Number, required: true },
  format: { type: String, enum: ["Text", "Image"]},
  aiModelPurpose: { type: String, enum: ["External API", "Internal NIMI Model"]}, 
  levels: [LevelSchema],
});

const ModuleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: false },
  topics: [TopicSchema],
});

const TradeSchema = new mongoose.Schema({
  tradeType: { type: String, required: true, unique: false },
  modules: [ModuleSchema],
});

module.exports = mongoose.model("Trade", TradeSchema);
