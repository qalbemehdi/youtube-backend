import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { toggleSubscription } from "../controller/subscription.controller.js";


const router=Router();

router.route('/toggleSubscription/:id').post(verifyJwt,toggleSubscription)

export default router;