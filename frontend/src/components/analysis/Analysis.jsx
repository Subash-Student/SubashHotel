
import React from 'react'
import PieChartComponent from "../pieChart/PieChartComponent"
import LineChart from '../lineChart/LineChart'
import "./analysis.css"
const Analysis = () => {
  return (
    <div className='scroll'>
      <PieChartComponent isMargin={true} />
      <LineChart />
    </div>
  )
}

export default Analysis