import { Router } from "express";
import { deleteVideo, getAllVideo, getVideoById, publishVideo, togglePublishStatus, updateVideo } from "../controller/video.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/results").get(getAllVideo);
router.route("/upload").post(verifyJwt,
  upload.fields([
    {
      name:"video",
      maxCount: 1,
    },
    {
        name:"thumbnail",
        maxCount:1
    },
  ]),
  publishVideo
);
router.route('/watch/:id').get(verifyJwt,getVideoById);
router.route('/update/:id').patch(verifyJwt,upload.single('thumbnail'),updateVideo);
router.route('/delete/:id').delete(verifyJwt,deleteVideo)
router.route('/toggle/publish/:id').patch(verifyJwt,togglePublishStatus)
export default router;
