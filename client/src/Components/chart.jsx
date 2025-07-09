import React ,{ Bar, Pie, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const chartComponents = {
  bar: Bar,
  pie: Pie,
  line: Line,
};

export default function ChartDisplay({ charts }) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {charts.map((chart, index) => {
        const ChartComponent = chartComponents[chart.type] || Bar;
        return (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {chart.title}
            </h3>
            <div className="h-80">
              <ChartComponent
                data={chart.data}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "bottom" },
                  },
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

