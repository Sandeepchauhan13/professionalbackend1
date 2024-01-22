import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"

// router banta hai in the same way we create express 
const router = Router ()


// jaise hi register par aayenge register user post hoga 
router.route("/register").post(
//   upload multer se aaya hai we use field main array two object inside this 
// middleware inject now we can upload images 
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
       
    
   ]),
    registerUser)


// export default router 


export default router  