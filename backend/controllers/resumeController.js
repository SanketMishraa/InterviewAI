const fs = require("fs");
const pdf = require("pdf-parse");

const User = require("../models/User");
const { analyzeResumeAI } = require("../services/aiService");

exports.analyzeResume = async (req, res) => {
  try {

    // Check logged-in user
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Unauthorized. User context missing.",
      });
    }

    // Check uploaded file
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a PDF resume.",
      });
    }

    // Read PDF
    const buffer = fs.readFileSync(req.file.path);

    // Extract PDF text
    const pdfData = await pdf(buffer);

    // Send resume text to Groq
    const analysis = await analyzeResumeAI(pdfData.text);

    // Save ATS score to MongoDB
    await User.findByIdAndUpdate(
      req.user.id,
      {
        resumeScore: analysis.atsScore,
      },
      {
        new: true,
      }
    );

    // Delete temporary PDF
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    // Send analysis to frontend
    res.status(200).json(analysis);

  } catch (error) {

    console.error("Resume analysis error:", error);

    // Remove uploaded file if an error occurs
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      message: error.message,
    });
  }
};
