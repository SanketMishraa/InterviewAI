const express = require("express");

const router = express.Router();

const { generateQuestion, submitAnswer } = require("../controllers/interviewController");

router.post("/generate", generateQuestion);

router.post("/submit", submitAnswer);

module.exports = router;
