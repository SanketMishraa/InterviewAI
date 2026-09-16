const Interview = require("../models/Interview");
const User = require("../models/User");

const {
  generateInterviewQuestion,
  generateFollowUpQuestion,
  evaluateAnswer,
  generateFinalInterviewReport,
} = require("../services/aiService");

// ==========================================
// GENERATE INTERVIEW QUESTION
// ==========================================

exports.generateQuestion = async (req, res) => {
  try {
    const {
      role,
      difficulty,
      followUp,
      previousQuestion,
      previousAnswer,
      previousEvaluation,
    } = req.body;

    if (!role || !difficulty) {
      return res.status(400).json({
        message: "Role and difficulty are required.",
      });
    }

    let question;

    if (followUp) {
      if (!previousQuestion || !previousAnswer) {
        return res.status(400).json({
          message:
            "Previous question and answer are required for a follow-up question.",
        });
      }

      question = await generateFollowUpQuestion(
        role,
        difficulty,
        previousQuestion,
        previousAnswer,
        previousEvaluation
      );
    } else {
      question = await generateInterviewQuestion(
        role,
        difficulty
      );
    }

    res.status(200).json({
      question,
      isFollowUp: Boolean(followUp),
    });
  } catch (error) {
    console.error(
      "Generate question error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// SUBMIT INTERVIEW ANSWER
// ==========================================

exports.submitAnswer = async (req, res) => {
  try {
    const {
      role,
      difficulty,
      question,
      answer,
    } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message:
          "Unauthorized. User context missing.",
      });
    }

    if (
      !role ||
      !difficulty ||
      !question ||
      !answer
    ) {
      return res.status(400).json({
        message:
          "Role, difficulty, question and answer are required.",
      });
    }

    const feedback = await evaluateAnswer(
      question,
      answer
    );

    const interview = await Interview.create({
      user: req.user.id,
      role,
      difficulty,
      question,
      answer,
      score: feedback.score,
      confidence: feedback.confidence,
      clarity: feedback.clarity,
      technicalAccuracy:
        feedback.technicalAccuracy,
      strengths: feedback.strengths,
      weaknesses: feedback.weaknesses,
      betterAnswer: feedback.betterAnswer,
      tips: feedback.tips,
    });

    await User.findByIdAndUpdate(
      req.user.id,
      {
        $inc: {
          interviewsTaken: 1,
        },
      }
    );

    console.log(
      "Interview saved successfully:",
      interview._id
    );

    res.status(200).json(feedback);
  } catch (error) {
    console.error(
      "Submit answer error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// GET INTERVIEW HISTORY
// ==========================================

exports.getInterviewHistory = async (
  req,
  res
) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message:
          "Unauthorized. User context missing.",
      });
    }

    const interviews = await Interview.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(interviews);
  } catch (error) {
    console.error(
      "Interview history error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// GENERATE FINAL AI INTERVIEW REPORT
// ==========================================

exports.generateFinalReport = async (
  req,
  res
) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message:
          "Unauthorized. User context missing.",
      });
    }

    const {
      role,
      difficulty,
      interviews,
    } = req.body;

    if (!role || !difficulty) {
      return res.status(400).json({
        message:
          "Role and difficulty are required.",
      });
    }

    if (
      !Array.isArray(interviews) ||
      interviews.length === 0
    ) {
      return res.status(400).json({
        message:
          "Interview results are required to generate the final report.",
      });
    }

    /*
     * Only send the fields needed by the AI.
     * This keeps the request smaller and avoids
     * sending unnecessary frontend data.
     */

    const cleanInterviews = interviews.map(
      (item, index) => ({
        questionNumber: index + 1,
        question: item.question || "",
        answer: item.answer || "",
        score: Number(item.score) || 0,
        confidence:
          item.confidence || "",
        clarity:
          item.clarity || "",
        technicalAccuracy:
          item.technicalAccuracy || "",
        strengths:
          Array.isArray(item.strengths)
            ? item.strengths
            : [],
        weaknesses:
          Array.isArray(item.weaknesses)
            ? item.weaknesses
            : [],
        betterAnswer:
          item.betterAnswer || "",
        tips:
          Array.isArray(item.tips)
            ? item.tips
            : [],
      })
    );

    const report =
      await generateFinalInterviewReport(
        role,
        difficulty,
        cleanInterviews
      );

    res.status(200).json(report);
  } catch (error) {
    console.error(
      "Final interview report error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};