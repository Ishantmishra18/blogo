import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { Chart as ChartJS } from 'chart.js';
import Chart2D from './Charts/2D';
import Chart3D from './Charts/3D';
import { useTheme } from '../Context/themeContext';

const InsightsDashboard = ({ data }) => {
  const chart2DRef = useRef(null);
  const chart3DRef = useRef(null);
  const { summary, graphData } = data;
  const { isDark } = useTheme();
  
  const [chartType, setChartType] = useState('line');
  const [show3D, setShow3D] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chartInstance, setChartInstance] = useState(null);

  const chartTypes = [
    { value: 'line', label: 'Line Chart' },
    { value: 'bar', label: 'Bar Chart' },
    { value: 'pie', label: 'Pie Chart' },
    { value: 'doughnut', label: 'Doughnut Chart' },
    { value: 'radar', label: 'Radar Chart' },
    { value: 'polarArea', label: 'Polar Area' }
  ];

  // Clean up chart instances on unmount or when switching chart types
  useEffect(() => {
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [chartInstance]);

  const handleChartMount = (chart) => {
    setChartInstance(chart);
  };

  const downloadChart = async () => {
    try {
      setIsLoading(true);
      
      if (show3D) {
        // For 3D charts - use html2canvas with fallback colors
        const container = chart3DRef.current;
        
        // Temporarily replace unsupported CSS
        const originalStyles = [];
        const elements = container.querySelectorAll('*[style*="oklch"]');
        
        elements.forEach(el => {
          originalStyles.push({
            element: el,
            style: el.getAttribute('style')
          });
          el.style.cssText = el.style.cssText.replace(/oklch\([^)]+\)/g, isDark ? '#6b7280' : '#9ca3af');
        });

        const canvas = await html2canvas(container, {
          scale: 2,
          logging: false,
          useCORS: true,
          backgroundColor: isDark ? '#111827' : '#ffffff',
          allowTaint: true,
        });

        // Restore original styles
        originalStyles.forEach(item => {
          if (item.element && item.style) {
            item.element.setAttribute('style', item.style);
          }
        });

        const link = document.createElement('a');
        link.download = `insight-3d-${new Date().toISOString().slice(0,10)}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } else {
        // For 2D charts - use Chart.js native export
        const canvas = chart2DRef.current.querySelector('canvas');
        if (canvas) {
          const link = document.createElement('a');
          link.download = `insight-${chartType}-${new Date().toISOString().slice(0,10)}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        }
      }
    } catch (error) {
      console.error('Error downloading chart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`md:p-5 my-10 p-1 rounded-xl space-y-6 max-w-6xl mx-auto ${
      isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"
    }`}>
      {/* Header and controls remain the same */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
          Excel Data Insights
        </h1>
        <div className="flex space-x-2 text-sm md:text-md">
          <button
            onClick={() => setShow3D(!show3D)}
            className={`px-4 py-2 rounded-md ${
              show3D
                ? "bg-purple-600 text-white"
                : isDark
                ? "bg-gray-700 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {show3D ? "Show 2D Charts" : "Show 3D Charts"}
          </button>
          <button
            onClick={downloadChart}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                Downloading...
              </>
            ) : (
              "Download Chart"
            )}
          </button>
        </div>
      </div>

      {/* Data Summary */}
      <div className={`rounded-xl md:p-6 p-2 shadow-md ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}>
        <h2 className={`md:text-lg text-md font-semibold mb-4 ${
          isDark ? "text-white" : "text-gray-800"
        }`}>
          Dataset Summary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className={`font-medium md:text-xl text-sm ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}>
              Total Rows: <span className="font-normal">{summary.totalRows}</span>
            </p>
            <p className={`font-medium md:text-xl text-sm ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}>
              Numeric Columns: <span className="font-normal">
                {Object.keys(summary.numericColumns).length}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* 2D Chart Section */}
      {!show3D && (
        <div
          ref={chart2DRef}
          className={`rounded-xl md:p-4 pt-4 shadow-md ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-4">
            {chartTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setChartType(type.value)}
                className={`px-3 py-1 rounded-md text-sm ${
                  chartType === type.value
                    ? "bg-blue-600 text-white"
                    : isDark
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
          <div className="w-full h-[300px] sm:h-[400px] md:h-[500px]">
            <Chart2D
              chartData={graphData}
              chartType={chartType}
              isDark={isDark}
              onChartMount={handleChartMount}
            />
          </div>
        </div>
      )}

      {/* 3D Chart Section */}
      {show3D && (
        <div
          ref={chart3DRef}
          className={`rounded-xl md:p-4 pt-4 shadow-md ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h2 className={`text-lg font-semibold mb-4 ${
            isDark ? "text-white" : "text-gray-800"
          }`}>
            3D Visualization
          </h2>
          <div className="w-full h-[300px] sm:h-[400px] md:h-[500px]">
            <Chart3D chartData={graphData} isDark={isDark} />
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
        <p>
          Tip: Click and drag to rotate 3D charts. Use mouse wheel to zoom in/out.
        </p>
      </div>
    </div>
  );
};

export default InsightsDashboard;