import express from "express";
import {
  getOffers,
  createOffer,
  updateOffer,
  deleteOffer,
} from "../controllers/offers.js";

const router = express.Router();
import auth from "../middleware/auth.js";

router.get("/", getOffers);
router.post("/", auth, createOffer);
router.patch("/:id", auth, updateOffer);
router.delete("/:id", auth, deleteOffer);

export default router;
