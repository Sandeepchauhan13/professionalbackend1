import express from express;
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

// two methods of export express
// export default express;

export { app }