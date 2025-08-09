import React, { useRef, useEffect, useCallback } from "react";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  RadialLinearScale,
  Title,
} from "chart.js";
import { Line, Bar, Pie, Doughnut, Radar, PolarArea } from "react-chartjs-2";
import { useTheme } from "../../Context/themeContext";

// Register ChartJS components
ChartJS.register(
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  RadialLinearScale,
  Title
);

// Updated color palette with green as first color
const DEFAULT_COLORS = [
  "rgba(75, 192, 192, 0.7)",  // Green
  "rgba(54, 162, 235, 0.7)",  // Blue
  "rgba(255, 206, 86, 0.7)",  // Yellow
  "rgba(255, 99, 132, 0.7)",  // Red (moved from first position)
  "rgba(153, 102, 255, 0.7)", // Purple
  "rgba(255, 159, 64, 0.7)",  // Orange
];

const Chart2D = ({ chartData, chartType = "line", title = "Data Insights" }) => {
  const chartRef = useRef(null);
  const { isDark } = useTheme();
  const chartInstance = useRef(null);

  // Destroy previous chart instance before creating a new one
  const destroyChart = useCallback(() => {
    if (chartInstance.current) {
      try {
        chartInstance.current.destroy();
      } catch (err) {
        console.warn("Error destroying chart:", err);
      }
      chartInstance.current = null;
    }
  }, []);

  // Process chart data
  const processedData = useCallback(() => {
    if (!chartData) return null;

    const data = JSON.parse(JSON.stringify(chartData));

    // Special handling for pie/doughnut charts
    if (["pie", "doughnut"].includes(chartType)) {
      // Ensure we have enough colors for all segments
      const segmentColors = [];
      const totalSegments = data.labels?.length || 0;
      
      // Generate colors by cycling through DEFAULT_COLORS
      for (let i = 0; i < totalSegments; i++) {
        segmentColors.push(DEFAULT_COLORS[i % DEFAULT_COLORS.length]);
      }

      data.datasets = data.datasets.map(dataset => ({
        ...dataset,
        backgroundColor: dataset.backgroundColor || segmentColors,
        borderColor: dataset.borderColor || (isDark ? "#374151" : "#f3f4f6"),
        borderWidth: dataset.borderWidth || 1,
      }));
    } else {
      // For other chart types
      data.datasets = data.datasets.map((dataset, i) => ({
        ...dataset,
        backgroundColor: dataset.backgroundColor || DEFAULT_COLORS[i % DEFAULT_COLORS.length],
        borderColor: dataset.borderColor || DEFAULT_COLORS[i % DEFAULT_COLORS.length],
        borderWidth: dataset.borderWidth || 2,
      }));
    }

    return data;
  }, [chartData, chartType, isDark]);

  // Chart options
  const chartOptions = useCallback(() => {
    const textColor = isDark ? "#ffffff" : "#374151";
    const gridColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)";
    const tooltipBg = isDark ? "rgba(40, 40, 40, 0.9)" : "rgba(0, 0, 0, 0.8)";

    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: { 
            color: textColor, 
            padding: 20, 
            usePointStyle: true,
            font: {
              size: 12
            }
          }
        },
        title: {
          display: true,
          text: title,
          color: textColor,
          padding: { top: 10, bottom: 30 },
          font: {
            size: 18
          }
        },
        tooltip: {
          backgroundColor: tooltipBg,
          titleColor: isDark ? "#ffffff" : "#f9fafb",
          bodyColor: isDark ? "#e5e7eb" : "#f3f4f6",
          padding: 12,
          cornerRadius: 6,
          bodyFont: {
            size: 12
          },
          titleFont: {
            size: 14,
            weight: "bold"
          }
        }
      },
      scales: {
        x: { 
          grid: { 
            display: false, 
            color: gridColor 
          }, 
          ticks: { 
            color: textColor 
          } 
        },
        y: { 
          grid: { 
            color: gridColor 
          }, 
          ticks: { 
            color: textColor, 
            padding: 10 
          } 
        }
      }
    };

    // Special options for pie/doughnut charts
    if (chartType === "pie" || chartType === "doughnut") {
      return {
        ...baseOptions,
        plugins: {
          ...baseOptions.plugins,
          legend: {
            ...baseOptions.plugins.legend,
            position: "right",
          }
        },
        cutout: chartType === "doughnut" ? "70%" : 0,
        elements: {
          arc: {
            borderWidth: 1,
            borderColor: isDark ? "#374151" : "#f3f4f6"
          }
        }
      };
    }

    if (chartType === "radar" || chartType === "polarArea") {
      return {
        ...baseOptions,
        scales: {
          r: {
            angleLines: { 
              display: chartType === "radar", 
              color: gridColor 
            },
            grid: { 
              color: gridColor 
            },
            pointLabels: { 
              color: textColor 
            },
            ticks: { 
              display: false, 
              backdropColor: "transparent" 
            }
          }
        }
      };
    }

    return baseOptions;
  }, [chartType, title, isDark]);

  // Handle chart updates and cleanup
  useEffect(() => {
    destroyChart(); // Clean up previous chart before creating new one

    return () => {
      destroyChart(); // Clean up on unmount
    };
  }, [destroyChart, processedData, chartOptions]);

  const renderChart = () => {
    if (!processedData()) return null;

    const ChartComponent = {
      line: Line,
      bar: Bar,
      pie: Pie,
      doughnut: Doughnut,
      radar: Radar,
      polarArea: PolarArea,
    }[chartType] || Line;

    return (
      <ChartComponent
        ref={(ref) => {
          chartRef.current = ref;
          if (ref) chartInstance.current = ref.chartInstance;
        }}
        data={processedData()}
        options={chartOptions()}
        redraw={false}
      />
    );
  };

  return (
    <div className={`relative w-full h-[300px] sm:h-[400px] md:h-[500px] p-2 sm:p-4 rounded-xl shadow-md ${
      isDark ? "bg-gray-800" : "bg-white"
    }`}>
      {processedData() ? renderChart() : (
        <div className={`text-center p-8 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          No data available
        </div>
      )}
    </div>
  );
};

export default React.memo(Chart2D);