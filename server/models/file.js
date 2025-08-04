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
    size:Number,
    url: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true // Adds createdAt and updatedAt automatically
  }
);

const File = mongoose.model('File', fileSchema);
export default File;