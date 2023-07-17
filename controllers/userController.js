const bcrypt = require("bcrypt");
const userModel = require("../models/user.js");

// Creating or registering users
exports.registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res
        .status(400)
        .send({ message: "Please enter all required fields", success: false });
    }

    // Existing user
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res
        .status(401)
        .send({ message: "User already exists", success: false });
    }

    // Save new user
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      email: email,
      password: hashPassword,
      username: username,
    });
    await newUser.save();

    return res.status(201).send({
      message: "New User created successfully",
      success: true,
      newUser,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error registering", success: false });
  }
};

// Get All users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    return res.status(200).send({
      message: "All users found",
      userCount: users.length,
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error getting users", success: false });
  }
};

// Login User
exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Please enter all required fields", success: false });
    }

    const user = await userModel.findOne({ email: email });

    // New User
    if (!user) {
      return res
        .status(404)
        .send({ message: "User not exists", success: false });
    }

    // Login user
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({
        message: "Invalid email or password",
        success: false,
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "Log in successfully",
        user,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error login user", success: false });
  }
};
