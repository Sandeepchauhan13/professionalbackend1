import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async(userId)=>{
    try{
       const user =  await User.findById(userId)
    //    generate access token and generate refresh token are methods 

      const accessToken =  user.generateAccessToken ()
       const refreshToken = user.generateRefreshToken()
       user.refreshToken = refreshToken
          await user.save({validateBeforeSave: false})
          return {accessToken, refreshToken}
    }catch(error){
        throw  new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}
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
    [fullName, email, username, password].some((field) =>
    field?.trim() === "")
){
throw new ApiError(400, "All fields are required")
}

// username or email already exists 
const existedUser = await User.findOne({
    // $sign se operator $or parameter 
    $or: [{username}, {email}]
})
if (existedUser){
    throw new ApiError(409, "User with email or username already exists ")
}
// console.log(req.files);
// localpath of avatar and cover image avatar local path is mandatory 
// req.files from   multer // check for images , check for avatar
const avatarLocalPath = req.files?.avatar[0]?.path;
//  const coverImageLocalPath = req.files?.coverImage[0]?.path;

// here some times error occures due to ?  mark"coverImage": "", coverimage ess tareke se aayegi by this code
// if we dont send coverimage error will not come 
 let coverImageLocalPath;
 if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
      coverImageLocalPath = req.files.coverImage[0].path
 }

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
if(!createdUser){
    throw new ApiError(500, "Something went wrong while registering the user")
}
return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered Successfully")
)


})

const loginUser = asyncHandler(async (req, res)=>{
  // req body -> data
  // check for username or email 
  // find the user
  // password check
  // access and refresh token
  // send cookie 
  
//  step1  req.body is data 
  const {email, username, password}= req.body

//   step2 check for username or email 
  // if(!username || !email){
  if(!username && !email){
    throw new ApiError(400, "username or email is required")
  }
//   step 3 find the user 
  const user = await User.findOne({
    $or: [{username}, {email}]
  })
  if(!user){
    throw new ApiError(404, "User does not exist ")
  }

  
// #step4 password check 
 const isPasswordValid =  await user.isPasswordCorrect(password)
 if(!isPasswordValid){
    throw new ApiError(401, "Invalid user credentials")
 }

// step 5 access and refreshtoken 
const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

// when database call User.findById 
const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
// httpOnly: true and secure: true modify from the server only not from front end 
const options = {
    httpOnly: true,
    secure: true
}
return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options)
.json(
  new ApiResponse(
    200,
    {
      user: loggedInUser, accessToken,
      refreshToken
    },
    "User logged In Successfully"
  )
)

})

// #logout logic 

const logoutUser = asyncHandler(async(req, res)=>{
 await User.findByIdAndUpdate(
  req.user._id,
  {
    $set:  {
      refreshToken: undefined
    }
  },
  {
    new: true
  }
)
const options = {
  httpOnly: true,
  secure: true
}
return res
.status(200)
.clearCookie("accessToken", options )
.clearCookie("refreshToken", options)
.json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async(req, res)=>{
  // refresh token kaise aayega  req.cookies.refreshToken | or mobile app req.body.refreshToken store it in variable
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
  // if incoming refreshtoken nahi hai then throw error 
  if(!incomingRefreshToken){
    throw new ApiError(401, "unauthorized request")
  }


  // for jwt verify we need token and secret 
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )

    // user information from mongodb query 
    const user = await User.findById(decodedToken?._id)
    if(!user){
      throw new ApiError(401, "Invalid refresh token")
    }
    if(incomingRefreshToken !== user?.refreshToken){
      throw new ApiError(401, "Refresh token is expired or used")
    }
  
    // cookies main bhejna hai to options use hote hen 
    const options = {
      httpOnly :  true,
      secure: true
    }
    
  const {accessToken, newRefreshToken}  = await generateAccessAndRefreshTokens(user._id)
     return res.status(200).cookie("accessToken", accessToken, options ).cookie("refreshToken", newRefreshToken, options)
     .json(
      new ApiResponse(
        200,
        {accessToken, refreshToken: newRefreshToken},
        "Access token refreshed"
      )
     )
  } catch (error) {
    
    throw new ApiError(401, error?.message || "Invalid refresh token")
  }
})



// #change password 
const changeCurrentPassword = asyncHandler(async(req, res)=>{

  const {oldPassword, newPassword} = req.body

  // req.user se aap user find kar sakte hen 
  const user = User.findById(req.User?._id)
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

  if(!isPasswordCorrect){
    throw new ApiError(400, "Invalid old password")
  }
  user.password = newPassword 
  await user.save({validateBeforeSave: false})

  return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"))



})

const getCurrentUser = asyncHandler(async(req, res)=>{
  return res.status(200).json(200, req.user, "current user fetched successfully")
})

// #update account details 
const updateAccountDetails = asyncHandler(async(req, res)=>{
  const {fullName, email} = req.body
  if(!fullName || !email){
    throw new ApiError(400, "All fields are required")
  }

  const user = User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        // fullName: fullName  it can also be written as fullName in es6 syntax
        fullName,
        email: email
      }
    },
    {new: true}
  ).select("-password")

  return res.status(200).json(new ApiResponse(200, user, "Account details updated successfully"))

});

// updateuseravatar 
const updateUserAvatar = asyncHandler(async(req, res)=>{
    const avatarLocalPath =  req.file?.path
    if(!avatarLocalPath){
      throw  new ApiError(400, "Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if(!avatar.url){
      throw new ApiError(400, "Error while uploading on avatar")

    }

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          avatar: avatar.url
        }
      },
      {new: true}

    ).select("-password")
    return res.status(200).json(new ApiResponse(200, user, "avatar updated successfully"))
})

//update cover image 
const updateUserCoverImage = asyncHandler(async(req, res)=>{
  const coverImageLocalPath =  req.file?.path
  if(!coverImageLocalPath){
    throw  new ApiError(400, "Cover image file is missing")
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if(!coverImage.url){
    throw new ApiError(400, "Error while uploading on coverImage")

  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url
      }
    },
    {new: true}

  ).select("-password")
  return res.status(200).json(new ApiResponse(200, user, "Cover image updated successfully"))
})



export {registerUser, loginUser, logoutUser, refreshAccessToken,
   changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage }