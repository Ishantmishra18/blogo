import React, { useRef, useEffect } from 'react';
import {
  Line, Bar, Pie, Doughnut, Radar, PolarArea, Bubble, Scatter
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement, BarElement, ArcElement,
  CategoryScale, LinearScale, Tooltip, Legend,
  PointElement, RadialLinearScale, Title
} from 'chart.js';
import { useTheme } from '../../Context/themeContext';

ChartJS.register(
  LineElement, BarElement, ArcElement,
  CategoryScale, LinearScale, Tooltip, Legend,
  PointElement, RadialLinearScale, Title
);

const DEFAULT_COLORS = [
  'rgba(255, 99, 132, 0.7)',
  'rgba(54, 162, 235, 0.7)',
  'rgba(255, 206, 86, 0.7)',
  'rgba(75, 192, 192, 0.7)',
  'rgba(153, 102, 255, 0.7)',
  'rgba(255, 159, 64, 0.7)',
  'rgba(199, 199, 199, 0.7)'
];

const Chart2D = ({ chartData, chartType = 'line', title = 'Data Insights' }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const { isDark } = useTheme();

  // Process chart data to ensure colors are properly set
  const processedData = React.useMemo(() => {
    if (!chartData) return null;
    
    const data = JSON.parse(JSON.stringify(chartData));
    
    data.datasets = data.datasets.map((dataset, i) => {
      if (chartType === 'pie' || chartType === 'doughnut' || chartType === 'polarArea') {
        return {
          ...dataset,
          backgroundColor: dataset.backgroundColor || DEFAULT_COLORS.slice(0, data.labels?.length),
          borderColor: dataset.borderColor || '#fff',
          borderWidth: dataset.borderWidth || 1
        };
      }
      
      return {
        ...dataset,
        backgroundColor: dataset.backgroundColor || DEFAULT_COLORS[i % DEFAULT_COLORS.length],
        borderColor: dataset.borderColor || dataset.backgroundColor || DEFAULT_COLORS[i % DEFAULT_COLORS.length],
        borderWidth: dataset.borderWidth || 2
      };
    });
    
    return data;
  }, [chartData, chartType]);

  // Chart options configuration with theme support
  const chartOptions = React.useMemo(() => {
    const textColor = isDark ? '#ffffff' : '#374151';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
    const tooltipBg = isDark ? 'rgba(40, 40, 40, 0.9)' : 'rgba(0, 0, 0, 0.8)';

    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: textColor,
            font: {
              size: 12,
              family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
              weight: 'bold'
            },
            padding: 20,
            usePointStyle: true,
          }
        },
        title: {
          display: true,
          text: title,
          color: textColor,
          font: {
            size: 18,
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 30
          }
        },
        tooltip: {
          backgroundColor: tooltipBg,
          titleColor: isDark ? '#ffffff' : '#f9fafb',
          bodyColor: isDark ? '#e5e7eb' : '#f3f4f6',
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 12
          },
          padding: 12,
          usePointStyle: true,
          cornerRadius: 6,
          borderColor: isDark ? '#4b5563' : '#e5e7eb',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false,
            color: gridColor
          },
          ticks: {
            color: textColor,
            font: {
              size: 12
            }
          }
        },
        y: {
          grid: {
            color: gridColor,
            drawBorder: false
          },
          ticks: {
            color: textColor,
            font: {
              size: 12
            },
            padding: 10
          }
        }
      },
      elements: {
        line: {
          tension: 0.4,
          borderWidth: 3,
          fill: 'start'
        },
        point: {
          radius: 4,
          hoverRadius: 6,
          backgroundColor: isDark ? '#1f2937' : 'white',
          borderWidth: 2
        },
        bar: {
          borderRadius: 6,
          borderSkipped: 'bottom'
        }
      }
    };

    return {
      ...baseOptions,
      ...(chartType === 'pie' || chartType === 'doughnut' ? {
        plugins: {
          ...baseOptions.plugins,
          legend: {
            ...baseOptions.plugins.legend,
            position: 'right'
          }
        },
        cutout: chartType === 'doughnut' ? '70%' : 0
      } : {}),
      ...(chartType === 'radar' || chartType === 'polarArea' ? {
        scales: {
          r: {
            angleLines: {
              display: chartType === 'radar',
              color: gridColor
            },
            grid: {
              color: gridColor
            },
            pointLabels: {
              color: textColor,
              font: {
                size: 12
              }
            },
            ticks: {
              display: false,
              beginAtZero: true,
              backdropColor: 'transparent'
            }
          }
        }
      } : {})
    };
  }, [chartType, title, isDark]);

  // Clean up chart instance on unmount or when data changes
  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [processedData, chartType]);

  // Render the appropriate chart
  const renderChart = () => {
    if (!processedData) return null;

    const chartProps = {
      ref: (ref) => {
        if (ref) {
          chartInstance.current = ref;
        }
      },
      data: processedData,
      options: chartOptions,
      redraw: true
    };

    switch(chartType) {
      case 'bar': return <Bar {...chartProps} />;
      case 'pie': return <Pie {...chartProps} />;
      case 'doughnut': return <Doughnut {...chartProps} />;
      case 'radar': return <Radar {...chartProps} />;
      case 'polarArea': return <PolarArea {...chartProps} />;
      case 'bubble': return <Bubble {...chartProps} />;
      case 'scatter': return <Scatter {...chartProps} />;
      default: return <Line {...chartProps} />;
    }
  };

  return (
    <div className={`h-[400px] w-full p-4 relative ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      {processedData ? renderChart() : (
        <div className={`text-center p-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          No data available
        </div>
      )}
    </div>
  );
};

export default Chart2D;