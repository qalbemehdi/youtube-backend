import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import { Like } from "../models/like.model.js";


export const toggleVideoLike=asyncHandler(async(req,res)=>{
    const {videoId}=req.params;
    
    if(!mongoose.isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video id")
    }

    const video=await Video.findById(videoId);
    if(!video){
        throw new ApiError(400,"Video does not exists")
    }

    const query={video:videoId,likedBy:req.user?._id}
    const like=await Like.findOneAndDelete(query,{ upsert: true });
    if(!like){
        const newLike=await Like.create(query);
        return ApiResponse.send(res,200,newLike,"Video liked successfully")
    }
    return ApiResponse.send(res,200,like,"Video unliked successfully")
})

