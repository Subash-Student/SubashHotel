import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import TimeframeSelector from "../timeFrameSelector/TimeframeSelector"
import TabSelector from '../tabSelector/TabSelector'
import './piChart.css'; // Assuming you have a CSS file for styles

Chart.register(...registerables, ChartDataLabels);

const PieChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    const config = {
      type: 'pie',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                const dataset = tooltipItem.dataset;
                const total = dataset.data.reduce((sum, value) => sum + value, 0);
                const value = dataset.data[tooltipItem.dataIndex];
                const percentage = ((value / total) * 100).toFixed(1) + '%';
                return ` ${data.labels[tooltipItem.dataIndex]}: $${value} (${percentage})`;
              },
            },
          },
          datalabels: {
            color: '#fff',
            formatter: (value, context) => {
              let total = context.dataset.data.reduce((sum, val) => sum + val, 0);
              let percentage = ((value / total) * 100).toFixed(1);
              return percentage + '%';
            },
          },
        },
      },
    };

    const pieChart = new Chart(ctx, config);

    return () => {
      pieChart.destroy();
    };
  }, [data]);

  return <canvas ref={chartRef} />;
};

const Legend = ({ labels, colors }) => {
  return (
    <div className="legend-container">
      {labels.map((label, index) => (
        <div key={index} className="legend-item">
          <span className="legend-color" style={{ backgroundColor: colors[index] }} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const expenseData = {
    labels: ['Rent', 'Food', 'Entertainment', 'Travel', 'Savings'],
    datasets: [
      {
        data: [1000, 800, 600, 400, 200], // Expense values
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverOffset: 10,
      },
    ],
  };

  return (
    <div className="chart-container">
      <TabSelector/>
      <TimeframeSelector/>
      <PieChart data={expenseData} />
      <Legend labels={expenseData.labels} colors={expenseData.datasets[0].backgroundColor} />
    </div>
  );
};

export default App;