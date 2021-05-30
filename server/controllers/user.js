import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserModel from "../models/user.js";

dotenv.config();

const secret = process.env.SECRET;

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const dbUser = await UserModel.findOne({ email });

    if (!dbUser) return res.status(400).json({ error_code: "user_not_found", message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, dbUser.password);

    if (!isPasswordCorrect)
      return res.status(400).json({ error_code: "invalid_login", message: "Invalid credentials" });

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

    if (dbUser)
      return res
        .status(400)
        .json({ error_code: "existing_user", message: "User already exists" });

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
