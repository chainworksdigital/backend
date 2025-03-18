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
<<<<<<< HEAD
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
=======
  level: { type: String, enum: ["L1", "L2", "L3"], required: true },
  numQuestions: { type: Number }, 
  questions_and_answers: [QuestionSchema], // Updated to store full questions
  type: { 
    type: String, 
    required: function() { return this.numQuestions > 0; } 
  },
<<<<<<< HEAD
  mcqOptions: { type: Number, required: false },
=======
  mcqOptions: { type: Number }, // Number of MCQ options (if applicable)
>>>>>>> 6e47777 (backend code)
});

const TopicSchema = new mongoose.Schema({
<<<<<<< HEAD
  name: { type: String, required: true },
  totalQuestions: { type: Number, required: true },
  format: { type: String, enum: ["Text", "Image"]},
  aiModelPurpose: { type: String, enum: ["External API", "Internal NIMI Model"]}, 
  levels: [LevelSchema],
=======
  name: { type: String }, // Topic name
  totalQuestions: { type: Number }, // Total number of questions
  format: { type: String, enum: ["Text", "Image"] }, // Format (Text or Image)
  aiModelPurpose: { type: String, enum: ["External API", "Internal NIMI Model"] }, // AI Model Purpose
  levels: [LevelSchema], // Array of levels for this topic
>>>>>>> 6e47777 (backend code)
});

// Define the Module Schema
const ModuleSchema = new mongoose.Schema({
<<<<<<< HEAD
  name: { type: String, required: true, unique: false },
=======
  name: { type: String },
>>>>>>> 6e47777 (backend code)
  topics: [TopicSchema],
});

// Define the Trade Schema
const TradeSchema = new mongoose.Schema({
<<<<<<< HEAD
  tradeType: { type: String, required: true, unique: false },
  modules: [ModuleSchema],
});

module.exports = mongoose.model("Trade", TradeSchema);
=======
  tradeType: { type: String },
  modules: [ModuleSchema],
});

module.exports = mongoose.model("Trade", TradeSchema);
>>>>>>> 6e47777 (backend code)
