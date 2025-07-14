import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
ChartJS.register(...registerables);

const Chart = ({ data }) => {
  // Check if graphData exists and is valid
  if (!data?.graphData && data?.summary?.numericColumns) {
    // Create basic graph from summary if no graphData exists
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

  // Default empty state
  if (!data?.graphData || !data.graphData.labels || !data.graphData.datasets) {
    return (
      <div className="chart-container" style={{
        border: '1px dashed #ccc',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <p>No chart data available</p>
        <p>Please upload an Excel file with at least:</p>
        <ul style={{ textAlign: 'left', display: 'inline-block' }}>
          <li>1 header row</li>
          <li>1 text column (for labels)</li>
          <li>1 numeric column (for values)</li>
        </ul>
      </div>
    );
  }

  // Chart configuration
  const chartConfig = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: { enabled: true }
    }
  };

  return (
    <div className="chart-container" style={{ margin: '20px 0' }}>
      <h3>{data.metadata?.sheetNames?.[0] || 'Data'} Visualization</h3>
      
      {data.graphData.type === 'bar' && (
        <Bar data={data.graphData} options={chartConfig} />
      )}
      
      {data.graphData.type === 'line' && (
        <Line data={data.graphData} options={chartConfig} />
      )}
      
      {data.graphData.type === 'pie' && (
        <Pie data={data.graphData} options={chartConfig} />
      )}
      
      <div style={{ marginTop: '20px' }}>
        <h4>Summary</h4>
        <ul>
          <li>Total Rows: {data.summary?.totalRows}</li>
          {data.summary?.numericColumns && Object.entries(data.summary.numericColumns).map(([key, values]) => (
            <li key={key}>
              {key}: Avg {values.average.toFixed(2)} (Min: {values.min}, Max: {values.max})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Chart;