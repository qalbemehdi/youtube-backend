import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { Comment } from "../models/comment.model.js";
import ApiResponse from "../utils/apiResponse.js";
import { Video } from "../models/video.model.js";

export const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { comment } = req.body;

  if (!comment.trim()) throw new ApiError(400, "comment cannot be empty");
  if (!mongoose.isValidObjectId(videoId))
    throw new ApiError(400, "Invalid video id:-can't comment");
  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(400, "video does not exist:can't comment");

  const createdComment = await Comment.create({
    content: comment,
    author: req.user?._id,
    video: videoId,
    parent: null,
  });
  if (!createdComment)
    throw new ApiError(500, "error in the server not able to post the comment");

  return ApiResponse.send(
    res,
    200,
    createdComment,
    "comment posted successfully"
  );
});

export const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { comment } = req.body;

  if (!comment.trim()) throw new ApiError(400, "comment cannot be empty");

  if (!mongoose.isValidObjectId(commentId))
    throw new ApiError(400, "Invalid video id:-can't update comment");

  const commentDocument = await Comment.findOneAndUpdate(
    {_id:commentId,author:req.user?._id},
    {content:comment,updated:true},
    {new:true});

  if (!commentDocument)
    throw new ApiError(400, "comment does not exist:can't update comment or do not have permission to update this comment");

    return ApiResponse.send(res,200,commentDocument,"comment updated successfully")
});

//Advanced way to delete multilevel nested comment system
export const deleteComment=asyncHandler(async(req,res)=>{
    const { commentId } = req.params;
  
    if (!mongoose.isValidObjectId(commentId))
      throw new ApiError(400, "Invalid video id:-can't update comment");
  
    const deletedComment = await Comment.deleteOne({_id:commentId,author:req.user?._id});
    if (!deletedComment.deletedCount)
      throw new ApiError(400, "comment does not exist:can't delete comment or do not have permission to delete this comment");
     const deletedReply=await Comment.deleteMany({ancestors:commentId})
      return ApiResponse.send(res,200,{deletedComment,deletedReply},"comment deleted successfully")
})

export const replyComment=asyncHandler(async(req,res)=>{
    const { commentId } = req.params;
    const { comment } = req.body;
  
    if (!comment.trim()) throw new ApiError(400, "comment cannot be empty");
  
    if (!mongoose.isValidObjectId(commentId))
      throw new ApiError(400, "Invalid comment id:-can't reply comment");
  
    const commentDocument = await Comment.findById(commentId)
  
    if (!commentDocument)
      throw new ApiError(400, "comment does not exist:can't reply comment");

      const ancestors=[...commentDocument.ancestors,commentId]
    const replyComment=await Comment.create(
        {
            content:comment,
            parent:commentId,
            author:req.user?._id,
            video:commentDocument.video,
            ancestors
        })
        commentDocument.children.push(replyComment._id)
        await commentDocument.save({validateBeforeSave:false})
      return ApiResponse.send(res,200,replyComment,"comment replied successfully")

})

export const getVideoComments=asyncHandler(async(req,res)=>{
    const {videoId}=req.params;
    const {page=1,limit=10}=req.query;
    if (!mongoose.isValidObjectId(videoId))
    throw new ApiError(400, "Invalid video id:-can't comment");

    const comments=await Comment.find({video:videoId,parent:null})
    .sort({createdAt:-1})
    .skip((page-1)*limit)
    .limit(limit)
    .populate({
        path:"author",
        model:"User",
        select:"username fullname avatar"
    })
    .populate({
        path:"children",
        model:"Comment",
        select:"content parent children",
        populate:{
            path:"author",
            model:"User",
            select:"username fullname avatar"
        }
    })
    return ApiResponse.send(res,200,comments,"comments fetched successfully");

    
})