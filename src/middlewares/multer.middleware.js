import multer from "multer";

// this is for diskstorage you can also use memory storage 
const storage = multer.diskStorage({
    // here cb is callback 
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    //   cb(null, file.fieldname + '-' + uniqueSuffix)
      cb(null, file.originalname)
    }
  })
  
 export const upload = multer({
     storage, 
    })