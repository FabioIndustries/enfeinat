import express from "express";
import {
  getCandidatures,
  createCandidature,
  updateCandidature,
  deleteCandidature,
} from "../controllers/candidatures.js";

const router = express.Router();
import auth from "../middleware/auth.js";

router.get("/", getCandidatures);
router.post("/", auth, createCandidature);
router.patch("/:id", auth, updateCandidature);
router.delete("/:id", auth, deleteCandidature);

export default router;
