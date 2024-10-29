import { Router } from "express";
import {
  addAvailability,
  getUserAvailabilities,
} from "../controllers/availability.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.use(verifyJWT);
router.route("/add-availability").post(addAvailability);
router.route("/getUserAvailabilities/:userId").get(getUserAvailabilities);

export default router;
