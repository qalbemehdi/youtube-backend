import { v2 as cloudinary } from 'cloudinary'
import ApiError from './apiError.js';
import fs from "fs";
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET,
    secure: true
  });

  const uploadOnCloudinary=async(localFilePath)=>{
    try {
        if(!localFilePath){
            console.log("File Path is missing");
            throw new ApiError(502,"File Path is not present.")
            
        }
       const res= await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        console.log(res.url);
        return res;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        throw new ApiError(500,error);
        
    }
  }
  export default uploadOnCloudinary;