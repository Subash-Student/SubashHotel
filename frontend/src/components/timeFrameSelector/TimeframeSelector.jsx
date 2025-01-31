import React from "react";
import "./timeframeSelector.css";

const TimeframeSelector = () => {
  return (
    <div className="timeframe-selector">
      <div className="timeframe">1M</div>
      <div className="timeframe">6M</div>
      <div className="timeframe">1Y</div>
      <div className="timeframe active">ALL TIME</div>
      <div className="ellipsis">
        <i className="fas fa-ellipsis-h"></i>
      </div>
    </div>
  );
};

export default TimeframeSelector;
