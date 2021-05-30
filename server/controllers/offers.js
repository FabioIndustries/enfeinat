import OfferModel from "../models/offer.js";
import UserModel from "../models/user.js";
import mongoose from "mongoose";

export const getOffers = async (req, res) => {
  try {
    const offers = await OfferModel.aggregate([
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
          salary: 1,
          contractType: 1,
          permitRequired: 1,
          location: 1,
          creatorId: 1,
          __v: 1,
          "creator.userName": 1,
        },
      },
    ]);
    res.status(200).json(offers);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const createOffer = async (req, res) => {
  const offer = req.body;

  const user = await UserModel.findOne({ _id: req.userId });
  const newOffer = new OfferModel({
    ...offer,
    creatorId: req.userId,
  });

  try {
    await newOffer.save();
    res
      .status(201)
      .json({ ...newOffer._doc, creator: [{ userName: user.userName }] });
  } catch (error) {
    res.status(409).json({ message: error });
  }
};

export const updateOffer = async (req, res) => {
  const { id: _id } = req.params;
  const offer = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No offer with that id");

  const offerExists = await OfferModel.findOne({ _id, creatorId: req.userId });
  if (!offerExists)
    return res.status(400).json({
      error_code: "mismatch_offer_user",
      message: "Couldn't find an offer with this id from this user",
    });

  const updatedOffer = await OfferModel.findByIdAndUpdate(
    _id,
    { ...offer, _id },
    { new: true }
  );

  res.json(updatedOffer);
};

export const deleteOffer = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No offer with that id");

  const offerExists = await OfferModel.findOne({ _id, creatorId: req.userId });
  if (!offerExists)
    return res.status(400).json({
      error_code: "mismatch_offer_user",
      message: "Couldn't find an offer with this id from this user",
    });

  await OfferModel.findByIdAndRemove(_id);

  res.json({ message: "Offer deleted successfully" });
};
