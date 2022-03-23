const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId)
    return res
      .status(400)
      .json({ error: true, reason: "User Id param not sent with request" });

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name avatar email",
  });

  if (isChat?.length > 0) {
    return res.status(200).json({ error: false, chat: isChat[0] });
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createChat = await Chat.create(chatData);

      const fullChat = await Chat.findOne({
        _id: createChat._id,
      }).populate("users", "-password");

      return res.status(200).json({ error: false, chat: fullChat });
    } catch (error) {
      return res.status(400).json({
        error: true,
        reason: "Chat not created, Try again after sometime",
      });
    }
  }
});

const fetchChat = asyncHandler(async (req, res) => {
  try {
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name avatar email",
    });

    res.status(200).json({
      error: false,
      chats: chats?.length ? chats : [],
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      reason: "Chat not found",
    });
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name)
    return res
      .status(400)
      .json({ error: true, reason: "Please fill all the fields" });

  let users = [];

  try {
    users = JSON.parse(req.body.users);
  } catch (error) {
    users = req.body.users;
  }

  if (users.length < 2)
    return res
      .status(400)
      .json({ error: true, reason: "At least 2 users are required" });

  users.push(req.user._id);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });

    const fullChatGroup = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.status(200).json({
      error: false,
      chat: fullChatGroup,
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      reason: "Group not created, Try again after sometime",
    });
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  if (!chatId) {
    return res.status(400).json({
      error: true,
      reason: "Chat Id is missing",
    });
  }

  if (!chatName) {
    return res.status(400).json({
      error: true,
      reason: "Chat name is required",
    });
  }

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (updatedChat) {
    return res.status(200).json({
      error: false,
      chat: updatedChat,
    });
  } else {
    return res.status(404).json({
      error: true,
      reason: "Chat not found",
    });
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  if (!chatId) {
    return res.status(400).json({
      error: true,
      reason: "Chat Id is missing",
    });
  }

  if (!userId) {
    return res.status(400).json({
      error: true,
      reason: "User Id is required",
    });
  }

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (added) {
    return res.status(200).json({
      error: false,
      chat: added,
    });
  } else {
    return res.status(400).json({
      error: true,
      reason: "Chat not found",
    });
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  if (!chatId) {
    return res.status(400).json({
      error: true,
      reason: "Chat Id is missing",
    });
  }

  if (!userId) {
    return res.status(400).json({
      error: true,
      reason: "User Id is required",
    });
  }

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (removed) {
    return res.status(200).json({
      error: false,
      chat: removed,
    });
  } else {
    return res.status(400).json({
      error: true,
      reason: "Chat not found",
    });
  }
});

module.exports = {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
