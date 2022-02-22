const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const User = require("../models/userModel");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, avatar } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: true, reason: "Please Enter all the Fields" });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ error: true, reason: "User already exists" });
  }

  const user = await User.create({
    name,
    email,
    password,
    avatar,
  });

  if (user) {
    return res.status(201).json({
      error: false,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        token: generateToken(user._id),
      },
    });
  } else {
    return res
      .status(400)
      .json({ error: true, reason: "Failed to Create the User" });
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, reason: "Please Enter all the Fields" });
  }

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    return res.status(200).json({
      error: false,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        token: generateToken(user._id),
      },
    });
  } else {
    return res
      .status(401)
      .json({ error: true, reason: "Invalid Email or Password" });
  }
});

module.exports = { registerUser, authUser };
