import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
      username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim:  true,

        // searching enable karne ke indexxing true  optimised way 
        index: true
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim:  true,
        
        },

       fullName: {
        type: String,
        required: true,
        trim:  true,
        index: true
    },
    
    avatar: {
        // cloudanary url use karenge, aws like service cloudanary where we can save images 
        type: String,
        required: true,


    },
    coverImage: {
        type: String, //Cloudnary url 

    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],

    password: {
        type: String,
        required: [true, 'password is required']
    },
    refreshToken: {
        type: String
    }
        
}, {timestamps: true})

  //  direct encryption is not possible we have to use some hooks
// prehook  middleware make changes just before 
// arrow function main this use nahi hota in pre hook context pta hona chahiye 
// save (event on middleware e.g save , validate, remove, deleteone etc see doc middleware) hone se pehle data changes bcrypt hona chahiye password 
// middleware flag next ka access and last main call next() 
userSchema.pre("save", async function (next) {
    // make changes only when password modified or not 
    if(!this.isModified("password")) return next();
    // salt or hash round is 10 e.g 8 or default also can be given 
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// custom method design method inject bcrypt also compare 
userSchema.methods.isPasswordCorrect = async function (password){
   return await bcrypt.compare(password, this.password)
}

// jwt is a bearer token ye token jiske paas hai usko data send kar deta hai is like a key
// generate access and refresh token 
userSchema.methods.generateAccessToken = function() {
    // jwt ke paas ek sign method hai which generate token 
return jwt.sign(
{
     _id: this._id,
     email: this.email,
     user: this.username,
     fullName: this.fullName
},
process.env.ACCESS_TOKEN_SECRET,
{
    expiresIn : process.env.ACCESS_TOKEN_EXPIRY
}
)
}
userSchema.methods.generateRefreshToken = function() {
    
    return jwt.sign(
        {
             _id: this._id,
           
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
        )
}

export const User = mongoose.model("User", userSchema)