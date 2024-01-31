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
      type:String
    },
    children:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }]
})
commentSchema.plugin(mongooseAggregatePaginate)
export const Comment=mongoose.models.Comment||mongoose.model("Comment",commentSchema)