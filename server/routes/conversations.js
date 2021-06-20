import express from "express";
import {
  getConversations,
  createConversation,
} from "../controllers/conversations.js";

const router = express.Router();
import auth from "../middleware/auth.js";

router.get("/", auth, getConversations);
router.post("/", auth, createConversation);

export default router;
