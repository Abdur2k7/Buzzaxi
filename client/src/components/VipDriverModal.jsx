import React from 'react';

export const VipDriverModal = ({ vipDriver, onAccept, onReject }) => {
  if (!vipDriver) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div>
          <h2 style={{ fontSize: '18px' }}>VIP driver available</h2>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: 4 }}>
            Confirm this chauffeur for the Maybach trip, or continue with a standard driver.
          </p>
        </div>

        <div className="driver-strip">
          <img 
            src={vipDriver.photo} 
            alt={vipDriver.name}
            className="driver-avatar-img"
            onError={(e) => {
              e.target.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=VipDriver';
            }}
          />
          <div>
            <h3 style={{ fontSize: '16px' }}>{vipDriver.name}</h3>
            <p style={{ color: '#4b5563', fontSize: '14px' }}>{vipDriver.vehicle}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button type="button" className="btn-flat" style={{ flex: 1, justifyContent: 'center' }} onClick={onReject}>
            Standard driver
          </button>
          <button type="button" className="btn-flat btn-accent" style={{ flex: 1, justifyContent: 'center' }} onClick={onAccept}>
            Accept VIP
          </button>
        </div>
      </div>
    </div>
  );
};
