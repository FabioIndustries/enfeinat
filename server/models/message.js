import mongoose from "mongoose";

const Schema = mongoose.Schema;

const messagesSchema = mongoose.Schema({
  conversationId: Schema.Types.ObjectId,
  message: String,
  creatorId: Schema.Types.ObjectId,
  isRead: Boolean,
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Message = mongoose.model("Message", messagesSchema);

export default Message;