import mongoose from "mongoose";


const playlistSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    videos:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    }],
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    privacy:{
        type: String,
        enum: ["public", "private", "unlisted"],
        default: "public"
    }
},{
    timestamps: true
})

export const Playlist=mongoose.model("Playlist",playlistSchema);