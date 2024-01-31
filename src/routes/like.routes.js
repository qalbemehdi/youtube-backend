import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { toggleVideoLike } from "../controller/like.controller.js";

const router=Router();
router.use(verifyJwt);
router.route("/video/:videoId").post(toggleVideoLike);

export default router;