import React, { useState, useEffect } from 'react';
import { SeatSelector } from './SeatSelector';

export const ActiveRideTracker = ({ 
  ride, 
  onConfirmSeat, 
  onUpdateStatus, 
  onCancelRide, 
  onTriggerRating 
}) => {
  const [selectedSeat, setSelectedSeat] = useState(ride.seatNumber || null);
  const [isSubmittingSeat, setIsSubmittingSeat] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState('');

  const {
    _id,
    driver,
    route,
    vehicle,
    fare,
    status,
    totalPassengers = 0,
    availableSeats = 0,
    occupiedSeats = [],
    seatNumber
  } = ride;

  const capacity = vehicle?.capacity || (totalPassengers + availableSeats) || 4;

  const rideProgress = [
    { status: 'booked', label: 'Confirmed' },
    { status: 'driver_assigned', label: 'Driver assigned' },
    { status: 'in_progress', label: 'En route' },
    { status: 'arrived', label: 'Driver arrived' },
    { status: 'completed', label: 'Completed' }
  ];
  const statusIndex = rideProgress.findIndex((item) => item.status === status);
  const currentProgressIndex = statusIndex < 0 ? 0 : statusIndex;

  const transitionRide = async (nextStatus) => {
    setIsUpdatingStatus(true);
    setStatusError('');
    try {
      const updatedRide = await onUpdateStatus(_id, nextStatus);
      if (!updatedRide) throw new Error('The ride status was not saved. Please try again.');
      if (nextStatus === 'completed') onTriggerRating(updatedRide);
      return updatedRide;
    } catch (error) {
      setStatusError(error.message || 'Could not update the ride. Please try again.');
      return null;
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  useEffect(() => {
    let timer1, timer2;
    if ((status === 'driver_assigned' || status === 'in_progress') && seatNumber) {
      timer1 = setTimeout(() => {
        transitionRide('arrived');
      }, 4000);
    } else if (status === 'arrived') {
      timer2 = setTimeout(() => {
        transitionRide('completed');
      }, 6000);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [status, seatNumber, _id]);

  const handleRetryStatus = () => transitionRide(status === 'arrived' ? 'completed' : 'arrived');

  const handleSeatConfirm = async () => {
    if (!selectedSeat) return;
    setIsSubmittingSeat(true);
    try {
      await onConfirmSeat(_id, selectedSeat);
    } finally {
      setIsSubmittingSeat(false);
    }
  };

  const getStatusLabel = (s) => {
    switch(s) {
      case 'driver_assigned': return 'Driver on the way';
      case 'in_progress': return 'En route';
      case 'arrived': return 'Driver arrived';
      case 'completed': return 'Trip completed';
      case 'cancelled': return 'Ride cancelled';
      default: return 'Active';
    }
  };

  return (
    <div className="flat-card active-ride-panel">
      <ol className="ride-progress" aria-label="Ride progress">
        {rideProgress.map((item, index) => {
          const state = index < currentProgressIndex ? 'complete' : index === currentProgressIndex ? 'current' : 'upcoming';
          return (
            <li key={item.status} className={`ride-progress-step ${state}`} aria-current={state === 'current' ? 'step' : undefined}>
              <span className="ride-progress-marker" aria-hidden="true">{state === 'complete' ? '✓' : index + 1}</span>
              <span className="ride-progress-label">{item.label}</span>
            </li>
          );
        })}
      </ol>

      <div className="ride-header-status">
        <div>
          <span style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>
            Booking #{String(_id).slice(-6).toUpperCase()}
          </span>
          <h2 style={{ fontSize: '18px', marginTop: '4px' }}>
            {route.name}
          </h2>
        </div>
        <span className={`status-pill ${status}`}>
          {getStatusLabel(status)}
        </span>
      </div>

      {statusError && (
        <div className="ride-status-error" role="alert">
          <span>{statusError}</span>
          <button type="button" className="btn-flat btn-danger" disabled={isUpdatingStatus} onClick={handleRetryStatus}>
            {isUpdatingStatus ? 'Saving…' : status === 'arrived' ? 'Retry completion' : 'Retry update'}
          </button>
        </div>
      )}

      <div className="driver-strip">
        <img 
          src={driver.photo} 
          alt={driver.name} 
          className="driver-avatar-img"
          onError={(e) => {
            e.target.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=MumbaiDriver';
          }}
        />
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '16px' }}>
            {driver.name}
            {driver.isVip && <span className="vip-tag"> VIP</span>}
          </h3>
          <p style={{ color: '#4b5563', fontSize: '14px' }}>
            {driver.vehicle} · {vehicle.name}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>Fare</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#d97706' }}>
            ₹{fare}
          </div>
        </div>
      </div>

      {!seatNumber && status !== 'cancelled' && status !== 'completed' ? (
        <div>
          <SeatSelector
            capacity={capacity}
            occupiedSeats={occupiedSeats}
            selectedSeat={selectedSeat}
            onSelect={setSelectedSeat}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
            <button
              type="button"
              className="btn-flat btn-accent"
              disabled={!selectedSeat || isSubmittingSeat}
              onClick={handleSeatConfirm}
            >
              {isSubmittingSeat ? 'Confirming…' : `Confirm seat ${selectedSeat || ''}`}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <SeatSelector
            capacity={capacity}
            occupiedSeats={occupiedSeats}
            selectedSeat={seatNumber || selectedSeat}
            readOnly
          />
          {status === 'completed' && (
            <button
              type="button"
              className="btn-flat btn-accent"
              style={{ marginTop: 12 }}
              onClick={() => onTriggerRating(ride)}
            >
              Rate driver
            </button>
          )}
        </div>
      )}

      {status !== 'completed' && status !== 'cancelled' && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>
            {status === 'arrived' ? 'Your driver has arrived.' : 'Need to change plans?'}
          </span>
          <div className="ride-footer-actions">
            {status === 'arrived' && <button type="button" className="btn-flat btn-accent" disabled={isUpdatingStatus} onClick={() => transitionRide('completed')}>{isUpdatingStatus ? 'Finishing…' : 'Finish ride'}</button>}
            <button type="button" className="btn-flat btn-danger" onClick={() => onCancelRide(_id)}>Cancel ride</button>
          </div>
        </div>
      )}
    </div>
  );
};
