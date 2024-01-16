import mongoose from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";


export const toggleSubscription=asyncHandler(async(req,res)=>{

const {id}=req.params;
if(!mongoose.isValidObjectId(id)){
    throw new Error("Invalid id can't toggle subscription")
}
const user=await User.findById(id);
if(!user){
    throw new Error("Channel does not exists")
}
  const channel=await Subscription.findOneAndDelete({channel:id,subscriber:req.user?._id})
 
  if(!channel)
   {
    await Subscription.create({channel:id,subscriber:req.user?._id})
   }
 
  return ApiResponse.send(res,200,channel,channel?"Channel unsubscribed":"Channel subscribed")
})

export const getUserChannelSubscribers=asyncHandler(async(req,res)=>{
    const{id}=req.params;
    if(!mongoose.isValidObjectId(id)){
        throw new Error("channel does not exists")
    }
    const subscribers=await Subscription.find({channel:id}).populate("subscriber","username fullname avatar")

    return ApiResponse.send(res,200,subscribers,"Subscribers fetched successfully")
})