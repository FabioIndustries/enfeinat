import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.SECRET;

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedData = jwt.verify(token, secret);
    req.userId = decodedData?._id;
    next();
  } catch (error) {
    console.error(error);
  }
};

export default auth;
