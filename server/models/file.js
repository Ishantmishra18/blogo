import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema(
  {
     title: String,
      summary: {
  type: mongoose.Schema.Types.Mixed,
  default: null
},
       graphData: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
      url:String,
      uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Uploader user ID is required']
    },
}

);

const File = mongoose.model('File', fileSchema);
export default File;