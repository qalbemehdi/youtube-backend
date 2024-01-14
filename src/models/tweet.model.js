import mongoose from "mongoose";

const tweetSchema=new mongoose.Schema({
    tweet:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},{timestamps:true})

export const Tweet=mongoose.model('Tweet',tweetSchema);