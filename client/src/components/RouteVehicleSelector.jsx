import React, { useState } from 'react';
import { SeatSelector } from './SeatSelector';

export const RouteVehicleSelector = ({ 
  routes, 
  vehicles, 
  selectedRouteId, 
  onSelectRoute, 
  selectedVehicleId, 
  onSelectVehicle,
  selectedSeat,
  onSelectSeat
}) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const allVehicleCategories = vehicles.map(v => v.category);
  const categoriesTabs = ['All', ...allVehicleCategories];

  const filteredVehicles = activeCategory === 'All'
    ? vehicles.flatMap(group => group.items.map(item => ({ ...item, categoryGroup: group.category })))
    : (vehicles.find(group => group.category === activeCategory)?.items || []).map(item => ({ ...item, categoryGroup: activeCategory }));

  const selectedVehicle = filteredVehicles.find(v => v.id === selectedVehicleId)
    || vehicles.flatMap(group => group.items).find(v => v.id === selectedVehicleId);

  return (
    <div className="flat-card" id="booking-section">
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700' }}>1. Choose Route & Vehicle</h2>
        <p style={{ color: '#4b5563', fontSize: '14px', marginTop: '4px' }}>
          Select your Mumbai route, vehicle, then tap a seat in the car.
        </p>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="route-select">Route</label>
        <select 
          id="route-select"
          className="select-input"
          value={selectedRouteId}
          onChange={(e) => onSelectRoute(e.target.value)}
        >
          <option value="" disabled>Select a Mumbai route</option>
          {routes.map((group) => (
            <optgroup key={group.category} label={group.category}>
              {group.items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.distance} km)
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Vehicle Category</label>
        <div className="category-tabs">
          {categoriesTabs.map(cat => (
            <button
              key={cat}
              type="button"
              className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Available Vehicles</label>
        <div className="vehicles-grid">
          {filteredVehicles.map(v => {
            const isSelected = selectedVehicleId === v.id;
            return (
              <div 
                key={v.id}
                className={`vehicle-card ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectVehicle(v.id)}
              >
                <div className="vehicle-card-name">{v.name}</div>
                <div className="vehicle-card-meta">
                  <span>{v.passengerCapacity} passenger seats</span>
                  <span className="vehicle-card-price">₹{v.pricePerKm}/km</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedVehicle && (
        <SeatSelector
          capacity={selectedVehicle.passengerCapacity}
          selectedSeat={selectedSeat}
          onSelect={onSelectSeat}
        />
      )}
    </div>
  );
};
