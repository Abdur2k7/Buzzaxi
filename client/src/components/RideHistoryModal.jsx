import React from 'react';

const statusLabel = (status) => (status || 'booked').replaceAll('_', ' ');

export const RideHistoryModal = ({ isOpen, onClose, rides, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: '560px' }}>
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '18px' }}>Ride history</h2>
            <p style={{ color: '#6b7280', fontSize: '13px' }}>
              Past bookings for this account
            </p>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>
            Loading rides…
          </div>
        ) : (!rides || rides.length === 0) ? (
          <div style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>
            No rides yet. Book a trip to see it here.
          </div>
        ) : (
          <div className="history-list">
            {rides.map((ride) => (
              <div key={ride._id} className="history-item">
                <div>
                  <h4 style={{ fontSize: '15px' }}>{ride.route?.name || 'Mumbai route'}</h4>
                  <p style={{ fontSize: '13px', color: '#4b5563' }}>
                    {ride.vehicle?.name} · {ride.driver?.name}
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>
                    {ride.createdAt ? new Date(ride.createdAt).toLocaleString() : 'Recent'}
                    {ride.seatNumber ? ` · Seat ${ride.seatNumber}` : ''}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#d97706' }}>
                    ₹{ride.fare}
                  </div>
                  <div style={{ fontSize: '12px', marginTop: 4 }}>
                    {ride.rating ? (
                      <span style={{ color: '#d97706' }}>{'★'.repeat(ride.rating)}</span>
                    ) : (
                      <span className={`status-pill ${ride.status}`}>
                        {statusLabel(ride.status)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button type="button" className="btn-flat" onClick={onClose} style={{ justifyContent: 'center' }}>
          Close
        </button>
      </div>
    </div>
  );
};
