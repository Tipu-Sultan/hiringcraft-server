const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');

const startChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const existingChat = await Chat.findOne({
    participants: { $all: [req.user._id, userId] },
  });

  if (existingChat) {
    res.json(existingChat);
  } else {
    const chat = new Chat({
      participants: [req.user._id, userId],
    });

    const createdChat = await chat.save();
    res.status(201).json(createdChat);
  }
});

const sendMessage = asyncHandler(async (req, res) => {
  const { chatId, message, attachments } = req.body;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      res.status(404);
      throw new Error('Chat not found');
    }

    chat.messages.push({
      sender: req.user._id,
      message,
      attachments,
    });

    const updatedChat = await chat.save();
    res.json(updatedChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getChatMessages = asyncHandler(async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id).populate('messages.sender', 'name email');

    if (!chat) {
      res.status(404);
      throw new Error('Chat not found');
    }

    res.json(chat.messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = {
  startChat,
  sendMessage,
  getChatMessages,
};