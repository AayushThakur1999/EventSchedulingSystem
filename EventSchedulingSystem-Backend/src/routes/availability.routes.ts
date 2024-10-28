import {Router} from 'express'
import { addAvailability } from '../controllers/availability.controller';
import { verifyJWT } from '../middlewares/auth.middleware';

const router = Router()

router.use(verifyJWT)
router.route("/add-availability").post(addAvailability)

export default router;