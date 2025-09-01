import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Post must have a title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Post must have a description"],
    },
    cover:{
        type: String, // URLs to uploaded images (can store Cloudinary URLs etc.)
      }
    ,
    likes:[{
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    }],
    comments:{
        type: [
            {type: mongoose.Schema.Types.ObjectId, ref: "Comment"}
        ]
    },
    
   
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Relates to User model (foreign key)
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

const Post = mongoose.model("Post", postSchema);

export default Post;