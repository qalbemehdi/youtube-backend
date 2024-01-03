import { Router } from "express";
import { changeCurrentPassword, loginUser, logoutUser, registerUser } from "../controller/user.controller.js";
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
export default router;