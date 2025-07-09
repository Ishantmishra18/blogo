import React ,{ useState, useCallback } from "react";
import { FiUpload, FiFile, FiBarChart2, FiPieChart } from "react-icons/fi";
import api from "../utils/api";


export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [charts, setCharts] = useState([]);
  const [previewData, setPreviewData] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.includes("spreadsheet")) {
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
      };
      reader.readAsArrayBuffer(selectedFile);
    } else {
      setError("Please upload a valid Excel file (.xlsx, .xls)");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("excelFile", file);

      // 1. Upload file
      const uploadRes = await api.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 2. Process data
      const summaryRes = await api.post(
        `/summarize/${uploadRes.data.id}`
      );

      // 3. Get chart-ready data
      const { data } = await api.get(
        `/summarize/${uploadRes.data.id}/results`
      );
      setCharts(data.charts);
    } catch (err) {
      setError(err.response?.data?.message || "Processing failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Excel Data Visualizer
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Upload your spreadsheet and get beautiful charts instantly
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                {/* Drag & Drop Zone */}
                <div
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                    file
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 hover:border-blue-500"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <FiUpload className="h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
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
                    <p className="text-xs text-gray-500">
                      XLSX, XLS, or CSV up to 10MB
                    </p>
                    {file && (
                      <div className="mt-4 flex items-center text-sm text-gray-900">
                        <FiFile className="flex-shrink-0 mr-2 h-5 w-5" />
                        <span className="truncate">{file.name}</span>
                        <span className="ml-2 text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          {error}
                        </h3>
                      </div>
                    </div>
                  </div>
                )}

                {/* Data Preview */}
                {previewData.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Data Preview
                    </h3>
                    <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            {previewData[0]?.map((header, idx) => (
                              <th
                                key={idx}
                                scope="col"
                                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {header || `Column ${idx + 1}`}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {previewData.slice(1).map((row, rowIdx) => (
                            <tr key={rowIdx}>
                              {row.map((cell, cellIdx) => (
                                <td
                                  key={cellIdx}
                                  className="px-3 py-4 whitespace-nowrap text-sm text-gray-500"
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
                    disabled={!file || isLoading}
                    className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      !file || isLoading
                        ? "bg-gray-400 cursor-not-allowed"
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

        {/* Charts Display */}
        {charts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Your Data Visualization
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}