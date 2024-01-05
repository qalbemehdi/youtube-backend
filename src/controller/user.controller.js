import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary, { deleteOnCloudinary } from "../utils/cloudinary.util.js";
import { generateAccessAndRefreshToken } from "../utils/generateAccessAndRefreshToken.js";
import { registerValidation, userExist } from "../utils/validation.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, fullname, password } = req.body;
  const obj = registerValidation(req.body);
  //Fields Validation
  if (!obj.usernameCheck)
    throw new ApiError(
      400,
      "username must be alphanumeric and have a length between 3 and 30 characters."
    );
  if (!obj.emailCheck) throw new ApiError(400, "email is invalid");
  if (!obj.fullnameCheck)
    throw new ApiError(400, "name must be at least 3 characters long.");
  if (!obj.passwordCheck)
    throw new ApiError(
      400,
      "password must contains atleast one uppercase,one lowercase,one digit and one special character and minimum length of 6 "
    );
  //Check if user already exists
  if (await userExist(username, email))
    throw new ApiError(409, "User already Exists");
  //Check for images------------------------------------>
  
  let avatarLocalPath = req.files?.avatar?.[0]?.path;
  let coverImagaLocalPath = req.files?.coverImage?.[0]?.path||"";
  
  if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required");

  const avatarRes = await uploadOnCloudinary(avatarLocalPath);
  const coverImageRes =coverImagaLocalPath? await uploadOnCloudinary(coverImagaLocalPath):"";
  if (!avatarRes) throw new ApiError(500, "Error while uploading avatar on server");
//Create user----------------------->
  const user = await User.create({
    fullname,
    avatar: avatarRes.url,
    coverImage: coverImageRes?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) throw new ApiError(500, "Failed to register the User");

   return  ApiResponse.send(res,200,createdUser,"successfully registered");

});

export const loginUser=asyncHandler(async(req,res)=>{

  const { username, email, password } = req.body;

  if(!username&&!email)
    throw new ApiError(400,"username or email is required");
   
   const user=await User.findOne({
    $or:[{username},{email}]
   })
  
   if(!user)
   throw new ApiError(400,"user does not exist!!!");
    
   if(!(await user.isPasswordCorrect(password)))
     throw new ApiError(400,"password is not correct!")

     //generating access and refresh token ,and updating user document in database
      const{accessToken,refreshToken}= await generateAccessAndRefreshToken(user);
      //assignment;


      const options={
        httpOnly:true,
        secure:true
      }

      return res.status(200)
      .cookie('accessToken',accessToken,options)
      .cookie('refreshToken',refreshToken,options)
      .json({
        data:{accessToken,refreshToken},
        message:"user logged in successfully"
      })
});

export const logoutUser=asyncHandler(async(req,res)=>{
 
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );
// const user=await User.findById(req.user._id);
// user.refreshToken=undefined;
// user.save({validateBeforeSave:false})
// console.log(user);

   
    const options={
      httpOnly:true,
      secure:true
    }
    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json({message:"user logged out"})
})
 
export const changeCurrentPassword=asyncHandler(async(req,res)=>{
  const {currentPassword,newPassword}=req.body;
  if(!currentPassword||!newPassword)
    throw new ApiError(400,"all fields are required");
  const user=await User.findById(req.user._id);
  if(!user)//since this is an extra check,if removed nothing will impact to the functionality because we already checked the case in verfyJwt.
  throw new ApiError(400,"user is not logged in");

  const isPasswordCorrect=await user.isPasswordCorrect(currentPassword);
  if(!isPasswordCorrect)
  throw new ApiError(400,"Invalid old password");
  
 //validation of your new password should be done on frontend side
 user.password=newPassword;
 await user.save({validateBeforeSave:false})
 return  ApiResponse.send(res,200,"","Password changed successfully") 
})

export const updateAccountDetails=asyncHandler(async(req,res)=>{
  const {fullname,email}=req.body;
  if(!fullname||!email)
  throw new ApiError(400,"all fields are required");

  const user=await User.findByIdAndUpdate(req.user._id,{
    fullname,
    email,
  },{new:true}).select("-password -refreshToken");

  if(!user)
  throw new ApiError(400,"user is not logged in");

  return  ApiResponse.send(res,200,user,"Account details updated successfully") 
})

export const updateAvatar=asyncHandler(async(req,res)=>{
  let avatarLocalPath=req.file?.path;
  if(!avatarLocalPath){
    throw new ApiError(400,"avatar file is required");
  }

  const avatarRes=await uploadOnCloudinary(avatarLocalPath);

  if(!avatarRes)
  throw new ApiError(500,"Error while uploading avatar on server");

  const oldAvatarUrl=req.user.avatar;
  const user=await User.findByIdAndUpdate(req.user._id,{
    avatar:avatarRes.url
  },{new:true}).select("-password -refreshToken");

  if(!user)
  throw new ApiError(400,"user is not logged in");
  const publicId=oldAvatarUrl.split("/").pop().split(".")[0];

   deleteOnCloudinary(publicId);
  
return ApiResponse.send(res,200,user,"Avatar updated successfully")
  })

export const updateCoverImage=asyncHandler(async(req,res)=>{
    let coverLocalPath=req.file?.path;
    if(!coverLocalPath){
      throw new ApiError(400,"cover image is required");
    }
  
    const coverRes=await uploadOnCloudinary(coverLocalPath);
  
    if(!coverRes)
    throw new ApiError(500,"Error while uploading cover image on server");
  
    const oldCoverImageUrl=req.user.coverImage;
    const user=await User.findByIdAndUpdate(req.user._id,{
      coverImage:coverRes.url
    },{new:true}).select("-password -refreshToken");
  
    if(!user)
    throw new ApiError(400,"user is not logged in");

    const publicId=oldCoverImageUrl?.split("/").pop().split(".")[0];
     
    if(publicId)
     deleteOnCloudinary(publicId);
    
  return ApiResponse.send(res,200,user,"cover image updated successfully")
    })     

export const getUserChannelProfile=asyncHandler(async(req,res)=>{
  const {username}=req.params;
   const user=await User.aggregate([
    {
      $match:{username}
    },
    {
     $lookup:{
      from:"subscriptions",
      localField:"_id",
      foreignField:"channel",
      as:"subscribers"
     }
    },
    {
      $lookup:{
        from:"subscriptions",
        localField:"_id",
        foreignField:"subscriber",
        as:"subscribedTo"
      }
    },
    {
      $addFields:{
        totalCountOfSubscriber:{
          $size:"$subscribers"
        },
        totalCountOfSubscriptions:{
          $size:"subscribedTo"
        }
      }
    },
    {
      $project:{
        _id:0,
        username:1,
        fullname:1,
        avatar:1,
        coverImage:1,
        totalCountOfSubscriber:1,
        totalCountOfSubscriptions:1,
      }
    }
  ])
   
     return ApiResponse.send(res,200,user,"user channel profile fetched successfully")
})  