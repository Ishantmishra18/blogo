import React, { useState, useEffect } from "react";
import { FiUpload, FiFile, FiBarChart2, FiPieChart, FiColumns, FiX } from "react-icons/fi";
import api from "../utils/api";
import Chart from './chart';
import * as XLSX from 'xlsx';
import { useUser } from "../Context/userContext";
import { useTheme } from "../Context/themeContext";
import Summary from './AIresponse';
import LoginCard from "./loginCard";

export default function UploadPage() {
  const { user } = useUser();
  const { isDark } = useTheme();
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [exData, setExData] = useState({});
  const [previewData, setPreviewData] = useState([]);
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [headers, setHeaders] = useState([]);
  const [showLogin , setShowLogin] = useState(false);
  const [mapping, setMapping] = useState({
    xAxis: "",
    yAxis: "",
    showMapping: false
  });
  const [showErrorCard, setShowErrorCard] = useState(false);

  // Show error card and auto-hide after 5 seconds
  useEffect(() => {
    if (error) {
      setShowErrorCard(true);
      const timer = setTimeout(() => {
        setShowErrorCard(false);
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (
      selectedFile.type.includes("spreadsheet") || 
      selectedFile.name.match(/\.(xlsx|xls|csv)$/i)
    )) {
      setFile(selectedFile);
      setError("");
      // Simple preview (first 5 rows)
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        
        // Extract headers (first row)
        const fileHeaders = jsonData[0] || [];
        setHeaders(fileHeaders.map((header, index) => ({
          name: header || `Column ${index + 1}`,
          index
        })));
        
        setPreviewData(jsonData.slice(0, 5));
        
        // Auto-generate title from filename if empty
        if (!title) {
          const cleanName = selectedFile.name.replace(/\.[^/.]+$/, ""); // Remove extension
          setTitle(cleanName);
        }
        
        // Auto-select first two columns if available
        if (fileHeaders.length >= 2) {
          setMapping({
            xAxis: fileHeaders[0] || "0",
            yAxis: fileHeaders[1] || "1",
            showMapping: true
          });
        } else if (fileHeaders.length === 1) {
          setMapping({
            xAxis: fileHeaders[0] || "0",
            yAxis: "",
            showMapping: true
          });
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    } else {
      setError("Please upload a valid Excel file (.xlsx, .xls, .csv)");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate title
    if (!title.trim()) {
      setTitleError("Please enter a title for your chart");
      setError("Please enter a title for your chart");
      return;
    }
    else if (user?.history.includes(title)) {
      setTitleError("Title must be unique");
      setError("Title must be unique");
      return;
    }
    else {
      setTitleError("");
    }
    
    if (!file) {
      setError("Please select a file first");
      return;
    }

    // Validate column mapping
    if (mapping.showMapping && !mapping.xAxis) {
      setError("Please select at least an X-axis column");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("excelFile", file);
      formData.append("title", title);
      formData.append("fileSize", Math.round(file.size / 1024));
      
      // Add mapping data if user has selected columns
      if (mapping.showMapping) {
        formData.append("xAxis", mapping.xAxis);
        if (mapping.yAxis) {
          formData.append("yAxis", mapping.yAxis);
        }
      }

      const uploadRes = await api.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if(uploadRes.status == 401) {
        setShowLogin(true);
      }
      setExData(uploadRes.data.data);
      
    } catch (err) {
      setError(err.response?.data?.message || "Processing failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen pt-[16vh] pb-28 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>

      {/* Error Notification Card */}
      {showErrorCard && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md`}>
          <div className={`rounded-lg shadow-lg p-4 flex items-start justify-between ${
            isDark ? 'bg-red-800 text-red-100' : 'bg-red-100 text-red-800'
          }`}>
            <div className="flex-1">
              <h3 className="font-medium">Error</h3>
              <p className="text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={() => setShowErrorCard(false)}
              className={`ml-4 p-1 rounded-full ${
                isDark ? 'hover:bg-red-700' : 'hover:bg-red-200'
              }`}
              aria-label="Close error"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-2xl font-extrabold sm:text-4xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Excel Data Visualizer
          </h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
            Upload your spreadsheet and get beautiful charts instantly
          </p>
        </div>

        {/* Upload Card */}
        <div className={`shadow-xl mx-auto max-w-4xl rounded-lg overflow-hidden ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                {/* Drag & Drop Zone */}
                <div
                  className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${
                    file
                      ? isDark 
                        ? "border-green-400 bg-gray-700" 
                        : "border-green-500 bg-green-50"
                      : isDark 
                        ? "border-gray-600 hover:border-blue-400" 
                        : "border-gray-300 hover:border-blue-500"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <FiUpload className={`h-12 w-12 ${
                      isDark ? 'text-gray-400' : 'text-gray-400'
                    }`} />
                    <div className={`flex text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <label
                        htmlFor="file-upload"
                        className={`relative cursor-pointer rounded-md font-medium ${
                          isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                        } focus-within:outline-none`}
                      >
                        <span>Upload an Excel file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept=".xlsx, .xls, .csv"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      XLSX, XLS, or CSV up to 10MB
                    </p>
                    {file && (
                      <div className={`mt-4 flex items-center text-sm ${
                        isDark ? 'text-gray-200' : 'text-gray-900'
                      }`}>
                        <FiFile className="flex-shrink-0 mr-2 h-5 w-5" />
                        <span className="truncate">{file.name}</span>
                        <span className={`ml-2 ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Title Input */}
                <div className="space-y-2">
                  <label htmlFor="chart-title" className={`block text-sm font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Chart Title *
                  </label>
                  <input
                    id="chart-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`block w-full px-4 py-2 rounded-md border shadow-sm focus:ring-2 focus:ring-offset-2 ${
                      titleError 
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : isDark
                          ? "border-gray-600 bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
                          : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    placeholder="Enter a title for your chart"
                  />
                  {titleError && (
                    <p className="text-sm text-red-500">{titleError}</p>
                  )}
                </div>

                {/* Data Mapping UI */}
                {mapping.showMapping && headers.length > 0 && (
                  <div className={`p-4 rounded-lg ${
                    isDark ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <h3 className={`flex items-center text-lg font-medium mb-4 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      <FiColumns className="mr-2" />
                      Map Your Data Columns
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="x-axis" className={`block text-sm font-medium mb-1 ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          X-Axis (Categories) *
                        </label>
                        <select
                          id="x-axis"
                          value={mapping.xAxis}
                          onChange={(e) => setMapping({...mapping, xAxis: e.target.value})}
                          className={`block w-full px-3 py-2 rounded-md border shadow-sm focus:ring-2 focus:ring-offset-2 ${
                            isDark
                              ? "border-gray-600 bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
                              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          }`}
                          required
                        >
                          <option value="">Select X-Axis</option>
                          {headers.map((header) => (
                            <option key={header.index} value={header.name}>
                              {header.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="y-axis" className={`block text-sm font-medium mb-1 ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Y-Axis (Values)
                        </label>
                        <select
                          id="y-axis"
                          value={mapping.yAxis}
                          onChange={(e) => setMapping({...mapping, yAxis: e.target.value})}
                          className={`block w-full px-3 py-2 rounded-md border shadow-sm focus:ring-2 focus:ring-offset-2 ${
                            isDark
                              ? "border-gray-600 bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
                              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          }`}
                        >
                          <option value="">Select Y-Axis (optional)</option>
                          {headers.map((header) => (
                            <option key={header.index} value={header.name}>
                              {header.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-sm italic ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }">
                      Tip: X-Axis is typically for categories, Y-Axis for numerical values
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!file || isLoading || !title.trim() || (mapping.showMapping && !mapping.xAxis)}
                    className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      !file || isLoading || !title.trim() || (mapping.showMapping && !mapping.xAxis)
                        ? isDark 
                          ? "bg-gray-600 cursor-not-allowed" 
                          : "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FiBarChart2 className="-ml-1 mr-3 h-5 w-5" />
                        Generate Charts
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {Object.keys(exData).length > 0 &&
        <><Chart data={exData} title={title} />
        <Summary data={exData}/>
        </> }
      </div>
    </div>
  );
}