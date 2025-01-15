import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addAttendee,
  getEventNames,
  getAttendeeSessions,
  getAllAttendeeSessions,
  removeAttendee,
} from "../controllers/attendee.controller.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all the routes in this file

router.route("/add-attendee").post(addAttendee);
router.route("/eventNames").get(getEventNames);
router.route("/get-mySessions").get(getAttendeeSessions);
router.route("/get-AllSessions").get(getAllAttendeeSessions);
router.route("/removeAttendee/:attendeeId").delete(removeAttendee);

export default router;
