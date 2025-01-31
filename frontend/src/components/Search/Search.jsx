import React from 'react'
import "./search.css"
import Record from '../record/Record'
import PieChartComponent from "../pieChart/PieChartComponent"

const Search = () => {
  return (
    <div className='search'>
     <div class="date-container">
  <label for="date" class="date-label">Select a Date to View Records</label>
  <div class="input-wrapper">
    <input type="date" id="date" name="date" class="date-input" />
    <button type="submit" class="submit-btn">Submit</button>
  </div>
</div>
   <Record />
   <PieChartComponent isMargin={false}/>
    </div>
  )
}

export default Search