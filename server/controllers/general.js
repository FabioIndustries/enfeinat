import UserModel from "../models/user.js";
import OfferModel from "../models/offer.js";
import CandidatureModel from "../models/candidature.js";

import mongoose from "mongoose";

export const getGeneralNumbers = async (req, res) => {
  try {
    const users = await UserModel.find().countDocuments();
    const offers = await OfferModel.find().countDocuments();
    const candidatures = await CandidatureModel.find().countDocuments();
    res.status(200).json({ offers, users, candidatures });
  } catch (error) {
    res.status(404).json({ message: error });
  }
};
