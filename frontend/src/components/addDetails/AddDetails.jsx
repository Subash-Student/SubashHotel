import React, { useState } from "react";
import "./add.css"
const AddDetails = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [currentType,setCurrentType] = useState("expense");

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleToggleDetails = () => {
    setShowMoreDetails(!showMoreDetails);
  };

  return (
    isOpen && (
      <div className="popup-overlay">
        <div className="popup-content">
          {/* Navbar */}
          <div className="popup-navbar">
            <button className={`popup-nav-button ${currentType === "income" ? "income":""}`} onClick={()=>setCurrentType("income")}>Income</button>
            <button className={`popup-nav-button ${currentType === "expense" ? "expense":""}`} onClick={()=>setCurrentType("expense")}>Expense</button>
            <button onClick={handleClose} className="popup-close-button">
              X
            </button>
          </div>

          {/* Body */}
          <div className="popup-body">
            {/* Default Reasons Select */}
            <div className="form-group">
              <label className="form-label">Default Reasons</label>
              <select className="form-input">
                <option value="">Select a reason</option>
                <option value="food">Food</option>
                <option value="travel">Travel</option>
                <option value="shopping">Shopping</option>
              </select>
            </div>

            {/* Custom Reason Input */}
            <div className="form-group">
              <label className="form-label">Reason</label>
              <input
                type="text"
                placeholder="Enter your reason"
                className="form-input"
              />
            </div>

            {/* Amount Input */}
            <div className="form-group">
              <label className="form-label">Amount</label>
              <input
                type="number"
                placeholder="Enter amount"
                className="form-input"
              />
            </div>

            {/* Payment Options and Checkboxes */}
            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <div className="payment-options">
                <label>
                  <input type="radio" name="payment" value="cash" /> Cash
                </label>
                <label>
                  <input type="radio" name="payment" value="gpay" /> GPay
                </label>
              </div>
              <label className="form-label">Others</label>
             
              <div className="action-row">
                
                <div className="form-checkbox-group">
                  <div className="form-checkbox">
                    <input type="checkbox" id="make-default" />
                    <label htmlFor="make-default" className="font">Make it default</label>
                  </div>
                  <div className="form-checkbox">
                    <input type="checkbox" id="from-income" />
                    <label htmlFor="from-income" className="font">From income</label>
                  </div>
                </div>

              </div>
            </div>
            <div className="image-container">
            <img
                src="https://static.thenounproject.com/png/1123247-200.png"
                alt="Attachment"
              
              />
            <button onClick={handleToggleDetails} className="more-details">
                  More details
                </button>
            </div>
            {/* Additional Details */}
            {showMoreDetails && (
              <div className="more-details-content">
                <div className="form-group">
                  <label className="form-label">Person Name</label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="Enter mobile"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Upload Image</label>
                  <input type="file" className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Voice Record</label>
                  <button className="record-button">Hold to Record</button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="popup-footer">
            <button className="submit-button">Submit</button>
          </div>
        </div>
      </div>
    )
  );
};

export default AddDetails;
