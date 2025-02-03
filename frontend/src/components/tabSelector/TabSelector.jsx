import React from "react";
import "./tabSelector.css";

const TabSelector = ({currentType,handleCurrentType,totalAmount}) => {

    

  return (
    <>
      <div className="total-amount-container">
        <span className="total-amount-label">மொத்த தொகை:</span>
        <span className={`total-amount-value${currentType === "income"?"-income":currentType ==="expense"?"-expense":totalAmount>0?"-income":"-expense"}`}>₹{totalAmount}</span>
      </div>
    <div className="menu2-container">
      <div className={`menu2-item income-section${currentType==="income" ?"-active":""}`} onClick={()=>handleCurrentType("income")}>வரவு </div>
      <div className={`menu2-item expense-section${currentType==="expense" ?"-active":""}`} onClick={()=>handleCurrentType("expense")}>செலவு</div>
      <div className={`menu2-item total-section${currentType==="total" ?"-active":""}`} onClick={()=>handleCurrentType("total")}>மொத்தம்</div>
    </div>
    </>
  );
};

export default TabSelector;
