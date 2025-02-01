import React, { useContext, useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {StoreContext} from "../../context/context";
import TimeframeSelector from "../timeFrameSelector/TimeframeSelector";
import TabSelector from '../tabSelector/TabSelector';
import './piChart.css';

Chart.register(...registerables, ChartDataLabels);

const PieChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!data?.labels?.length) return;

    const ctx = chartRef.current.getContext('2d');

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
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
    });

    return () => chartInstance.current.destroy();
  }, [data]);

  return <canvas ref={chartRef} />;
};

const Legend = ({ labels = [], colors = [] }) => (
  <div className="legend-container">
    {labels.map((label, index) => (
      <div key={index} className="legend-item">
        <span className="legend-color" style={{ backgroundColor: colors[index] }} />
        <span>{label}</span>
      </div>
    ))}
  </div>
);




const PieChartComponent = ({ isMargin }) => {
  const { records ,queryClient} = useContext(StoreContext);
  
const [totalAmount,setTotalAmount] = useState(0);
  const [expenseData, setExpenseData] = useState({ labels: [], datasets: [] });
  const [currentType, setCurrentType] = useState("expense");
  const [date, setDate] = useState({
    startDay: new Date().toISOString(),
    endDay: new Date().toISOString(),
  });

  useEffect(() => {
    queryClient.invalidateQueries(["records"]);
  
    let labels = [];
    let data = [];
    let backgroundColor = [];
    let total = 0; // ✅ Define a separate variable for totalAmount
  
    if (!records || records.length === 0) return; // Safe check
  
    console.log(currentType);
  
    if (currentType === "total") {
      const filteredRecords = records.filter(
        (record) =>
          record.createdAt.split("T")[0] >= date.startDay.split("T")[0] &&
          record.createdAt.split("T")[0] <= date.endDay.split("T")[0]
      );
  
      // total = filteredRecords.reduce((sum, record) => sum + record.amount, 0); // ✅ Correct way to calculate totalAmount
  
      let income = 0;
      let expense = 0;
  
      labels = ["income", "expense"];
      filteredRecords.forEach((record) => {
        if (record.catagory === "income") {
          income += record.amount;
        } else {
          expense += record.amount;
        }
      });
       total = income - expense;
      data = [income, expense];
      backgroundColor = ["#22c55e", "#ef4444"];
    } else {
      const filteredRecords = records.filter(
        (record) =>
          record.catagory === currentType &&
          record.createdAt.split("T")[0] >= date.startDay.split("T")[0] &&
          record.createdAt.split("T")[0] <= date.endDay.split("T")[0]
      );
  
      total = filteredRecords.reduce((sum, record) => sum + record.amount, 0); // ✅ Correct calculation for totalAmount
  
      labels = filteredRecords.map((record) => record.reason);
      data = filteredRecords.map((record) => record.amount);
  
      const getRandomColor = () =>
        "#" + Math.floor(Math.random() * 16777215).toString(16);
  
      // backgroundColor = filteredRecords.map(() => getRandomColor());
      backgroundColor = [
         "#3357FF", "#FF33A1", "#A133FF",
        "#33FFF5", "#F5FF33", "#FF8C33", "#8C33FF", "#33FF8C",
        "#FF3333", "#33FF33", "#3333FF", "#FFB533", "#B533FF",
        "#33FFB5", "#FF3357", "#5733FF", "#33A1FF", "#A1FF33",
        "#FFA133", "#33FFA1", "#8CFF33", "#FF33F5", "#33F5FF",
        "#F533FF", "#FF33D1", "#33FFD1", "#D1FF33", "#33D1FF",
        "#FF6666", "#66FF66", "#6666FF", "#FFCC66", "#CC66FF",
        "#66FFCC", "#FF6699", "#6699FF", "#99FF66", "#FF9966",
        "#9966FF", "#66FF99", "#FF66CC", "#66CCFF", "#CCFF66",
        "#FF99CC", "#99CCFF", "#CC99FF", "#99FFCC", "#CC66CC"
      ];
      
    }
  
    setTotalAmount(total); // ✅ Update totalAmount correctly
  
    setExpenseData({
      labels,
      datasets: [{ data, backgroundColor, hoverOffset: 10 }],
    });
  }, [date, currentType, records, queryClient]); // ✅ Dependency array is correct
  

  const handleCurrentType = (type)=>{
    setCurrentType(type);
  }

  return (
    <div className={isMargin ? "chart-container" : "chart-container-lessMargin"}>
      <TabSelector currentType={currentType} handleCurrentType={handleCurrentType} totalAmount={totalAmount}/>
      <TimeframeSelector date={date} setDate={setDate} />
      {expenseData.labels.length ? (
        <>
          <PieChart data={expenseData} />
          <Legend labels={expenseData.labels} colors={expenseData.datasets[0]?.backgroundColor || []} />
        </>
      ) : (
        <p>No Data Available</p>
      )}
    </div>
  );
};

export default PieChartComponent;
