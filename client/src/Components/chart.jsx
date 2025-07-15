import React, { useRef } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';

ChartJS.register(...registerables);

const Chart = ({ data }) => {
  const chartRef = useRef(null);

  const handleDownloadChart = () => {
    if (chartRef.current === null) return;

    // Hide the download button before taking the screenshot
    const downloadButton = chartRef.current.querySelector('#download-button');
    if (downloadButton) downloadButton.style.display = 'none';

    toPng(chartRef.current, {
      cacheBust: true,
      backgroundColor: '#ffffff',
      filter: (node) => {
        // Exclude the download button if it's still visible
        return node.id !== 'download-button';
      }
    })
      .then((dataUrl) => {
        saveAs(dataUrl, 'chart-screenshot.png');
      })
      .catch((err) => {
        console.error('Error generating screenshot:', err);
      })
      .finally(() => {
        // Show the button again after screenshot is taken
        if (downloadButton) downloadButton.style.display = '';
      });
  };

  // Transform data if needed
  if (!data?.graphData && data?.summary?.numericColumns) {
    const numericColumns = data.summary.numericColumns;
    const firstNumericKey = Object.keys(numericColumns)[0];
    
    if (firstNumericKey) {
      data.graphData = {
        type: 'bar',
        labels: ['Statistics'],
        datasets: Object.entries(numericColumns).map(([key, values]) => ({
          label: key,
          data: [values.total],
          backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)`
        }))
      };
    }
  }

  // Empty state
  if (!data?.graphData || !data.graphData.labels || !data.graphData.datasets) {
    return (
      <div className="border border-dashed border-gray-300 p-5 mt-[10vh] rounded-lg text-center">
        <p className="text-gray-700">No chart data available</p>
        <p className="text-gray-600 mt-2">Please upload an Excel file with at least:</p>
        <ul className="text-left inline-block mt-2 list-disc pl-5">
          <li className="text-gray-600">1 header row</li>
          <li className="text-gray-600">1 text column (for labels)</li>
          <li className="text-gray-600">1 numeric column (for values)</li>
        </ul>
      </div>
    );
  }

  // Chart configuration
  const chartConfig = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: { enabled: true }
    }
  };

  return (
    <div ref={chartRef} className="my-5 relative">
      {/* Download Button */}
      <button
        id="download-button"
        onClick={handleDownloadChart}
        className="absolute top-0 right-0 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors z-10"
      >
        Download Chart
      </button>

      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        {data.metadata?.sheetNames?.[0] || 'Data'} Visualization
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
        {/* Bar Chart */}
        <div className="h-[300px]">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Bar Chart</h4>
          <Bar 
            data={data.graphData} 
            options={chartConfig} 
          />
        </div>
        
        {/* Line Chart */}
        <div className="h-[300px]">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Line Chart</h4>
          <Line 
            data={data.graphData} 
            options={chartConfig} 
          />
        </div>
        
        {/* Pie Chart */}
        <div className="h-[300px]">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Pie Chart</h4>
          <Pie 
            data={data.graphData} 
            options={chartConfig} 
          />
        </div>
      </div>
      
      <div className="mt-5">
        <h4 className="text-lg font-medium text-gray-700 mb-2">Summary</h4>
        <ul className="space-y-1">
          <li className="text-gray-600">Total Rows: {data.summary?.totalRows}</li>
          {data.summary?.numericColumns && Object.entries(data.summary.numericColumns).map(([key, values]) => (
            <li key={key} className="text-gray-600">
              {key}: Avg {values.average.toFixed(2)} (Min: {values.min}, Max: {values.max})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Chart;