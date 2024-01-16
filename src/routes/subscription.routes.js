import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controller/subscription.controller.js";


const router=Router();

router.route('/toggleSubscription/:id').post(verifyJwt,toggleSubscription)
router.route('/subscribers/:id').get(verifyJwt,getUserChannelSubscribers)
router.route('/subscribedChannels/:id').get(verifyJwt,getSubscribedChannels)
export default router;