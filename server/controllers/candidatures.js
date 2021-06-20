import CandidatureModel from "../models/candidature.js";
import UserModel from "../models/user.js";
import mongoose from "mongoose";

export const getCandidatures = async (req, res) => {
  try {
    const candidatures = await CandidatureModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "creatorId",
          foreignField: "_id",
          as: "creator",
        },
      },
      {
        $project: {
          id_: 1,
          tags: 1,
          createdAt: 1,
          title: 1,
          description: 1,
          availability: 1,
          expMonths: 1,
          creatorId: 1,
          __v: 1,
          "creator.userName": 1,
        },
      },
    ]);

    res.status(200).json(candidatures);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const createCandidature = async (req, res) => {
  const candidature = req.body;

  const user = await UserModel.findOne({ _id: req.userId });
  const newCandidature = new CandidatureModel({
    ...candidature,
    creatorId: req.userId,
  });

  try {
    await newCandidature.save();
    res.status(201).json({ ...newCandidature._doc, creator: [{ userName: user.userName }] });
  } catch (error) {
    res.status(409).json({ message: error });
  }
};

export const updateCandidature = async (req, res) => {
  const { id: _id } = req.params;
  const candidature = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("No candidature with that id");

  const candidatureExists = await CandidatureModel.findOne({
    _id,
    creatorId: req.userId,
  });
  if (!candidatureExists)
    return res.status(400).json({
      error_code: "mismatch_candidature_user",
      message: "Couldn't find an candidature with this id from this user",
    });

  const user = await UserModel.findOne({ _id: req.userId });
  const updatedCandidature = await CandidatureModel.findByIdAndUpdate(_id, { ...candidature, _id }, { new: true });

  res.json({ ...updatedCandidature._doc, creator: [{ userName: user.userName }] });
};

export const deleteCandidature = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("No candidature with that id");

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
