import { Tweet } from "../models/tweet.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";




export const createTweet=asyncHandler(async(req,res)=>{
    const{tweet}=req.body;
    
    if(!tweet)
     throw new ApiError(400,"tweet should not be empty");

     const result=await Tweet.create({
        tweet:tweet,
        user:req.user._id
     })
     if(!result)
      throw new ApiError(500,"error in publishing your tweet")

     return ApiResponse.send(res,200,result,"Tweet posted successfully")
})