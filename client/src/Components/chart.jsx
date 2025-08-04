import React, { useRef, useState } from 'react';
import { Bar, Pie, Scatter } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import html2canvas from 'html2canvas';

const SimpleDataViz = ({ data }) => {
  const [chartType, setChartType] = useState('bar');
  const chartRef = useRef(null);
  
  // Prepare chart data based on type
  const getChartData = () => {
    if (!data || !data.labels || !data.values) {
      return { labels: [], datasets: [] };
    }

    switch(chartType) {
      case 'pie':
        return {
          labels: data.labels,
          datasets: [{
            data: data.values,
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
              '#FF9F40', '#8AC24A', '#F06292', '#7986CB', '#A1887F'
            ],
            borderWidth: 1
          }]
        };
      
      case 'scatter':
        return {
          datasets: [{
            label: 'Data Points',
            data: data.labels.map((label, i) => ({
              x: i,
              y: data.values[i]
            })),
            backgroundColor: '#36A2EB',
            pointRadius: 6
          }]
        };
      
      case 'bar3d':
      case 'bar':
      default:
        return {
          labels: data.labels,
          datasets: [{
            label: 'Values',
            data: data.values,
            backgroundColor: '#36A2EB',
            borderColor: '#36A2EB',
            borderWidth: 1
          }]
        };
    }
  };

  // Basic 3D effect for bar chart
  const render3DChart = () => {
    const chartData = getChartData();
    return (
      <div className="relative">
        <Bar 
          data={chartData} 
          options={{
            plugins: {
              legend: { display: false }
            },
            scales: {
              y: { beginAtZero: true }
            }
          }} 
        />
        <div className="absolute inset-0 pointer-events-none">
          {chartData.labels.map((_, i) => (
            <div 
              key={i}
              className="absolute bottom-0 bg-blue-700 opacity-20"
              style={{
                left: `${(i / chartData.labels.length) * 100}%`,
                width: `${80 / chartData.labels.length}%`,
                height: '100%',
                transform: 'translateX(10%) skewX(-15deg)'
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  const downloadChart = async () => {
    if (!chartRef.current) return;
    
    const canvas = await html2canvas(chartRef.current);
    const link = document.createElement('a');
    link.download = `chart-${chartType}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{data?.title || 'Data Visualization'}</h3>
        <div className="flex gap-2">
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm"
          >
            <option value="bar">Bar Chart</option>
            <option value="bar3d">3D Bar</option>
            <option value="pie">Pie Chart</option>
            <option value="scatter">Scatter Plot</option>
          </select>
          <button
            onClick={downloadChart}
            className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
          >
            Download
          </button>
        </div>
      </div>

      <div className="h-64 w-full" ref={chartRef}>
        {chartType === 'bar' && (
          <Bar 
            data={getChartData()} 
            options={{
              responsive: true,
              maintainAspectRatio: false
            }}
          />
        )}
        
        {chartType === 'bar3d' && render3DChart()}
        
        {chartType === 'pie' && (
          <Pie 
            data={getChartData()} 
            options={{
              responsive: true,
              maintainAspectRatio: false
            }}
          />
        )}
        
        {chartType === 'scatter' && (
          <Scatter 
            data={getChartData()} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  type: 'linear',
                  position: 'bottom'
                }
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

// Example usage:
const DataDashboard = () => {
  const salesData = {
    title: "Monthly Sales",
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    values: [65, 59, 80, 81, 56]
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <SimpleDataViz data={salesData} />
    </div>
  );
};

export default DataDashboard;