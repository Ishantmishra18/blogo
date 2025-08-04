import React, { useState } from "react";
import { FiUpload, FiFile, FiBarChart2, FiPieChart } from "react-icons/fi";
import api from "../utils/api";
import Chart from './chart';
import * as XLSX from 'xlsx';
import { useUser } from "../Context/userContext";
import { useTheme } from "../Context/themeContext";
import Summary from './AIresponse';

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
        setPreviewData(jsonData.slice(0, 5));
        
        // Auto-generate title from filename if empty
        if (!title) {
          const cleanName = selectedFile.name.replace(/\.[^/.]+$/, ""); // Remove extension
          setTitle(cleanName);
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
      return;
    }
    else if (user?.history.includes(title)) {
      setTitleError("Title must be unique");
      return;
    }
     else {
      setTitleError("");
    }
    
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("excelFile", file);
      formData.append("title", title);
       formData.append("fileSize", Math.round(file.size / 1024)); 
      const uploadRes = await api.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setExData(uploadRes.data.data);
      
    } catch (err) {
      setError(err.response?.data?.message || "Processing failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen pt-[16vh] pb-28 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
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

                {error && (
                  <div className={`rounded-md p-4 ${
                    isDark ? 'bg-red-900' : 'bg-red-50'
                  }`}>
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className={`text-sm font-medium ${
                          isDark ? 'text-red-200' : 'text-red-800'
                        }`}>
                          {error}
                        </h3>
                      </div>
                    </div>
                  </div>
                )}

                {/* Data Preview */}
                {previewData.length > 0 && (
                  <div className="space-y-4">
                    <h3 className={`text-lg font-medium ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      Data Preview
                    </h3>
                    <div className={`overflow-x-auto shadow ring-1 rounded-lg ${
                      isDark ? 'ring-gray-600' : 'ring-black ring-opacity-5'
                    }`}>
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                          <tr>
                            {previewData[0]?.map((header, idx) => (
                              <th
                                key={idx}
                                scope="col"
                                className={`px-3 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                  isDark ? 'text-gray-300' : 'text-gray-500'
                                }`}
                              >
                                {header || `Column ${idx + 1}`}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${
                          isDark ? 'divide-gray-600 bg-gray-800' : 'divide-gray-200 bg-white'
                        }`}>
                          {previewData.slice(1).map((row, rowIdx) => (
                            <tr key={rowIdx}>
                              {row.map((cell, cellIdx) => (
                                <td
                                  key={cellIdx}
                                  className={`px-3 py-4 whitespace-nowrap text-sm ${
                                    isDark ? 'text-gray-300' : 'text-gray-500'
                                  }`}
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!file || isLoading || !title.trim()}
                    className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      !file || isLoading || !title.trim()
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
        <Summary data={exData}/></> }
      </div>
    </div>
  );
}