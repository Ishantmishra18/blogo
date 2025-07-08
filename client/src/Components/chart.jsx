
import React from 'react';
import { Bar } from 'react-chartjs-2';

const Chart = ({ data }) => {
  const chartData = {
    labels: data.map((row) => row.x),
    datasets: [{
      label: 'Excel Data',
      data: data.map((row) => row.y),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }],
  };

  return <Bar data={chartData} />;
};

export default Chart;