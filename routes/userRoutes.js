const express = require("express");
const {
  getAllUsers,
  registerController,
  loginController,
} = require("../controllers/userController");

const router = express.Router();

// Get all users
router.get("/all-users", getAllUsers);

// Create a new user
router.post("/register", registerController);

// Login user
router.post("/login", loginController);

module.exports = router;
