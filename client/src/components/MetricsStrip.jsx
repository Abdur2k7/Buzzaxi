import React from 'react';

export const MetricsStrip = () => {
  return (
    <div className="metrics-strip">
      <div className="metric-item">
        <div className="metric-number">18</div>
        <div className="metric-label">Mumbai Routes</div>
      </div>
      <div className="metric-item">
        <div className="metric-number">₹10 – ₹45</div>
        <div className="metric-label">Fixed Rates / km</div>
      </div>
      <div className="metric-item">
        <div className="metric-number">2 – 6</div>
        <div className="metric-label">Seats per Shuttle</div>
      </div>
      <div className="metric-item">
        <div className="metric-number">4.8 / 5.0</div>
        <div className="metric-label">Driver Rating</div>
      </div>
    </div>
  );
};
