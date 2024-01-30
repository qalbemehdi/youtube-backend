import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";

export const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    throw new Error("Playlist title is required");
  }
  const playlist = await Playlist.create({
    title: name,
    description,
    createdBy: req.user?._id,
  });
  if (!playlist) {
    throw new ApiError(500, "something went wrong while creating playlist");
  }

  return ApiResponse.send(res, 200, playlist, "Playlist created successfully");
});

export const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user id");
  }
  const playlists = await Playlist.find({ createdBy: userId }).populate(
    "createdBy",
    "username fullname avatar"
  );
  if (playlists.length === 0) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(400, "User does not exists");
    }
  }
  return ApiResponse.send(
    res,
    200,
    playlists,
    "User playlists fetched successfully"
  );
});

export const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!mongoose.isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist id");
  }
  const playlist = await Playlist.findById(playlistId).populate(
    "createdBy",
    "username fullname avatar"
  );
  if (!playlist) {
    throw new ApiError(400, "Playlist does not exists");
  }
  return ApiResponse.send(res, 200, playlist, "Playlist fetched successfully");
});

export const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (
    !mongoose.isValidObjectId(playlistId) ||
    !mongoose.isValidObjectId(videoId)
  ) {
    throw new ApiError(400, "Invalid id");
  }
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "Video does not exists");
  }

  let playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(400, "Playlist does not exists");
  }
  if (playlist.videos.includes(videoId)) {
    throw new ApiError(400, "Video already exists in playlist");
  }

  playlist.videos.push(videoId);
  playlist = await playlist.save({ validateBeforeSave: false });

  return ApiResponse.send(
    res,
    200,
    playlist,
    "Video added to playlist successfully"
  );
});

export const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!mongoose.isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist id");
  }

  // Ensure the authenticated user is the owner of the playlist
  const deletedPlaylist = await Playlist.findOneAndDelete({
    _id: playlistId,
    createdBy: req.user?._id,
  });

  if (!deletedPlaylist) {
    throw new ApiError(
      400,
      "Playlist does not exist or you do not have permission to delete it"
    );
  }

  return ApiResponse.send(
    res,
    200,
    deletedPlaylist,
    "Playlist deleted successfully"
  );
});

export const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;
    if (!mongoose.isValidObjectId(playlistId)) {
      throw new ApiError(400, "Invalid playlist id");
    }
    if(name.trim().length===0){
      throw new ApiError(400,"Playlist title is required")
    }
   const playlist=  await Playlist.findOneAndUpdate( 
        { _id: playlistId, createdBy: req.user?._id },
        { title: name, description },
        { new: true }
      )
      if(!playlist){
        throw new ApiError(400,"Playlist does not exists or you do not have permission to update it")
      }
        return ApiResponse.send(res,200,playlist,"Playlist updated successfully")
})