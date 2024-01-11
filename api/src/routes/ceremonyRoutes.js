import express from "express";
import { validateCeremonyCreate } from "../middleware/validators/ceremonyValidator.js";
import { getCeremonies, createCeremony } from "../controllers/ceremonyController.js";


const router = express.Router();
router.get("/", getCeremonies);
router.post("/", validateCeremonyCreate, createCeremony);


export default router;
