import { Router } from "express";
import { changeCurrentPassword, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, registerUser, updateAccountDetails, updateAvatar, updateCoverImage } from "../controller/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJwt } from "../middleware/auth.middleware.js";


 const router=Router();
 
router.route("/register").post(upload.fields([
    {
      name:"avatar",
      maxCount:1
    },
    {
      name:"coverImage",
      maxCount:1
    }
]),

    registerUser);

    router.route("/login").post(loginUser);
    router.route("/logout").post(verifyJwt,logoutUser)
    router.route("/change-password").patch(verifyJwt,changeCurrentPassword);
    router.route("/update-account-details").patch(verifyJwt,updateAccountDetails);
    router.route("/update-avatar").patch(verifyJwt,upload.single("avatar"),updateAvatar);
    router.route("/update-cover-image").patch(verifyJwt,upload.single("coverImage"),updateCoverImage);
    router.route("/:username").get(verifyJwt,getUserChannelProfile)
    router.route("/feed/watch-history").get(verifyJwt,getWatchHistory)

export default router;