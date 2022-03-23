const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const User = require("../models/userModel");

// /api/user/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, avatar } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: true, reason: "Please Enter all the Fields" });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res
      .status(400)
      .json({ error: true, reason: "User email already exists" });
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
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } else {
    return res
      .status(400)
      .json({ error: true, reason: "Failed to Create the User" });
  }
});

// /api/user/login
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
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } else {
    return res
      .status(400)
      .json({ error: true, reason: "Invalid Email or Password" });
  }
});

// /api/user?search=pardeep
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  keyword["_id"] = { $ne: req.user._id };

  const users = await User.find(keyword);

  return res
    .status(200)
    .json({ error: false, users: users?.length ? users : [] });
});

const getLoggedInUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.user._id }).select("-password");

  if (user) {
    return res.status(200).json({ error: false, user: user });
  } else {
    return res.status(401).json({ error: true, reason: "Unauthorized" });
  }
});

module.exports = { registerUser, authUser, allUsers, getLoggedInUserDetails };
