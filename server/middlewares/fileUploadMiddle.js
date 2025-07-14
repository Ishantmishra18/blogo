import multer from 'multer';
import path from 'path';

// Configure storage (using memory storage for direct processing)
const storage = multer.memoryStorage();

// File filter for Excel files only
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'text/csv' // CSV
  ];

  const ext = path.extname(file.originalname).toLowerCase();
  const isValidExt = ['.xlsx', '.xls', '.csv'].includes(ext);
  const isValidMime = allowedTypes.includes(file.mimetype);

  if (isValidMime && isValidExt) {
    cb(null, true);
  } else {
    cb(new Error('Only Excel/CSV files are allowed!'), false);
  }
};

// Configure Multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 // Single file
  }
});

// Pre-configured middleware for single file upload
const excelUpload = upload.single('excelFile'); // Field name must match frontend

export default excelUpload;