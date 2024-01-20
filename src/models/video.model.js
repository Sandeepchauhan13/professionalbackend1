import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new Schema(
    {
     videoFile: {
        type: String,
        //string from cloudinary url
        required: true
     },
    thumbnail: {
     type: String, 
     required: true
     },
      title: {
     type: String, 
     required: true
     }, 
     description: {
     type: String, 
     required: true
     },
     duration:{
        type: Number,
        required: true

     },
     views: {
        type: Number,
        default: 0
     },
     isPublished: {
        type: Boolean,
        default: true
     },
     owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
     }

    },
    {timestamps: true})
        
      // inject like plugin  import then use just before export 
      // true power of mongodb aati hai aggregation queries high level project creation 
        videoSchema.plugin(mongooseAggregatePaginate)
    export const Video = mongoose.model("Video", videoSchema)
        
        
