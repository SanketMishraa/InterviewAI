const {
  generateInterviewQuestion,
  evaluateAnswer,
} = require("../Services/aiService.js");
const Interview = require("../models/Interview");

exports.generateQuestion = async (req, res) => {
  try {
    const { role, difficulty } = req.body;

    const question = await generateInterviewQuestion(role, difficulty);

    res.json({
      question,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.submitAnswer = async (req, res) => {
  try {
    const { userId, role, difficulty, question, answer } = req.body;

    const feedback = await evaluateAnswer(question, answer);

    await Interview.create({
      user: userId,

      role,

      difficulty,

      question,

      answer,

      ...feedback,
    });

    res.json(feedback);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
