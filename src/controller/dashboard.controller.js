import { Video } from "../models/video.model.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getChannelVideos=asyncHandler(async(req,res)=>{
    const videos=await Video.find({owner:req.user?._id}).select("videofile thumbnail title description duration views").sort("-createdAt")
    return ApiResponse.send(res,200,videos,"successfully fetched videos")
})