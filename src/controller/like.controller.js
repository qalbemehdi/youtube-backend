import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import { populate } from "dotenv";


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

export const toggleCommentLike=asyncHandler(async(req,res)=>{
    const {commentId}=req.params;
    
    if(!mongoose.isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid comment id")
    }

    const comment=await Comment.findById(commentId);

    if(!comment){
        throw new ApiError(400,"comment does not exists")
    }

    const query={comment:commentId,likedBy:req.user?._id}
    const like=await Like.findOneAndDelete(query,{ upsert: true });
    if(!like){
        const newLike=await Like.create(query);
        return ApiResponse.send(res,200,newLike,"Video liked successfully")
    }
    return ApiResponse.send(res,200,like,"Video unliked successfully")
})

export const toggleTweetLike =asyncHandler(async(req,res)=>{
    const {tweetId}=req.params;
    
    if(!mongoose.isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid tweet id")
    }

    const tweet=await Tweet.findById(tweetId);

    if(!tweet){
        throw new ApiError(400,"tweet does not exists")
    }

    const query={tweet:tweetId,likedBy:req.user?._id}
    const like=await Like.findOneAndDelete(query,{ upsert: true });
    if(!like){
        const newLike=await Like.create(query);
        return ApiResponse.send(res,200,newLike,"Tweet liked successfully")
    }
    return ApiResponse.send(res,200,like,"Tweet unliked successfully")
})

export const getLikedVideos=asyncHandler(async(req,res)=>{
    
    const videos=await Like.find({likedBy:req.user?._id,video:{$ne:null}}).
    populate({
        path:"video",
        model:"Video",
        select:"thumbnail title description views duration",
        populate:{
            path:"owner",
            model:"User",
            select:"username fullname avatar"
        }
    })
    return ApiResponse.send(res,200,videos,"Liked videos fetched successfully")
})