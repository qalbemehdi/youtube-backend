import { Router } from "express";
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controller/playlist.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";


const router=Router();

router.route("/").post(verifyJwt,createPlaylist)
router.route("/user/:userId").get(getUserPlaylists)
router.route("/:playlistId").get(getPlaylistById).delete(verifyJwt,deletePlaylist)
.patch(verifyJwt,updatePlaylist)
router.route("/add/:playlistId/:videoId").patch(verifyJwt,addVideoToPlaylist);
router.route("/remove/:playlistId/:videoId").patch(verifyJwt,removeVideoFromPlaylist);

export default router;