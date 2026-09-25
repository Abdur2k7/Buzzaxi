import React from 'react';

export const FareSummaryCard = ({ 
  selectedRoute, 
  selectedVehicle, 
  selectedSeat,
  fare, 
  loading, 
  onBookRide 
}) => {
  const isReady = selectedRoute && selectedVehicle && selectedSeat;

  return (
    <div className="flat-card summary-panel">
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: '700' }}>2. Price Estimate</h2>
        <p style={{ color: '#4b5563', fontSize: '14px', marginTop: '4px' }}>
          Calculated based on standard route distance.
        </p>
      </div>

      <table className="fare-table">
        <tbody>
          <tr>
            <td style={{ color: '#4b5563' }}>Route</td>
            <td>{selectedRoute ? selectedRoute.name : '—'}</td>
          </tr>
          <tr>
            <td style={{ color: '#4b5563' }}>Distance</td>
            <td>{selectedRoute ? `${selectedRoute.distance} km` : '0 km'}</td>
          </tr>
          <tr>
            <td style={{ color: '#4b5563' }}>Vehicle</td>
            <td>{selectedVehicle ? selectedVehicle.name : '—'}</td>
          </tr>
          <tr>
            <td style={{ color: '#4b5563' }}>Rate</td>
            <td>{selectedVehicle ? `₹${selectedVehicle.pricePerKm} / km` : '—'}</td>
          </tr>
          <tr>
            <td style={{ color: '#4b5563' }}>Capacity</td>
            <td>{selectedVehicle ? `${selectedVehicle.passengerCapacity} seats` : '—'}</td>
          </tr>
          <tr>
            <td style={{ color: '#4b5563' }}>Seat</td>
            <td>{selectedSeat ? `Seat ${selectedSeat}` : '—'}</td>
          </tr>
          <tr className="fare-total-row">
            <td>Total Fare</td>
            <td>
              <div className="fare-total-amount">₹{fare}</div>
            </td>
          </tr>
        </tbody>
      </table>

      <button 
        type="button"
        className="btn-flat btn-accent"
        style={{ width: '100%', justifyContent: 'center', padding: '12px 20px', fontSize: '15px' }}
        disabled={!isReady || loading}
        onClick={onBookRide}
      >
        {loading ? 'Assigning driver…' : !isReady ? 'Select route, vehicle & seat' : 'Book Ride'}
      </button>
    </div>
  );
};
