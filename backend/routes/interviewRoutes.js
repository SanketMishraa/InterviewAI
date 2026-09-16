const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  generateQuestion,
  submitAnswer,
  getInterviewHistory,
} = require("../controllers/interviewController");

router.post("/generate", authMiddleware, generateQuestion);

router.post("/submit", authMiddleware, submitAnswer);

router.get("/history", authMiddleware, getInterviewHistory);

module.exports = router;
