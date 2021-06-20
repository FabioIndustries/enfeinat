import express from "express";
const router = express.Router();
import auth from "../middleware/auth.js";

import { signin, signup, updateUser } from "../controllers/user.js";

router.post("/login", signin);
router.post("/signup", signup);
router.post("/updateuser", auth, updateUser);

export default router;