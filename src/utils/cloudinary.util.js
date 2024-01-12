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
        fs.unlinkSync(localFilePath);
        return res;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        throw new ApiError(500,error);
        
    }
  }
  export const deleteOnCloudinary=async(publicId,type='image')=>{
    try {
      const res= await cloudinary.uploader.destroy(publicId,{resource_type:type});
      if(!res)
       console.log("Issue in destroying the file");
    return res;
    } catch (error) {
        console.log("Error while deleting files on cloudinary");
    }
        
  }

  export const publicId=(url)=>{
    return url.split("/").pop().split(".")[0]
  }
  export default uploadOnCloudinary;