import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";
import UserModel from "../models/user.js";

dotenv.config();

const secret = process.env.SECRET;

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const dbUser = await UserModel.findOne({ email });

    if (!dbUser) return res.status(400).json({ error_code: "user_not_found", message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, dbUser.password);

    if (!isPasswordCorrect) return res.status(400).json({ error_code: "invalid_login", message: "Invalid credentials" });

    const token = jwt.sign({ email: dbUser.email, _id: dbUser._id }, secret, {
      expiresIn: "1d",
    });

    res.status(200).json({ result: dbUser, token });
  } catch (err) {
    res.status(500).json({ error_code: "login_other", message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { email, userName, password } = req.body;

  try {
    const dbUser = await UserModel.findOne({ $or: [{ email }, { userName }] });

    if (dbUser) return res.status(400).json({ error_code: "existing_user", message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await UserModel.create({
      email,
      userName,
      password: hashedPassword,
    });

    const token = jwt.sign({ email: result.email, _id: result._id }, secret, {
      expiresIn: "1d",
    });

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ error_code: "signup_other", message: "Something went wrong" });

    console.error(error);
  }
};

export const updateUser = async (req, res) => {
  const _id = req.userId;
  const { email, userName } = req.body;

  if (!email || !userName) {
    return res.status(404).send("Incomplete request");
  }

  if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("No user with that id");

  const userNameExists = await UserModel.findOne({
    userName,
    _id: { $ne: _id },
  });
  if (userNameExists)
    return res.status(400).json({
      error_code: "username_in_use",
      message: "That username is already being used",
    });

  const emailExists = await UserModel.findOne({
    email,
    _id: { $ne: _id },
  });
  if (emailExists)
    return res.status(400).json({
      error_code: "email_in_use",
      message: "That email is already being used",
    });

  let updatedUser;

  if (req.body.password?.length >= 3) {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    updatedUser = await UserModel.findByIdAndUpdate(_id, { ...req.body, _id, password: hashedPassword }, { new: true });
  } else {
    delete req.body.password;
    updatedUser = await UserModel.findByIdAndUpdate(_id, { ...req.body, _id }, { new: true });
  }

  res.json(updatedUser);
};
