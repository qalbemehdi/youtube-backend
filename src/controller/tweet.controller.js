import { ObjectId } from "mongodb";
import { Tweet } from "../models/tweet.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";




export const createTweet=asyncHandler(async(req,res)=>{
    const{tweet}=req.body;

    if(!tweet.trim())
     throw new ApiError(400,"tweet should not be empty");

     const result=await Tweet.create({
        tweet:tweet,
        user:req.user._id
     })
     if(!result)
      throw new ApiError(500,"error in publishing your tweet")

     return ApiResponse.send(res,200,result,"Tweet posted successfully")
})

export const getUserTweet=asyncHandler(async(req,res)=>{
    const{id}=req.params;
    if(!mongoose.isValidObjectId(id))
       throw new ApiError(400,"page does not exists")

   const tweets= await Tweet.find({user:id}).populate('user',"username fullname avatar")
    
    return ApiResponse.send(res,200,tweets,"tweets successfully fetched")
})

export const updateTweet=asyncHandler(async(req,res)=>{
    const{id}=req.params;
    const{tweet}=req.body;
       if(!tweet.trim())
       throw new ApiError(400,"tweet field should not be empty")

    if(!mongoose.isValidObjectId(id))
       throw new ApiError(400,"page does not exists")

    const userTweet=await Tweet.findById({_id:id})
         
     if(!req.user._id.equals(userTweet?.user))
     throw new ApiError(400,"dont have permission to update tweet")
     
     userTweet.tweet=tweet.trim();
     await userTweet.save({validateBeforeSave:false})

    return ApiResponse.send(res,200,userTweet,"tweet update successfully")
})

export const deleteTweet=asyncHandler(async(req,res)=>{
    const{id}=req.params;
    if(!mongoose.isValidObjectId(id))
    throw new ApiError(400,"page does not exists")

    const tweet = await Tweet.findOneAndDelete({ _id: id, user: req.user._id });

    if (!tweet) {
      // No tweet found with the given ID and user combination
      throw new ApiError(404, "Tweet not found");
    }

    return ApiResponse.send(res,200,tweet,"tweet successfully deleted")
})