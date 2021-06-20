import mongoose from "mongoose";

const Schema = mongoose.Schema;

const conversationsSchema = mongoose.Schema({
  relatedDocumentId: Schema.Types.ObjectId,
  documentType: Number,
  initiatorId: Schema.Types.ObjectId,
  recipientId: Schema.Types.ObjectId,
  active: Boolean,
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Conversation = mongoose.model("Conversation", conversationsSchema);

export default Conversation;