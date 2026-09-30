
const fs = require("fs");
const pdf = require("pdf-parse");

const User = require("../models/User");
const { analyzeResumeAI } = require("../services/aiService");

exports.analyzeResume = async (req, res) => {
  const uploadedPath = req.file?.path;

  try {
    // Verify the logged-in user.
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Unauthorized. User context missing.",
      });
    }

    // Verify that a resume was uploaded.
    if (!req.file || !uploadedPath) {
      return res.status(400).json({
        message: "Please upload a PDF resume.",
      });
    }

    // Read the PDF from the absolute path supplied by Multer.
    const buffer = await fs.promises.readFile(uploadedPath);

    // Extract the text from the uploaded PDF.
    const pdfData = await pdf(buffer);
    const resumeText = pdfData.text?.trim();

    if (!resumeText) {
      return res.status(400).json({
        message:
          "No readable text was found in this PDF. Please upload a text-based PDF resume.",
      });
    }

    // Perform the existing AI-powered resume analysis.
    const analysis = await analyzeResumeAI(resumeText);

    if (!analysis || typeof analysis !== "object") {
      throw new Error("Resume analysis returned an invalid result.");
    }

    // Save the ATS score to MongoDB.
    await User.findByIdAndUpdate(
      req.user.id,
      {
        resumeScore: analysis.atsScore,
      },
      {
        new: true,
      }
    );

    // Return the analysis to the frontend.
    return res.status(200).json(analysis);
  } catch (error) {
    console.error("Resume analysis error:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        message:
          error.message || "An error occurred while analyzing your resume.",
      });
    }
  } finally {
    // Always attempt to remove the temporary uploaded PDF.
    if (uploadedPath) {
      try {
        await fs.promises.unlink(uploadedPath);
      } catch (cleanupError) {
        // ENOENT means the file is already absent.
        if (cleanupError.code !== "ENOENT") {
          console.error(
            "Failed to remove temporary resume:",
            cleanupError.message
          );
        }
      }
    }
  }
};
