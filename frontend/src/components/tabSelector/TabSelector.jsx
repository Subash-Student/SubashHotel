import React from "react";
import "./tabSelector.css";

const TabSelector = () => {
  return (
    <>
      <div className="total-amount-container">
        <span className="total-amount-label">Total Amount:</span>
        <span className="total-amount-value">$5000</span>
      </div>
    <div className="menu2-container">
      <div className="menu2-item income-section">INCOME</div>
      <div className="menu2-item expense-section">EXPENSE</div>
      <div className="menu2-item total-section">TOTAL</div>
    </div>
    </>
  );
};

export default TabSelector;
