import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { getChannelVideos } from "../controller/dashboard.controller.js";

const router=Router();
router.route("/videos").get(verifyJwt,getChannelVideos)
export default router;