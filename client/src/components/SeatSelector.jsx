import React from 'react';

const nextSeatFactory = () => {
  let n = 1;
  return () => n++;
};

export const buildSeatLayout = (capacity) => {
  const count = Math.max(1, Number(capacity) || 3);
  const next = nextSeatFactory();

  if (count <= 2) {
    return [
      [{ type: 'gap' }, { type: 'driver' }],
      Array.from({ length: count }, () => ({ type: 'seat', id: next() }))
    ];
  }

  const rows = [[{ type: 'seat', id: next() }, { type: 'driver' }]];
  let remaining = count - 1;

  while (remaining > 0) {
    const width = remaining === 4 ? 2 : Math.min(3, remaining);
    rows.push(Array.from({ length: width }, () => ({ type: 'seat', id: next() })));
    remaining -= width;
  }

  return rows;
};

export const SeatSelector = ({
  capacity = 4,
  occupiedSeats = [],
  selectedSeat = null,
  onSelect,
  disabled = false,
  readOnly = false
}) => {
  const rows = buildSeatLayout(capacity);
  const occupied = new Set((occupiedSeats || []).map(Number));
  const availableCount = Math.max(0, capacity - occupied.size);

  const handleSelect = (id) => {
    if (disabled || readOnly || occupied.has(id)) return;
    onSelect?.(selectedSeat === id ? null : id);
  };

  return (
    <div className="seat-selector">
      <div className="seat-selector-header">
        <span className="form-label" style={{ margin: 0 }}>Choose a seat</span>
        <span className="seat-selector-meta">{availableCount} available</span>
      </div>

      <div className="car-stage">
        <div className="car-body" aria-label="Car seat map, viewed from above">
          <div className="car-hood">
            <div className="car-windshield">Front</div>
          </div>

          <div className="car-cabin">
            {rows.map((row, rowIndex) => (
              <div
                key={`row-${rowIndex}`}
                className={`car-row ${row.length === 2 ? 'car-row-split' : ''}`}
              >
                {row.map((cell, cellIndex) => {
                  if (cell.type === 'gap') {
                    return <div key={`gap-${cellIndex}`} className="seat-slot seat-slot-empty" />;
                  }

                  if (cell.type === 'driver') {
                    return (
                      <div key="driver" className="seat-slot seat-slot-driver" title="Driver">
                        <span className="seat-cushion">D</span>
                        <span className="seat-caption">Driver</span>
                      </div>
                    );
                  }

                  const isTaken = occupied.has(cell.id);
                  const isSelected = selectedSeat === cell.id;
                  const state = isTaken ? 'taken' : isSelected ? 'selected' : 'available';

                  return (
                    <button
                      key={cell.id}
                      type="button"
                      className={`seat-slot seat-slot-passenger ${state}`}
                      disabled={disabled || isTaken || readOnly}
                      aria-pressed={isSelected}
                      aria-label={`Seat ${cell.id}, ${state}`}
                      onClick={() => handleSelect(cell.id)}
                    >
                      <span className="seat-cushion">{cell.id}</span>
                      <span className="seat-caption">
                        {isTaken ? 'Taken' : isSelected ? 'Yours' : 'Open'}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="car-bumper" />
        </div>
      </div>

      <div className="seat-legend">
        <span><i className="legend-swatch available" /> Available</span>
        <span><i className="legend-swatch selected" /> Selected</span>
        <span><i className="legend-swatch taken" /> Taken</span>
        <span><i className="legend-swatch driver" /> Driver</span>
      </div>
    </div>
  );
};
