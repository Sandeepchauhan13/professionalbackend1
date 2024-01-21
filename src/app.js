import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()

// cors configuration 
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


app.use(express.json({limit: "16kb"}))
// url enconder special character encoder 
app.use(express.urlencoded({extended: true, limit: "16kb"}))
// images favicon etc in public folder 
app.use(express.static("public"))
// cookies par crud operation perform karne ke liye 
app.use(cookieParser())


// routes import 
import userRouter from './routes/user.routes.js'

// routes declaration 
// #imp yaha app.get karke bcoz same location main routes and controller 
// #now separate then we use app.use middleware needed 
// pehle path api/v1/users then kon sa router activate karvana hai 
app.use("/api/v1/users", userRouter)

// http://localhost:4000/api/v1/users/register 
// http://localhost:4000/api/v1/users/login 

// two methods of export express
// export default express;

export { app }

