import File from '../models/file.js';
import { generateSummary } from '../services/summaryService.js';
import { uploadToStorage, deleteFromStorage, getFileStream } from '../services/storageService.js';
import asyncHandler from 'express-async-handler';
import { validateExcelFile } from '../utils/fileValidation.js';

// @desc    Upload Excel file
// @route   POST /api/files/upload
// @access  Private
export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a file');
  }

  // Validate file type and structure
  await validateExcelFile(req.file);

  // Upload to storage (S3 or local)
  const fileUrl = await uploadToStorage(req.file, req.user.id);

  // Save file metadata to database
  const file = await File.create({
    user: req.user.id,
    originalName: req.file.originalname,
    storedName: req.file.filename,
    fileUrl,
    size: req.file.size,
    fileType: req.file.mimetype
  });

  res.status(201).json({
    id: file._id,
    name: file.originalName,
    url: file.fileUrl,
    size: file.size,
    uploadedAt: file.createdAt
  });
});

// @desc    Get user's files
// @route   GET /api/files
// @access  Private
export const listFiles = asyncHandler(async (req, res) => {
  const files = await File.find({ user: req.user.id })
    .select('_id originalName size fileType createdAt')
    .sort({ createdAt: -1 });

  res.json(files);
});

// @desc    Get single file
// @route   GET /api/files/:id
// @access  Private
export const getFile = asyncHandler(async (req, res) => {
  const file = await File.findOne({
    _id: req.params.id,
    user: req.user.id
  });

  if (!file) {
    res.status(404);
    throw new Error('File not found');
  }

  // For direct download:
  // const fileStream = await getFileStream(file.storedName);
  // fileStream.pipe(res);

  res.json({
    id: file._id,
    name: file.originalName,
    url: file.fileUrl,
    size: file.size,
    uploadedAt: file.createdAt
  });
});

// @desc    Delete file
// @route   DELETE /api/files/:id
// @access  Private
export const deleteFile = asyncHandler(async (req, res) => {
  const file = await File.findOne({
    _id: req.params.id,
    user: req.user.id
  });

  if (!file) {
    res.status(404);
    throw new Error('File not found');
  }

  // Delete from storage
  await deleteFromStorage(file.storedName);

  // Delete from database
  await file.remove();

  res.json({ message: 'File removed' });
});

// @desc    Summarize Excel file
// @route   POST /api/summarize/:id
// @access  Private
export const summarizeFile = asyncHandler(async (req, res) => {
  const file = await File.findOne({
    _id: req.params.id,
    user: req.user.id
  });

  if (!file) {
    res.status(404);
    throw new Error('File not found');
  }

  // Process the file and generate summary
  const summaryResult = await generateSummary(file.storedName);

  // Save summary results to database
  file.summary = summaryResult.metadata;
  file.summaryStatus = 'completed';
  await file.save();

  res.json({
    message: 'Summary generated successfully',
    summaryId: summaryResult.summaryId
  });
});

// @desc    Download summary
// @route   GET /api/summarize/:id/download
// @access  Private
export const downloadSummary = asyncHandler(async (req, res) => {
  const file = await File.findOne({
    _id: req.params.id,
    user: req.user.id
  });

  if (!file || !file.summary) {
    res.status(404);
    throw new Error('Summary not found');
  }

  // Get the summary file from storage
  const summaryFile = await getFileStream(file.summary.storedName);

  // Set download headers
  res.setHeader('Content-Disposition', `attachment; filename=${file.summary.outputName}`);
  res.setHeader('Content-Type', file.summary.mimeType);

  // Stream the file to client
  summaryFile.pipe(res);
});