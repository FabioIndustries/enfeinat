import mongoose from "mongoose";

const Schema = mongoose.Schema;

const offersSchema = mongoose.Schema({
  title: String,
  description: String,
  tags: [String],
  salary: {
    min: Number,
    max: Number,
  },
  contractType: String,
  permitRequired: Boolean,
  location: String,
  creatorId: Schema.Types.ObjectId,
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Offer = mongoose.model("Offer", offersSchema);

export default Offer;