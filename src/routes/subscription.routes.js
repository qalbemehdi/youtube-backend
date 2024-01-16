import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { getUserChannelSubscribers, toggleSubscription } from "../controller/subscription.controller.js";


const router=Router();

router.route('/toggleSubscription/:id').post(verifyJwt,toggleSubscription)
router.route('/subscribers/:id').get(verifyJwt,getUserChannelSubscribers)
export default router;