const fs = require("fs");
const pdf = require("pdf-parse");

const { analyzeJobMatchAI } = require("../services/aiService");

// ==========================================
// ANALYZE JOB DESCRIPTION + RESUME MATCH
// ==========================================

exports.analyzeJobMatch = async (req, res) => {
  try {
    // --------------------------------------
    // Validate resume
    // --------------------------------------

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload your resume PDF.",
      });
    }

    // --------------------------------------
    // Validate job description
    // --------------------------------------

    const { jobDescription } = req.body;

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({
        message: "Please provide a job description.",
      });
    }

    // --------------------------------------
    // Read uploaded PDF
    // --------------------------------------

    const buffer = fs.readFileSync(req.file.path);

    const pdfData = await pdf(buffer);

    const resumeText = pdfData.text;

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({
        message:
          "Could not extract text from the uploaded resume.",
      });
    }

    // --------------------------------------
    // Analyze using AI
    // --------------------------------------

    const analysis = await analyzeJobMatchAI(
      resumeText,
      jobDescription.trim()
    );

    // --------------------------------------
    // Delete uploaded file
    // --------------------------------------

    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    // --------------------------------------
    // Return analysis
    // --------------------------------------

    return res.status(200).json(analysis);
  } catch (error) {
    console.error(
      "Job match analysis error:",
      error
    );

    // --------------------------------------
    // Cleanup uploaded file if error occurs
    // --------------------------------------

    if (
      req.file?.path &&
      fs.existsSync(req.file.path)
    ) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      message: error.message,
    });
  }
};