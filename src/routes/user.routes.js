import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

// router banta hai in the same way we create express 
const router = Router ()


// jaise hi register par aayenge register user post hoga 
router.route("/register").post(registerUser)


// export default router 


export default router  