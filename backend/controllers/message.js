const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId)
    return res
      .status(400)
      .json({ error: true, reason: "Invalid data passed into request" });

  const chat = await Chat.findById(chatId);

  if (!chat)
    return res.status(400).json({ error: true, reason: "Chat not found" });

  const newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  };

  let message = await Message.create(newMessage);

  message = await message.populate("sender", "_id name avatar email");
  message = await message.populate("chat");
  message = await User.populate(message, {
    path: "chat.users",
    select: "_id name avatar email",
  });

  chat["latestMessage"] = message._id;

  await chat.save();

  return res.status(200).json({ error: false, message });
});

const getAllMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  if (!chatId)
    return res
      .status(400)
      .json({ error: true, reason: "Invalid data passed into request" });

  const chat = await Chat.findById(chatId);

  if (!chat)
    return res.status(400).json({ error: true, reason: "Chat not found" });

  const messages = await Message.find({ chat: chatId })
    .populate("sender", "_id name avatar email")
    .exec();

  return res
    .status(200)
    .json({ error: false, messages: messages?.length ? messages : [] });
});

module.exports = {
  sendMessage,
  getAllMessages,
};
