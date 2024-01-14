import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { createTweet } from "../controller/tweet.controller.js";


const router=Router();

router.route('/create').post(verifyJwt,createTweet)

export default router;