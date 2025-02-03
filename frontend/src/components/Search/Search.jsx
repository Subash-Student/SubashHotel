import React, { useState, useEffect, useContext } from 'react';
import "./search.css";
import { StoreContext } from '../../context/context';
import Record from '../record/Record';
import PieChartComponent from "../pieChart/PieChartComponent";
import NumberBar from '../numberBar/NumberBar';

// Debounced search function (avoid excessive API calls)
const Search = () => {
  const { searchDate, setSearchDate } = useContext(StoreContext);

  // Handle date change and update the state
  const handleDateChange = (e) => {
    setSearchDate(e.target.value);
  };

  return (
    <div className='search'>
      <NumberBar date={searchDate}/>
      <div className="date-container">
        <label htmlFor="date" className="date-label">தேதியைத் தேர்ந்தெடுக்கவும்</label>
        <div className="input-wrapper">
          <input
            type="date"
            id="date"
            value={searchDate}
            onChange={handleDateChange} // Directly update date state
            className="date-input"
          />
        </div>
      </div>
      <Record isAddIcon={false}/>
      <PieChartComponent isDate={false} searchDate={searchDate} isMargin={false} />
    </div>
  );
};

export default Search;
