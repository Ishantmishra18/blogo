import express from 'express';
import {
  uploadFile,
  getFile,
  deleteFile,
  listFiles,
  summarizeFile,
  downloadSummary
} from '../controllers/fileCon.js';
import { protect } from '../middleware/authMiddleware.js';
import fileUpload from '../middleware/fileUploadMiddleware.js';

const router = express.Router();

// File operations routes
router.post('/upload', protect, fileUpload.single('excelFile'), uploadFile);
router.get('/files', protect, listFiles);
router.get('/files/:id', protect, getFile);
router.delete('/files/:id', protect, deleteFile);

// Summarization routes
router.post('/summarize/:id', protect, summarizeFile);
router.get('/summarize/:id/download', protect, downloadSummary);

export default router;