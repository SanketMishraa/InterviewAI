const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/authController");


// Register
router.post("/register", register);


// Login
router.post("/login", login);


// Get logged-in user's profile
router.get(
  "/profile",
  authMiddleware,
  getProfile
);


// Update logged-in user's profile
router.put(
  "/profile",
  authMiddleware,
  updateProfile
);


// Change logged-in user's password
router.put(
  "/change-password",
  authMiddleware,
  changePassword
);


module.exports = router;