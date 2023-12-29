import mongoose from "mongoose";
import bycrpt from"bcrypt"
import  jwt from "jsonwebtoken"
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,
        required:true,//cloudinary
    },
    coverImage:{
        type:String, //cloudinary  
    },
    watchHistory:[{
             type:mongoose.Schema.Types.ObjectId,
             ref:"Video"
    }],
    password:{
        type:String,
        required:true
    },
    refreshToken:{
        type:String
    }
},{
    timestamps:true
})

userSchema.pre("save",async function(next){
    
    if(this.isModified("password")){
        this.password=await bycrpt.hash(this.password,10);
    }
    next();
})

userSchema.methods.isPasswordCorrect=async function(password){
    return await bycrpt.compare(password,this.password);
}

userSchema.methods.generateAccessToken=function(){
   return jwt.sign({
              _id:this._id,
              email:this.email,
              username:this.username,
              fullname:this.fullname
    },process.env.ACCESS_TOKEN_KEY,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY})
}
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign({
               _id:this._id,
     },process.env.REFRESH_TOKEN_KEY,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY})
 }

 export const User=mongoose.model("User",userSchema)