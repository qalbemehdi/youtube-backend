import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { addComment, deleteComment, getVideoComments, replyComment, updateComment } from "../controller/comment.controller.js";


const router=Router();
router.route("/add/:videoId").post(verifyJwt,addComment)
router.route("/update/:commentId").patch(verifyJwt,updateComment)
router.route("/delete/:commentId").delete(verifyJwt,deleteComment)
router.route("/reply/:commentId").post(verifyJwt,replyComment)
router.route("/:videoId").get(getVideoComments)

export default router;