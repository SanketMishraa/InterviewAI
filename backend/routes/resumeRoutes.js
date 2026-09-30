
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const authMiddleware = require("../middleware/authMiddleware");
const { analyzeResume } = require("../controllers/resumeController");

const router = express.Router();

// Always use an absolute path instead of a relative "uploads/" path.
const UPLOAD_DIR = path.resolve(__dirname, "..", "uploads");

// Ensure the upload directory exists before Multer saves a file.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdir(UPLOAD_DIR, { recursive: true }, (error) => {
      if (error) {
        return cb(error);
      }

      cb(null, UPLOAD_DIR);
    });
  },

  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    const extension = path.extname(file.originalname).toLowerCase();

    cb(null, `resume-${uniqueSuffix}${extension}`);
  },
});

// Accept PDF files only.
const fileFilter = (req, file, cb) => {
  if (file.mimetype !== "application/pdf") {
    return cb(new Error("Only PDF files are allowed!"));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

// Authentication must run before the file is uploaded.
router.post(
  "/analyze",
  authMiddleware,
  upload.single("resume"),
  analyzeResume
);

module.exports = router;
