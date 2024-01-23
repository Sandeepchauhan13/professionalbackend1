import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler (async (req, res)=>{
    // res ka status json response 
//    return res.status(200).json({
//         message: "user controller msg sandeep chauhan testing done"
//     })

// #register steps
// get user details from frontend 
// validation - not empty (frontend se b ho sakta hai pr backend se b )
// check if user already exists  username , email
// check for images , check for avatar
// upload them to cloudinary , avatar 
// create user object - create entry in db 
// remove password and refresh token field from response 
//  check for user creation 
// return res 

 const {fullName, email, username, password}= req.body
 console.log("email: ",  email);
//  console.log("password:", password);
// api error response // advance method check whether the field is empty or not 
// if(fullName === ""){
//     throw new ApiError(400, "fullname is  required")
// }

// advance method check whether the field is empty or not 

if (
    [fullName, email, username, password].some((field)=>
    field?.trim() === "")
){
throw new ApiError(400, "All fields are required")
}

// username or email already exists 
const existedUser = User.findOne({
    // $sign se operator $or parameter 
    $or: [{username}, {email}]
})
if (existedUser){
    throw new ApiError(409, "User with email or username already exists ")
}
// localpath of avatar and cover image avatar local path is mandatory 
// req.files from   multer // check for images , check for avatar
const avatarLocalPath = req.files?.avatar[0]?.path;
 const coverImageLocalPath = req.files?.coverImage[0]?.path;

 if(!avatarLocalPath){
    throw new ApiError(400, "Avatar file is required");
 }

//  uploadimage on cloudinary 
const avatar = await uploadOnCloudinary(avatarLocalPath)
const coverImage = await uploadOnCloudinary
(coverImageLocalPath)

if(!avatar){
    throw new ApiError(400, "Avatar  file is required")
}
 // create user object - create entry in db 
const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
     password,
     username: username.toLowerCase()
})

// check for user creation & remove password and refresh token field from response
const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
)
if(createdUser){
    throw new ApiError(500, "Something went wrong while registering the user")
}
return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered Successfully")
)

})


export {registerUser,}