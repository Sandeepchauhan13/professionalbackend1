import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler (async (req, res)=>{
    // res ka status json response 
   return res.status(200).json({
        message: "user controller msg sandeep chauhan testing done"
    })
})


export {registerUser,}