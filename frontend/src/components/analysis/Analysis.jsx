import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement,Legend } from 'chart.js';
import "./analysis.css"

Chart.register(ArcElement,Legend);

const Analysis = () => {

  const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange',"navy","black"],
    datasets: [
      {
        data: [12, 19, 3, 5, 2, 3,20,10],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          "rgba(63, 11, 166, 0.6)",
          "rgba(0, 0, 0, 0.6)"
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
        hoverOffset: 4,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: window.innerWidth > 600 ? 'right' : 'bottom', // Change position based on screen size
        labels: {
          boxWidth: 20,
          padding: 20,
        },
      },
    },
  };
  
  return (
    <div className="body4">
    <div className="container2">
      <div className="dropdown-box">
        <label htmlFor="typeSelect">Select Type:</label>
        <select id="typeSelect" className="dropdown">
          <option value="income" className="income-option">Income</option>
          <option value="expense" className="expense-option">Expense</option>
          <option value="total" className="total-option">Total</option>
        </select>
      </div>

      <div className="date-and-submit">
        <div className="date-field-container">
          <label htmlFor="startDate" className="date-label">Start</label>
          <input type="date" id="startDate" className="date-input" />
        </div>

        <div className="date-field-container">
          <label htmlFor="endDate" className="date-label">End</label>
          <input type="date" id="endDate" className="date-input" />
        </div>

        <button className="submit-btn2">Submit</button>
      </div>

      <div className="chart-legend-container">
          <div className="chart-container">
            <Doughnut data={data} options={options} />
          </div>
        </div>
      
    </div>
    </div>
  );
};

export default Analysis;
