// #note: as early as possible  in your application, import and configure dotenv: 
// require('dotenv').config({path: './env'})
import dotenv from "dotenv";

// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
import connectDB from "./db/index.js";


dotenv.config({
    path: './env'
})

connectDB()





// import express from 'express';

// const app = express ()
// async await is used if database is located in another continent 
// ( async () =>{
//     try{
//     await  mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//     app.on("error", ()=>{
//         console.log("ERR: ", error);
//         throw error
//     })
//     app.listen(process.env.PORT, ()=>{
//         console.log(`App is listening on port ${process.env.PORT}`);
//     })
//     }catch (error){
//     console.error("ERROR: ",  error)
//     throw err
//     }
// }) ()