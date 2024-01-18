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

// when database is connected through async function then promise is returned 
.then( ()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running at Port: ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("Mongo Db connection failed !!!", err)
})





// import express from 'express';

// const app = express ()
// async await is used if database is located in another continent 
// ( async () =>{
//     try{
//     await  mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

//    this is a part of express 
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

