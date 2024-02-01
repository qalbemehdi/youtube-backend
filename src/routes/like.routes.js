import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controller/like.controller.js";

const router=Router();
router.use(verifyJwt);
router.route("/video/:videoId").post(toggleVideoLike);
router.route("/comment/:videoId").post(toggleCommentLike);
router.route("/tweet/:tweetId").post(toggleTweetLike);
router.route("/videos").get(getLikedVideos)
export default router;