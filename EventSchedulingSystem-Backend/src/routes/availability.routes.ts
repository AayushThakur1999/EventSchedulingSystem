import { Router } from "express";
import {
  addAvailability,
  deleteUserAvailability,
  getAllUserAvailabilities,
  getUserAvailabilities,
} from "../controllers/availability.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);
router.route("/add-availability").post(addAvailability);
router.route("/getUserAvailabilities/:userId").get(getUserAvailabilities);
router.route("/deleteAvailability/:docID").delete(deleteUserAvailability);
router.route("/getAllUserAvailabilities").get(getAllUserAvailabilities);

export default router;
