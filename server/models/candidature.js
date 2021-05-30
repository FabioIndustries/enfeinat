import mongoose from "mongoose";

const Schema = mongoose.Schema;

const candidaturesSchema = mongoose.Schema({
  title: String,
  description: String,
  tags: [String],
  availability: String,
  expMonths: Number,
  creatorId: Schema.Types.ObjectId,
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Candidature = mongoose.model("Candidature", candidaturesSchema);

export default Candidature;