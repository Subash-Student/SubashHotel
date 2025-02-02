import React, { useContext, useState, useEffect } from "react";
import { Bar } from "react-chartjs-2"; // Import Bar instead of Line
import { StoreContext } from "../../context/context";
import TimeframeSelector from "../timeFrameSelector/TimeframeSelector";
import TabSelector from "../tabSelector/TabSelector";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import "./lineChart.css";

// Register required components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const LineChart = () => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        type: "linear",
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
  };

  const { records, queryClient } = useContext(StoreContext);
  const [totalAmount, setTotalAmount] = useState(0);
  const [data, setData] = useState({ labels: [], datasets: [] });
  const [currentType, setCurrentType] = useState("expense");
  const [date, setDate] = useState({
    startDay: new Date().toISOString(),
    endDay: new Date().toISOString(),
  });

  useEffect(() => {
    queryClient.invalidateQueries(["records"]);

    if (!records || records.length === 0) return;

    let labels = [];
    let tempIncomeData = new Array(7).fill(0); // Ensure array length matches 7 days
    let tempExpenseData = new Array(7).fill(0);
    let total = 0;

    // Filter records by the selected date range
    const filteredRecords = records.filter((record) => {
      const recordDate = new Date(record.createdAt).toISOString().split("T")[0];
      return recordDate >= date.startDay.split("T")[0] && recordDate <= date.endDay.split("T")[0];
    });

    const startDate = new Date(date.startDay);
    const endDate = new Date(date.endDay);
    const diffTime = endDate - startDate;
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

    console.log("Filtered Records: ", filteredRecords);
    console.log("Start Date: ", startDate);
    console.log("End Date: ", endDate);
    console.log("Date Difference (in days): ", diffDays);

    // Check if the difference is exactly 7 days (for a week view)
    if (diffDays === 7) {
      labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      filteredRecords.forEach((record) => {
        const recordDate = new Date(record.createdAt);
        const dayIndex = (recordDate.getDay() + 6) % 7// Get the day index (0-6)
        if (record.catagory === "income") {
          tempIncomeData[dayIndex] += record.amount;
        } else {
          tempExpenseData[dayIndex] += record.amount;
        }
      });
    } else if (diffDays >= 28 && diffDays <= 31) {
      labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
      // Monthly data logic
      const monthlyIncomeData = [0, 0, 0, 0];
      const monthlyExpenseData = [0, 0, 0, 0];

      filteredRecords.forEach((record) => {
        const recordDate = new Date(record.createdAt);
        const weekIndex = Math.floor(recordDate.getDate() / 7); // Calculate which week of the month the date belongs to
        if (record.catagory === "income") {
          monthlyIncomeData[weekIndex] += record.amount;
        } else {
          monthlyExpenseData[weekIndex] += record.amount;
        }
      });

      console.log("Monthly Income Data: ", monthlyIncomeData);
      console.log("Monthly Expense Data: ", monthlyExpenseData);

      tempIncomeData = monthlyIncomeData;
      tempExpenseData = monthlyExpenseData;
    } else {
      const uniqueDates = [...new Set(filteredRecords.map((record) => record.createdAt.split("T")[0]))];
      labels = uniqueDates.sort((a, b) => new Date(a) - new Date(b)); // Sort dates in ascending order
      tempIncomeData = new Array(labels.length).fill(0);
      tempExpenseData = new Array(labels.length).fill(0);
  
      filteredRecords.forEach((record) => {
        const recordDate = record.createdAt.split("T")[0];
        const index = labels.indexOf(recordDate);
        if (record.catagory === "income") {
          tempIncomeData[index] += record.amount;
        } else {
          tempExpenseData[index] += record.amount;
        }
      });
    }

    // Set the data for the chart based on currentType
    const datasets = [];
    if (currentType === "income") {
      datasets.push({
        label: "Income",
        data: tempIncomeData,
        backgroundColor: "#22c55e", // Green color for income
      });
    } else if (currentType === "expense") {
      datasets.push({
        label: "Expense",
        data: tempExpenseData,
        backgroundColor: "#ef4444", // Red color for expense
      });
    } else if (currentType === "total") {
      const totalData = tempIncomeData.map((income, index) => income - tempExpenseData[index]);
      datasets.push({
        label: "Total",
        data: totalData,
        backgroundColor: "#3b82f6", // Blue color for total
      });
    }

    setData({
      labels,
      datasets,
    });

    // Calculate total amount for display
    total = tempIncomeData.reduce((acc, value) => acc + value, 0) - tempExpenseData.reduce((acc, value) => acc + value, 0);
    setTotalAmount(total);

  }, [date, currentType, records, queryClient]);

  const handleCurrentType = (type) => {
    setCurrentType(type);
  };

  return (
    <div className="chart-container2">
      <div className="pad">
        <TabSelector currentType={currentType} handleCurrentType={handleCurrentType} totalAmount={totalAmount} />
        <TimeframeSelector date={date} setDate={setDate} isLine={true} />
      </div>
      <div className="chart-wrapper">
        <Bar data={data} options={options} /> {/* Use Bar instead of Line */}
      </div>
    </div>
  );
};

export default LineChart;
