import { User } from "../models/user.model.js";

export const registerValidation=({username,email,password,fullname})=>{
   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-=_+[\]{}|;:'",.<>/?])[A-Za-z\d!@#$%^&*()-=_+[\]{}|;:'",.<>/?]{6,}$/;
   const usernameCheck=/^[a-zA-Z0-9]{3,30}$/.test(username);
   const emailCheck=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
   const fullnameCheck=  fullname.length >= 3;
   const passwordCheck=passwordRegex.test(password);
   return{usernameCheck,emailCheck,fullnameCheck,passwordCheck}
}
export const userExist=async (username,email)=>{
  const user=await User.findOne({
    $or:[{username},{email}]
   })
   
   if(user)
    return true;
    return false
}