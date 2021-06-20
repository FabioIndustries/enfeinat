import express from "express";
import {
  getMessages,
  createMessage,
  markAsRead,
} from "../controllers/messages.js";

const router = express.Router();
import auth from "../middleware/auth.js";

router.get("/", auth, getMessages);
router.post("/", auth, createMessage);
router.patch("/", auth, markAsRead);

export default router;
