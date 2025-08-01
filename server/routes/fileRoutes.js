import express from 'express';
import {
  uploadFile,
  deleteFile,
  Summary,
} from '../controllers/fileCon.js';
import { protect } from '../middlewares/authMiddle.js';
import  excelUpload   from '../middlewares/fileUploadMiddle.js';


const router = express.Router();

// File operations routes
router.post('/upload',  excelUpload, uploadFile);
router.delete('/delete/:id', protect, deleteFile);
router.post('/summary' , Summary); 


export default router;