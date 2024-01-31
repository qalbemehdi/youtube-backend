import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controller/like.controller.js";

const router=Router();
router.use(verifyJwt);
router.route("/video/:videoId").post(toggleVideoLike);
router.route("/comment/:videoId").post(toggleCommentLike);
router.route("/tweet/:tweetId").post(toggleTweetLike);
export default router;