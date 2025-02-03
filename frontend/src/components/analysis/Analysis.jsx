
import React from 'react'
import PieChartComponent from "../pieChart/PieChartComponent"
import LineChart from '../lineChart/LineChart'


import "./analysis.css"
const Analysis = () => {
  

  return (
    <div className='scroll'>
      <PieChartComponent isDate={true} searchDate={new Date().toISOString().split("T")[0]} isMargin={true} />
      <LineChart isDate={true} />
    </div>
  )
}

export default Analysis