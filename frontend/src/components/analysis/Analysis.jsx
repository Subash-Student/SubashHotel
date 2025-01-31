
import React from 'react'
import PieChartComponent from "../pieChart/PieChartComponent"
import LineChart from '../lineChart/LineChart'

const Analysis = () => {
  return (
    <div>
      <PieChartComponent isMargin={true} />
      <LineChart />
    </div>
  )
}

export default Analysis