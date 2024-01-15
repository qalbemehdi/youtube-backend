import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { createTweet, deleteTweet, getUserTweet, updateTweet } from "../controller/tweet.controller.js";


const router=Router();

router.route('/create').post(verifyJwt,createTweet)
router.route('/user/:id').get(getUserTweet)
router.route('/update/:id').patch(verifyJwt,updateTweet)
router.route('/delete/:id').delete(verifyJwt,deleteTweet)
export default router;