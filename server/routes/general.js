import express from "express";
import { getGeneralNumbers } from "../controllers/general.js";

const router = express.Router();

router.get("/numbers", getGeneralNumbers);

export default router;
