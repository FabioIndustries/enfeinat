import MessageModel from "../models/message.js";
import ConversationModel from "../models/conversation.js";
import UserModel from "../models/user.js";
import mongoose from "mongoose";
import { sendMessageToUser } from "../index.js";

export const getMessages = async (req, res) => {
  try {
    const conversations = req.query.conversations;
    const messages = await MessageModel.find({ conversationId: { $in: conversations } });
    res.status(200).json(messages);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const createMessage = async (req, res) => {
  const message = req.body;

  // Check if the conversation exists
  const conversationExists = await ConversationModel.findOne({ _id: message.conversationId, $or: [{ initiatorId: req.userId }, { recipientId: req.userId }] });
  if (!conversationExists)
    return res.status(302).json({
      error_code: "unknown_conversation",
    });

  const newMessage = new MessageModel({
    ...message,
    creatorId: req.userId,
  });

  try {
    await newMessage.save();

    let targetId;
    if (conversationExists.initiatorId.toString() === req.userId) {
      targetId = conversationExists.recipientId;
    } else {
      targetId = conversationExists.initiatorId;
    }
    sendMessageToUser({ userId: targetId.toString(), conversationId: message.conversationId });
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(409).json({ message: error });
  }
};

export const markAsRead = async (req, res) => {
  const messages = req.body;
  const result = await MessageModel.updateMany({ _id: { $in: messages } }, { isRead: true });
  res.status(200).json(result);
};
