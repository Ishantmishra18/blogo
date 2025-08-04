import express from 'express';
import {
  uploadFile,
  deleteFile,

} from '../controllers/fileCon.js';
import { protect } from '../middlewares/authMiddle.js';
import  excelUpload   from '../middlewares/fileUploadMiddle.js';


const router = express.Router();

// File operations routes
router.post('/upload', protect , excelUpload, uploadFile);
router.delete('/delete/:id', protect, deleteFile);



export default router;