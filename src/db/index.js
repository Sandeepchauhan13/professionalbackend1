import mongoose from 'mongoose';

import { DB_NAME } from '../constants.js';

const connectDB =  async () =>{
    try{
   const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
  //  connectionInstance.connectionhost is jha connection ho ra hai vo url le le 
   console.log(`\n MongoDb connected !! DB Host: ${connectionInstance.connection.host}`);
    }catch (error){
  console.log("MONGODB connection Failed", error);
  // process is reference of application concept of node 
  process.exit(1)
    }
}
export default connectDB