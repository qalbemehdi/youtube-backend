import { Playlist } from "../models/playlist.model.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createPlaylist=asyncHandler(async(req,res)=>{
    const{name,description}=req.body;
    if(!name){
        throw new Error("Playlist title is required")
    }
    const playlist=await Playlist.create(
        {
            title:name,
            description,
        })

        return ApiResponse.send(res,200,playlist,"Playlist created successfully")
})