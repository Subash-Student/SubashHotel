import React, { useState } from "react";
import "./timeframeSelector.css";
import { AiOutlineClose } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";

const TimeframeSelector = ({
  date = { startDay: new Date().toISOString(), endDay: new Date().toISOString() },
  setDate,
  isSmallFont,
  isLine,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [activeTimeframe, setActiveTimeframe] = useState("TODAY");
  const [tempDate, setTempDate] = useState({
    startDay: date.startDay.split("T")[0],
    endDay: date.endDay.split("T")[0],
  });

  const toggleModal = () => setShowModal(!showModal);

  // ✅ Utility functions for date calculations
  const getStartOfWeek = (weeksAgo = 0) => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1) - 7 * weeksAgo);
    monday.setHours(0, 0, 0, 0);
    return monday.toISOString();
  };

  const getEndOfWeek = (weeksAgo = 0) => {
    const sunday = new Date(getStartOfWeek(weeksAgo));
    sunday.setDate(sunday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    return sunday.toISOString();
  };

  const getStartOfMonth = (monthsAgo = 0) => {
    const firstDay = new Date(new Date().getFullYear(), new Date().getMonth() - monthsAgo, 1);
    firstDay.setHours(0, 0, 0, 0);
    return firstDay.toISOString();
  };

  const getEndOfMonth = (monthsAgo = 0) => {
    const lastDay = new Date(new Date().getFullYear(), new Date().getMonth() - monthsAgo + 1, 0);
    lastDay.setHours(23, 59, 59, 999);
    return lastDay.toISOString();
  };

  const updateTimeframe = (timeframe) => {
    let start, end;
    switch (timeframe) {
      case "TODAY":
        start = end = new Date().toISOString();
        break;
      case "WEEK":
        start = getStartOfWeek();
        end = getEndOfWeek();
        break;
      case "LAST_WEEK":
        start = getStartOfWeek(1);
        end = getEndOfWeek(1);
        break;
      case "MONTH":
        start = getStartOfMonth();
        end = getEndOfMonth();
        break;
      case "LAST_MONTH":
        start = getStartOfMonth(1);
        end = getEndOfMonth(1);
        break;
      default:
        return;
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
    setDate({
      startDay: new Date(tempDate.startDay).toISOString(),
      endDay: new Date(tempDate.endDay).toISOString(),
    });
    setShowModal(false);
  };

  return (
    <div className="timeframe-selector">
      <div
        className={`timeframe ${isSmallFont ? "timeframe-small" : ""} ${
          activeTimeframe === (isLine ? "WEEK" : "TODAY") ? "active" : ""
        }`}
        onClick={() => updateTimeframe(isLine ? "WEEK" : "TODAY")}
      >
        {isLine ? "இந்த வாரம்" : "இன்று"}
      </div>

      <div
        className={`timeframe ${isSmallFont ? "timeframe-small" : ""} ${
          activeTimeframe === (isLine ? "LAST_WEEK" : "WEEK") ? "active" : ""
        }`}
        onClick={() => updateTimeframe(isLine ? "LAST_WEEK" : "WEEK")}
      >
        {isLine ? "கடந்த வாரம்" : "வாரம்"}
      </div>

      {isLine && (
        <div
          className={`timeframe ${isSmallFont ? "timeframe-small" : ""} ${
            activeTimeframe === "MONTH" ? "active" : ""
          }`}
          onClick={() => updateTimeframe("MONTH")}
        >
          இந்த மாதம்
        </div>
      )}

      <div
        className={`timeframe ${isSmallFont ? "timeframe-small" : ""} ${
          activeTimeframe === (isLine ? "LAST_MONTH" : "MONTH") ? "active" : ""
        }`}
        onClick={() => updateTimeframe(isLine ? "LAST_MONTH" : "MONTH")}
      >
        {isLine ? "கடந்த மாதம்" : "மாதம்"}
      </div>

      <span className="ellipsis" onClick={toggleModal}>
        <BsThreeDotsVertical />
      </span>

      {showModal && (
        <div className="modal-overlay3" onClick={toggleModal}>
          <div className="modal3" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header3">
              <h3>தேதி வரம்பு</h3>
              <AiOutlineClose className="close-icon" onClick={toggleModal} />
            </div>

            <div className="input-group">
              <label>தொடக்க நாள்</label>
              <input
                type="date"
                className="date-input"
                value={tempDate.startDay}
                onChange={(e) => handleDateChange(e, "startDay")}
              />
            </div>

            <div className="input-group">
              <label>இறுதி நாள்</label>
              <input
                type="date"
                className="date-input"
                value={tempDate.endDay}
                onChange={(e) => handleDateChange(e, "endDay")}
              />
            </div>

            <div className="button-group">
              <button className="save-btn3" onClick={saveDateRange}>
                சமர்ப்பிக்கவும்
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeframeSelector;
