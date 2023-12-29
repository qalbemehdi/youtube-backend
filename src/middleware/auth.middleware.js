import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { generateAccessAndRefreshToken } from "../utils/generateAccessAndRefreshToken.js";

export const verifyJwt=asyncHandler(async(req,res,next)=>{

    const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")//Assignment
     let user;
    if(!token||jwt.verify(token,process.env.ACCESS_TOKEN_KEY,function(err){
      if(err)
      return true;
    }))
    {
      const refreshToken=req.cookies?.refreshToken;

      if(!refreshToken)
      throw new ApiError(401,"unauthorized user requests");
    
      const decodedRefreshToken=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_KEY);
           user=await  User.findById(decodedRefreshToken._id).select(
            "-password -refreshToken"
         );
           const result=await generateAccessAndRefreshToken(user);
           user=result.user
    }
    else{ 
      const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_KEY);
       user=await User.findById(decodedToken?._id).select(
         "-password -refreshToken"
      );
    }
     
     if(!user)
     throw new ApiError(401,"Invalid Access Token");
       
    
     req.user=user;
     next();

})