import ConversationModel from "../models/conversation.js";
import UserModel from "../models/user.js";
import mongoose from "mongoose";

export const getConversations = async (req, res) => {
  try {
    const userId = req.userId;

    const outgoingConversations = await ConversationModel.aggregate([
      {
        $match: {
          initiatorId: mongoose.Types.ObjectId(userId)
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "initiatorId",
          foreignField: "_id",
          as: "initiator",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "recipientId",
          foreignField: "_id",
          as: "recipient",
        },
      },
      {
        $project: {
          _id: 1,
          createdAt: 1,
          relatedDocumentId: 1,
          documentType: 1,
          initiatorId: 1,
          recipientId: 1,
          "initiator.userName": 1,
          "recipient.userName": 1,
        },
      },
    ]);

    const incomingConversations = await ConversationModel.aggregate([
      {
        $match: {
          recipientId: mongoose.Types.ObjectId(userId)
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "initiatorId",
          foreignField: "_id",
          as: "initiator",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "recipientId",
          foreignField: "_id",
          as: "recipient",
        },
      },
      {
        $project: {
          _id: 1,
          createdAt: 1,
          relatedDocumentId: 1,
          documentType: 1,
          initiatorId: 1,
          recipientId: 1,
          "initiator.userName": 1,
          "recipient.userName": 1,
        },
      },
    ]);

    res.status(200).json([...incomingConversations, ...outgoingConversations]);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const createConversation = async (req, res) => {
  const conversation = req.body;

  // Check if we already have a conversation for this user and document
  const conversationExists = await ConversationModel.findOne({ relatedDocumentId: conversation.relatedDocumentId, initiatorId: conversation.initiatorId });
  if (conversationExists)
    return res.status(302).json({
      code: "conversation_exists",
    });

  const initiator = await UserModel.findOne({ _id: req.userId });
  const recipient = await UserModel.findOne({ _id: conversation.recipientId });
  recipient.email = undefined;
  recipient.password = undefined;
  recipient.createdAt = undefined;

  const newConversation = new ConversationModel({
    ...conversation,
    initiatorId: req.userId,
  });

  try {
    await newConversation.save();
    res.status(201).json({ ...newConversation._doc, initiator: [initiator], recipient: [recipient] });
  } catch (error) {
    res.status(409).json({ message: error });
  }
};
