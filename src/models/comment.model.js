import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    video:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    parent:{
      type:mongoose.ObjectId,
      ref:"Comment"
    },
    ancestors:[{
        type:mongoose.ObjectId,
        ref:"Comment"
        }],
    updated:{
      type:Boolean,
      default:false
    },
    children:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }]
},{timestamps:true})
commentSchema.plugin(mongooseAggregatePaginate)
export const Comment=mongoose.models.Comment||mongoose.model("Comment",commentSchema)