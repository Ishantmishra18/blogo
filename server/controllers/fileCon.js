import File from '../models/file.js';
import User from '../models/user.js'
import asyncHandler from 'express-async-handler';
import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';


// Helper: Validate Excel file structure
const validateExcelFile = async (file) => {
  try {
    const workbook = XLSX.read(file.buffer);
    
    if (workbook.SheetNames.length === 0) {
      throw new Error('Excel file contains no worksheets');
    }

    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet);
    
    if (jsonData.length === 0) {
      throw new Error('First worksheet contains no data');
    }

    return {
      headers: Object.keys(jsonData[0]),
      rowCount: jsonData.length,
      sheetNames: workbook.SheetNames,
      jsonData // Added this to avoid parsing twice
    };
  } catch (error) {
    throw new Error(`Invalid Excel file: ${error.message}`);
  }
};

// Helper: Simulated storage upload
const uploadToStorage = async (file) => {
  const uploadDir = 'uploads/';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const fileExt = path.extname(file.originalname);
  const fileName = `${uuidv4()}${fileExt}`;
  const filePath = path.join(uploadDir, fileName);

  await fs.promises.writeFile(filePath, file.buffer);
  return `/uploads/${fileName}`;
};

// Helper: Generate summary statistics
const generateSummary = (jsonData) => {
  const numericColumns = {};
  const allHeaders = Object.keys(jsonData[0] || {});

  allHeaders.forEach(header => {
    const values = jsonData.map(row => row[header]).filter(val => typeof val === 'number' && !isNaN(val));
    if (values.length > 0) {
      numericColumns[header] = {
        average: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        total: values.reduce((a, b) => a + b, 0)
      };
    }
  });

  return {
    totalRows: jsonData.length,
    numericColumns,
    columnNames: allHeaders
  };
};

// Helper: Generate chart-ready data
const generateGraphData = (jsonData) => {
  const headers = Object.keys(jsonData[0] || {});
  if (headers.length < 2) return null;

  return {
    type: 'line',
    labels: jsonData.map(row => row[headers[0]]),
    datasets: [{
      label: headers[1],
      data: jsonData.map(row =>{ 
        const value = row[headers[1]];
        return typeof value === 'number' ? value : 0; // Ensure numeric data
      })
    }]
  };
};



// Main Controller
export const uploadFile = asyncHandler(async (req, res) => {
  const { title , fileSize} = req.body;

  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a file');
  }

  try {
    // 1. Validate and parse Excel
    const { jsonData, headers, rowCount, sheetNames } = await validateExcelFile(req.file);
    
    // 2. Generate insights
    const summary = generateSummary(jsonData);
    const graphData = generateGraphData(jsonData);

    // 3. Upload to storage
    const fileUrl = await uploadToStorage(req.file);

    // 4. Save to database
    


      const user = await User.findById(req.user.id);  
      const file = await File.create({
      title,
      summary,
      graphData,
      url: fileUrl,
      size: fileSize,
      uploadedBy: req.user?.id
    })
      user.history.push(title);
      await user.save();
  

    
   
    // 5. Return response
    res.status(201).json({
      success: true,
      message: 'File processed successfully',
      data: {
        downloadUrl: fileUrl,
        summary,
        graphData,
        metadata: {
          headers,
          rowCount,
          sheetNames
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'File processing failed'
    });
  }
});


export const deleteFile = asyncHandler(async (req, res) => {
  const fileId = req.params.id;
  const file = await File.findByIdAndDelete(fileId);
  const user = await User.findById(req.user?.id);
  if (user) {
    user.history = user.history.filter(item => item !== file.title);
    await user.save();
  }
}); 

