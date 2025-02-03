import React, { useContext, useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { StoreContext } from '../../context/context';
import TimeframeSelector from '../timeFrameSelector/TimeframeSelector';
import TabSelector from '../tabSelector/TabSelector';
import './piChart.css';

Chart.register(...registerables, ChartDataLabels);

const PieChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!data?.labels?.length) return;

    const ctx = chartRef.current.getContext('2d');
    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(ctx, {
      type: 'pie',
      data,
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ({ dataset, dataIndex }) => {
                const total = dataset.data.reduce((sum, val) => sum + val, 0);
                const value = dataset.data[dataIndex];
                return ` ${data.labels[dataIndex]}: $${value} (${((value / total) * 100).toFixed(1)}%)`;
              },
            },
          },
          datalabels: {
            color: '#fff',
            formatter: (value, context) => {
              const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
              return `${((value / total) * 100).toFixed(1)}%`;
            },
          },
        },
      },
    });

    return () => chartInstance.current.destroy();
  }, [data]);

  return <canvas ref={chartRef} />;
};

const Legend = ({ labels, colors }) => (
  <div className="legend-container">
    {labels.map((label, index) => (
      <div key={index} className="legend-item">
        <span className="legend-color" style={{ backgroundColor: colors[index] }} />
        <span>{label}</span>
      </div>
    ))}
  </div>
);

const PieChartComponent = ({ isMargin ,isDate ,searchDate}) => {
  const { records, queryClient } = useContext(StoreContext);
  const [totalAmount, setTotalAmount] = useState(0);
  const [expenseData, setExpenseData] = useState({ labels: [], datasets: [] });
  const [currentType, setCurrentType] = useState('expense');
  const [date, setDate] = useState({
    startDay: new Date().toISOString(),
    endDay: new Date().toISOString(),
  });

  useEffect(() => {
    setDate({
      startDay: `${searchDate}T`,
      endDay: `${searchDate}T`,
    });
  }, [searchDate]);


  useEffect(() => {
    queryClient.invalidateQueries(['records']);
    if (!records || !records.length) return;
  
    let labels = [], data = [], backgroundColor = [];
    let total = 0;
  
    const filteredRecords = records.filter(
      ({ createdAt, catagory }) =>
        createdAt.split('T')[0] >= date.startDay.split('T')[0] &&
        createdAt.split('T')[0] <= date.endDay.split('T')[0] &&
        (currentType === 'total' || catagory === currentType)
    );
  
    if (currentType === 'total') {
      let income = 0, expense = 0;
      filteredRecords.forEach(({ catagory, amount }) => {
        catagory === 'income' ? (income += amount) : (expense += amount);
      });
      total = income - expense;
      labels = ['வரவு', 'செலவு'];
      data = [income, expense];
      backgroundColor = ['#22c55e', '#ef4444'];
    } else {
      total = filteredRecords.reduce((sum, { amount }) => sum + amount, 0);
      
      // Aggregate amounts for the same reason
      const reasonMap = new Map();
      filteredRecords.forEach(({ reason, amount }) => {
        reasonMap.set(reason, (reasonMap.get(reason) || 0) + amount);
      });
  
      labels = [...reasonMap.keys()];
      data = [...reasonMap.values()];
      backgroundColor = [
        '#3357FF', '#FF33A1', '#A133FF', '#33FFF5', '#F5FF33', '#FF8C33',
        '#8C33FF', '#33FF8C', '#FF3333', '#33FF33', '#3333FF', '#FFB533',
        '#B533FF', '#33FFB5', '#FF3357', '#5733FF', '#33A1FF', '#A1FF33',
      ].slice(0, labels.length); // Adjust colors dynamically
  
    }
  
    setTotalAmount(total);
    setExpenseData({ labels, datasets: [{ data, backgroundColor, hoverOffset: 10 }] });
  }, [date, currentType, records, queryClient]);
  

  return (
    <div className={isMargin ? 'chart-container' : 'chart-container-lessMargin'}>
      <TabSelector currentType={currentType} handleCurrentType={setCurrentType} totalAmount={totalAmount} />
      {isDate &&  <TimeframeSelector date={date} setDate={setDate} isLine={false} />}
     
      {expenseData.labels.length ? (
        <>
          <PieChart data={expenseData} />
          <Legend labels={expenseData.labels} colors={expenseData.datasets[0]?.backgroundColor || []} />
        </>
      ) : (
        <img src="no-data-img.png" className='no-data-img' alt="" />
      )}
    </div>
  );
};

export default PieChartComponent;
