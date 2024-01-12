import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary, {
  deleteOnCloudinary,
  publicId,
} from "../utils/cloudinary.util.js";
import { ObjectId } from "mongodb";
import fs from "fs";

export const getAllVideo = asyncHandler(async (req, res) => {
  const { limit = 10, page = 1, query, userId } = req.query;

  return ApiResponse.send(res, 200, req.query, "successfully fetched videos");
});

export const publishVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const videoFile = req.files?.video?.[0]?.path;
  const thumbnailFile = req.files?.thumbnail?.[0]?.path;

  if (!title.trim() || !description.trim() || !videoFile || !thumbnailFile)
    throw new ApiError(400, "all fields are required");

  const thumbnailRes = await uploadOnCloudinary(thumbnailFile);
  if (!thumbnailRes.url)
    throw new ApiError(500, "error in uploading thumbnail file on server");

  const videoRes = await uploadOnCloudinary(videoFile);
  if (!videoRes.url)
    throw new ApiError(500, "error in uploading video file on server");

  const video = await Video.create({
    title,
    description,
    videofile: videoRes.url,
    thumbnail: thumbnailRes.url,
    duration: videoRes.duration,
    owner: req.user._id,
  });
  if (!video) throw new ApiError(500, "error in publishing video");
  return ApiResponse.send(res, 200, video, "video published successfully");
});

export const getVideoById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id))
    throw new ApiError(400, "video is unavailable");

  //   const video = await Video.findById({_id:id}).populate("owner",'fullname username avatar');
  const video = await Video.aggregate([
    {
      $match: { _id: new ObjectId(id) },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "channel",
              as: "subscribers",
            },
          },
          {
            $project: {
              username: 1,
              fullname: 1,
              avatar: 1,
              isSubscribed: { $in: [req.user?._id, "$subscribers.subscriber"] },
              subscribers: { $size: "$subscribers" },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: { $first: "$owner" },
      },
    },
  ]);
  if (!video[0]) throw new ApiError(400, "video is unavailable");
  return ApiResponse.send(res, 200, video[0], "video successfully fetched");
  //ToDo:is subscribed functionality
});

export const updateVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const thumbnailPath = req.file?.path;

  if (!mongoose.isValidObjectId(id))
    throw new ApiError(400, "video is unavailable");

  const video = await Video.findById(id);

  if (!req.user._id.equals(video?.owner)) {
    if (thumbnailPath) fs.unlinkSync(thumbnailPath);
    throw new ApiError(400, "dont have permission to update video");
  }

  const oldThumbnail = video.thumbnail;
  const thumbnailRes = thumbnailPath
    ? await uploadOnCloudinary(thumbnailPath)
    : "";

  video.title = title.trim() || video.title;
  video.description = description.trim() || video.description;
  video.thumbnail = thumbnailRes?.url || oldThumbnail;
  if (thumbnailRes?.url) {
    const publicId = publicId(oldThumbnail);
    deleteOnCloudinary(publicId);
  }
  await video.save({ validateBeforeSave: false });
  return ApiResponse.send(res, 200, video, "update successfully");
});

export const deleteVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id))
    throw new ApiError(400, "video is unavailabe");

  const video = await Video.findById(id);

  if (!req.user._id.equals(video?.owner))
    throw new ApiError(400, "don't have permission to delete video");

  const publicIdOfVideo = publicId(video.videofile);
  const publicIdOfThumbnail = publicId(video.thumbnail);

  const resp = await Video.deleteOne({ _id: id });

  if (!resp?.acknowledged) throw new ApiError(500, "error in deleting video");

  deleteOnCloudinary(publicIdOfVideo, "video");
  deleteOnCloudinary(publicIdOfThumbnail);

  return ApiResponse.send(res, 200, resp, "video deleted successfully");
});

export const togglePublishStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id))
    throw new ApiError(400, "video is unavailabe");

  const video = await Video.findById(id);

  if (!req.user._id.equals(video?.owner))
    throw new ApiError(400, "don't have permission to toggle the publish status");
  
    video.isPublished=!video.isPublished;
    await video.save({validateBeforeSave:false})

    return ApiResponse.send(res,200,{isPublished:video.isPublished},"publish status of the video updated")
});
