import File from '../models/file.js';
import User from '../models/user.js'
import asyncHandler from 'express-async-handler';
import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import OpenAI from 'openai';

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
    const values = jsonData.map(row => row[header]).filter(val => !isNaN(val));
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
      data: jsonData.map(row => row[headers[1]] || 0)
    }]
  };
};



// Main Controller
export const uploadFile = asyncHandler(async (req, res) => {
  const { title } = req.body;
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
    

    const user = await User.findById(req.user?.id);
    if (user) {
       user.history.push(file.title);
    await user.save();
      const file = await File.create({
      title,
      summary,
      graphData,
      url: fileUrl,
      uploadedBy: req.user?.id
    });

    }
   

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




import { HfInference } from '@huggingface/inference';
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export const Summary = asyncHandler(async (req, res) => {
  try {
    // 1. Validate request body exists
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: 'No data received in request body',
        expectedFormat: {
          summary: { totalRows: Number, columnNames: Array, numericColumns: Object },
          metadata: { headers: Array, rowCount: Number, sheetNames: Array },
          graphData: { type: String, labels: Array, datasets: Array }
        }
      });
    }

    // 2. Destructure with proper fallbacks
    const { 
      summary = {}, 
      metadata = {}, 
      graphData = {} 
    } = req.body;

    // 3. Validate required fields with precise error messages
    const requiredFields = {
      'summary.totalRows': summary?.totalRows,
      'metadata.headers': metadata?.headers,
      'metadata.rowCount': metadata?.rowCount
    };

    
    // 4. Prepare analysis data (using your actual data structure)
    const analysisData = {
      dimensions: `${summary.totalRows} rows × ${metadata.headers.length} columns`,
      numericColumns: summary.numericColumns ? Object.keys(summary.numericColumns) : [],
      graphType: graphData.type || 'none',
      sheets: metadata.sheetNames || ['main'],
      sampleColumns: metadata.headers.slice(0, 3) // First 3 columns for preview
    };

    // 5. Create optimized prompt
    const prompt = `
      Analyze this business dataset:
      - Dimensions: ${analysisData.dimensions}
      - Numeric Columns: ${analysisData.numericColumns.join(', ') || 'None'}
      - Graph Type: ${analysisData.graphType}
      - Sample Columns: ${analysisData.sampleColumns.join(', ')}

      Provide a concise analysis covering:
      1. Key dataset characteristics
      2. Data quality considerations
      3. Business insights from numeric fields
      4. Recommended visualization approaches
      5. Next steps for analysis

      Response requirements:
      - Use bullet points
      - Limit to 250 words
      - Focus on actionable insights
    `;

    // 6. Call Hugging Face API with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.1',
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.3
      },
      signal: controller.signal
    }).finally(() => clearTimeout(timeout));

    // 7. Return formatted response
    res.status(200).json({
      success: true,
      analysis: {
        summary: response.generated_text.trim(),
        metadata: analysisData
      }
    });

  } catch (error) {
    console.error('Analysis Error:', error);

    // Handle specific error cases
    const statusCode = error.name === 'AbortError' ? 504 : 500;
    const message = error.name === 'AbortError' 
      ? 'Analysis timed out (10s limit)' 
      : 'Analysis service unavailable';

    res.status(statusCode).json({
      success: false,
      message,
      suggestion: 'Try again with a smaller dataset',

    });
  }
});



export const deleteFile = asyncHandler(async (req, res) => {
  const fileId = req.params.id;
  const file = await File.findByIdAndDelete(fileId);
}); 

