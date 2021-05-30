import CandidatureModel from "../models/candidature.js";
import mongoose from "mongoose";

export const getCandidatures = async (req, res) => {
  try {
    const candidatures = await CandidatureModel.find();
    res.status(200).json(candidatures);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const createCandidature = async (req, res) => {
  const candidature = req.body;

  const newCandidature = new CandidatureModel({
    ...candidature,
    creatorId: req.userId,
  });

  try {
    await newCandidature.save();
    res.status(201).json(newCandidature);
  } catch (error) {
    res.status(409).json({ message: error });
  }
};

export const updateCandidature = async (req, res) => {
  const { id: _id } = req.params;
  const candidature = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No candidature with that id");

  const candidatureExists = await CandidatureModel.findOne({
    _id,
    creatorId: req.userId,
  });
  if (!candidatureExists)
    return res.status(400).json({
      error_code: "mismatch_candidature_user",
      message: "Couldn't find an candidature with this id from this user",
    });

  const updatedCandidature = await CandidatureModel.findByIdAndUpdate(
    _id,
    { ...candidature, _id },
    { new: true }
  );

  res.json(updatedCandidature);
};

export const deleteCandidature = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No candidature with that id");

  const candidatureExists = await CandidatureModel.findOne({
    _id,
    creatorId: req.userId,
  });
  if (!candidatureExists)
    return res.status(400).json({
      error_code: "mismatch_candidature_user",
      message: "Couldn't find an candidature with this id from this user",
    });

  await CandidatureModel.findByIdAndRemove(_id);

  res.json({ message: "Candidature deleted successfully" });
};
