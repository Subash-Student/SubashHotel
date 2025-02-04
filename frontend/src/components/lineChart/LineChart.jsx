import React, { useContext, useState, useEffect } from "react";
import { Bar } from "react-chartjs-2"; // Import Bar instead of Line
import { StoreContext } from "../../context/context";
import ChartDataLabels from 'chartjs-plugin-datalabels';
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

const LineChart = ({isDate}) => {

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
      datalabels: {
        color: "white",  // Change text color to white
        font: {
          weight: 'bold', // Optional: make the text bold
        },
        align: 'center', // Align the labels to the center of the bar
        anchor: 'center', // Place the label at the center of the bar
      },
    },
  };
  

  


  const { records, queryClient } = useContext(StoreContext);
  const [totalAmount, setTotalAmount] = useState(0);
  const [data, setData] = useState({ labels: [], datasets: [] });
  const [currentType, setCurrentType] = useState("expense");
  const getDefaultWeekRange = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // Get current day index (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  
    // Find this week's Monday
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - ((dayOfWeek + 6) % 7)); // Move to this week's Monday
    startOfWeek.setHours(0, 0, 0, 0); // Reset time to start of the day
  
    // Find this week's Sunday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Move to this week's Sunday
    endOfWeek.setHours(23, 59, 59, 999); // Set time to end of the day
  
    return {
      startDay: startOfWeek.toISOString(),
      endDay: endOfWeek.toISOString(),
    };
  };
  
  const [date, setDate] = useState(getDefaultWeekRange());
  
  
  
  useEffect(() => {
    queryClient.invalidateQueries(["records"]);
  
    if (!records || records.length === 0) return;
  
    let labels = [];
    let tempIncomeData = [];
    let tempExpenseData = [];
    let total = 0;
  
    const filteredRecords = records.filter((record) => {
      const recordDate = new Date(record.createdAt).toISOString().split("T")[0];
      return recordDate >= date.startDay.split("T")[0] && recordDate <= date.endDay.split("T")[0];
    });
  
    const startDate = new Date(date.startDay);
    const endDate = new Date(date.endDay);
    const diffTime = endDate - startDate;
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
  
    // console.log("Filtered Records: ", filteredRecords);
    // console.log("Start Date: ", startDate);
    // console.log("End Date: ", endDate);
    // console.log("Date Difference (in days): ", diffDays);
  
    if (diffDays === 7) {
      labels = ["தி", "செ", "பு", "வி", "வெ", "ச", "ஞா"];
      tempIncomeData = new Array(7).fill(0);
      tempExpenseData = new Array(7).fill(0);
  
      filteredRecords.forEach((record) => {
        const recordDate = new Date(record.createdAt);
        const dayIndex = (recordDate.getDay() + 6) % 7;
        if (record.catagory === "income") {
          tempIncomeData[dayIndex] += record.amount;
        } else {
          if(record.isFromIncome){
            tempIncomeData[dayIndex] += record.amount;
            }
          tempExpenseData[dayIndex] += record.amount;
        }
      });
  
    } else if (diffDays >= 28 && diffDays <= 31) {
      labels = ["வாரம் 1", "வாரம் 2", "வாரம் 3", "வாரம் 4"];
      tempIncomeData = [0, 0, 0, 0];
      tempExpenseData = [0, 0, 0, 0];
  
      filteredRecords.forEach((record) => {
        const recordDate = new Date(record.createdAt);
        const weekIndex = Math.min(3, Math.floor(recordDate.getDate() / 7));
        if (record.catagory === "income") {
          tempIncomeData[weekIndex] += record.amount;
        } else {
          if(record.isFromIncome){
            tempIncomeData[weekIndex] += record.amount;
            }
          tempExpenseData[weekIndex] += record.amount;
        }
      });
  
    } else {
      const uniqueDates = [...new Set(filteredRecords.map((record) => record.createdAt.split("T")[0]))];
      labels = uniqueDates.sort((a, b) => new Date(a) - new Date(b));
      tempIncomeData = new Array(labels.length).fill(0);
      tempExpenseData = new Array(labels.length).fill(0);
  
      filteredRecords.forEach((record) => {
        const recordDate = record.createdAt.split("T")[0];
        const index = labels.indexOf(recordDate);
        if (record.catagory === "income") {
          tempIncomeData[index] += record.amount;
        } else {
          if(record.isFromIncome){
          tempIncomeData[index] += record.amount;
          }
          tempExpenseData[index] += record.amount;
        }
      });
    }
  
    const datasets = [];
    
    if (currentType === "income") {
      total = records.reduce((sum, record) => {
        if (record.catagory === "income") {
          return sum + (record.amount || 0);
        } else if (record.catagory === "expense" && record.isFromIncome) {
          return sum + (record.amount || 0);
        }
        return sum;
      }, 0);
    
      datasets.push({
        label: "வரவு",
        data: tempIncomeData,
        backgroundColor: "#22c55e",
      });
    
    } else if (currentType === "expense") {
      total = tempExpenseData.reduce((acc, value) => acc + (value || 0), 0);
    
      datasets.push({
        label: "சிலவு",
        data: tempExpenseData,
        backgroundColor: "#ef4444",
      });
    
    } else if (currentType === "total") {
      const totalData = tempIncomeData.map((income, index) => 
        (income || 0) - (tempExpenseData[index] || 0)
      );
    
      // total = totalData.reduce((acc, value) => acc + value, 0);
    
      let incomeTotal = records.reduce((sum, record) => {
        if (record.catagory === "income") {
          return sum + (record.amount || 0);
        } else if (record.catagory === "expense" && record.isFromIncome) {
          return sum + (record.amount || 0);
        }
        return sum;
      }, 0);
  
      let expenseTotal = tempExpenseData.reduce((acc, value) => acc + (value || 0), 0);
   
      total = incomeTotal-expenseTotal;
 
      datasets.push({
        label: total > 0 ? "வரவு" : "சிலவு",
        data: totalData,
        backgroundColor: total > 0 ? "#22c55e" : "#ef4444",
      });
    }
    
    setData({
      labels,
      datasets,
    });
  
    setTotalAmount(total);
  
  }, [date, currentType, records, queryClient]);
  

  const handleCurrentType = (type) => {
    setCurrentType(type);
  };

  return (
    <div className="chart-container2">
      <div className="pad">
        <TabSelector currentType={currentType} handleCurrentType={handleCurrentType} totalAmount={totalAmount} />
        {isDate &&  <TimeframeSelector date={date} isSmallFont={true} setDate={setDate} isLine={true} />}
      </div>
      <div className="chart-wrapper">
        <Bar data={data} options={options} /> {/* Use Bar instead of Line */}
      </div>
    </div>
  );
};

export default LineChart;
