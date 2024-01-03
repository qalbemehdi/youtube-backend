import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.util.js";
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
 
