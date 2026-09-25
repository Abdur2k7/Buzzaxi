import React, { useState } from 'react';

export const RatingModal = ({ ride, onSubmitRating, onClose }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  if (!ride) return null;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmitRating(ride._id, rating);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h2 style={{ fontSize: '18px' }}>Rate this ride</h2>
          <button type="button" className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#4b5563', fontSize: '14px' }}>
            How was your trip with {ride.driver?.name} in a {ride.vehicle?.name}?
          </p>

          <div className="star-rating-box">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-btn ${(hoverRating || rating) >= star ? 'active' : ''}`}
                onMouseEnter={() => setHoverRating(star)}
                onClick={() => setRating(star)}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <button 
          type="button" 
          className="btn-flat btn-accent"
          disabled={submitting}
          onClick={handleSubmit}
          style={{ justifyContent: 'center' }}
        >
          {submitting ? 'Submitting…' : 'Submit rating'}
        </button>
      </div>
    </div>
  );
};
