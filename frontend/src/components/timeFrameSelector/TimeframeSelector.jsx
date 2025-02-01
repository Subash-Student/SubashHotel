import React, { useState } from "react";
import "./timeframeSelector.css";
import { AiOutlineClose } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";

const TimeframeSelector = ({ date = { startDay: new Date().toISOString(), endDay: new Date().toISOString() }, setDate }) => {
  const [showModal, setShowModal] = useState(false);
  const [activeTimeframe, setActiveTimeframe] = useState("TODAY");

  const [tempDate, setTempDate] = useState({
    startDay: date.startDay.split("T")[0],
    endDay: date.endDay.split("T")[0],
  });

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const getStartOfWeek = () => {
    const today = new Date();
    const firstDay = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Monday
    firstDay.setHours(0, 0, 0, 0);
    return firstDay.toISOString();
  };

  const getEndOfWeek = () => {
    const today = new Date();
    const lastDay = new Date(today.setDate(today.getDate() - today.getDay() + 7)); // Sunday
    lastDay.setHours(23, 59, 59, 999);
    return lastDay.toISOString();
  };

  const getStartOfMonth = () => {
    const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    firstDay.setHours(0, 0, 0, 0);
    return firstDay.toISOString();
  };

  const getEndOfMonth = () => {
    const lastDay = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    lastDay.setHours(23, 59, 59, 999);
    return lastDay.toISOString();
  };

  const updateTimeframe = (timeframe) => {
    let start, end;

    if (timeframe === "TODAY") {
      start = new Date().toISOString();
      end = new Date().toISOString();
    } else if (timeframe === "WEEK") {
      start = getStartOfWeek();
      end = getEndOfWeek();
    } else if (timeframe === "MONTH") {
      start = getStartOfMonth();
      end = getEndOfMonth();
    }

    setDate({ startDay: start, endDay: end });
    setActiveTimeframe(timeframe);
    setShowModal(false);
  };

  const handleDateChange = (e, type) => {
    setTempDate((prev) => ({
      ...prev,
      [type]: e.target.value,
    }));
  };

  const saveDateRange = () => {
    const start = new Date(tempDate.startDay).toISOString();
    const end = new Date(tempDate.endDay).toISOString();
    setDate({ startDay: start, endDay: end });
    setShowModal(false);
  };

  return (
    <div className="timeframe-selector">
      <div
        className={`timeframe ${activeTimeframe === "TODAY" ? "active" : ""}`}
        onClick={() => updateTimeframe("TODAY")}
      >
        Today
      </div>
      <div
        className={`timeframe ${activeTimeframe === "WEEK" ? "active" : ""}`}
        onClick={() => updateTimeframe("WEEK")}
      >
        Week
      </div>
      <div
        className={`timeframe ${activeTimeframe === "MONTH" ? "active" : ""}`}
        onClick={() => updateTimeframe("MONTH")}
      >
        Month
      </div>
      <span className="ellipsis" onClick={toggleModal}>
        <BsThreeDotsVertical />
      </span>

      {showModal && (
        <div className="modal-overlay3" onClick={toggleModal}>
          <div className="modal3" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header3">
              <h3>Select Date Range</h3>
              <AiOutlineClose className="close-icon" onClick={toggleModal} />
            </div>
            <label>Start Date</label>
            <input
              type="date"
              className="date-input"
              value={tempDate.startDay}
              onChange={(e) => handleDateChange(e, "startDay")}
            />
            <label>End Date</label>
            <input
              type="date"
              className="date-input"
              value={tempDate.endDay}
              onChange={(e) => handleDateChange(e, "endDay")}
            />
            <button className="save-btn3" onClick={saveDateRange}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeframeSelector;
