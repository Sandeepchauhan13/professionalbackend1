import {v2 as cloudinary} from "cloudinary";
// fs is filesystem it is not uploaded automatically not to be installed nodejs main hota hai
import fs from "fs";



          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});



const uploadOnCloudinary = async (localFilePath) => {
    try{
        // agar filepath nahi hai to return nulll (muje nahi pta karna hai )
if (!localFilePath) return null
//upload the file on cloudinary
const response = await cloudinary.uploader.upload(localFilePath, {
    // resource type e.g video images we give auto automatical detected which is uploaded 
    resource_type: "auto"
})
// file has been uploaded successfully 
// console.log("file is uploaded on cloudinary", response.url);
fs.unlinkSync(localFilePath)
return response;
    }catch(error){
        // safe cleaning purpose remove the file from server use fs.unlinksync 
fs.unlinkSync(localFilePath) //remove the locally saved temporary file as the upload operation got failed 
return null;
    }
}


// cloudinary.v2.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });

export {uploadOnCloudinary}