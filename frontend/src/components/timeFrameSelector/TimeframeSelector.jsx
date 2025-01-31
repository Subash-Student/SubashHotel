import React, { useState } from "react";
import "./timeframeSelector.css";
import { AiOutlineClose } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";

const TimeframeSelector = () => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="timeframe-selector">
      <div className="timeframe">1M</div>
      <div className="timeframe">6M</div>
      <div className="timeframe">1Y</div>
      <div className="timeframe active" onClick={toggleModal}>
        ALL TIME
      </div>
        <span className="ellipsis" onClick={toggleModal}><  BsThreeDotsVertical /></span>
      {showModal && (
        <div className="modal-overlay3" onClick={toggleModal}>
          <div className="modal3" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header3">
              <h3>Select Date Range</h3>
              <AiOutlineClose className="close-icon" onClick={toggleModal} />
            </div>
            <label>Start Date</label>
            <input type="date" className="date-input" />
            <label>End Date</label>
            <input type="date" className="date-input" />
            <button className="close-btn3" onClick={toggleModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeframeSelector;
