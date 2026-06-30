import React from 'react';
import { useHotel } from '../context/HotelContext';
import './FloorMap.css';

const FLOORS = 10;
const ROOMS_PER_FLOOR = [10, 10, 10, 10, 10, 10, 10, 10, 10, 7];

const FloorMap = () => {
  const { rooms, lastBooked } = useHotel();

  const roomMap = {};
  rooms.forEach(r => { roomMap[r.roomNumber] = r; });

  const getRoomStatus = (roomNumber) => {
    const room = roomMap[roomNumber];
    if (!room) return 'unknown';
    if (lastBooked.includes(roomNumber)) return 'just-booked';
    if (room.isOccupied) return 'occupied';
    return 'available';
  };

  const getRoomNumber = (floor, pos) => {
    if (floor === 10) return 1000 + pos;
    return floor * 100 + pos;
  };

  return (
    <div className="floor-map-container">
      <div className="floor-map-legend">
        <span className="legend-item">
          <span className="legend-dot available"></span> Available
        </span>
        <span className="legend-item">
          <span className="legend-dot occupied"></span> Occupied
        </span>
        <span className="legend-item">
          <span className="legend-dot just-booked"></span> Just Booked
        </span>
        <span className="legend-item">
          <span className="legend-dot lift"></span> Lift/Stairs
        </span>
      </div>

      <div className="floor-grid">
        {Array.from({ length: FLOORS }, (_, i) => FLOORS - i).map(floor => {
          const count = ROOMS_PER_FLOOR[floor - 1];
          return (
            <div key={floor} className="floor-row">
              <div className="floor-label">
                <span className="floor-number">F{floor}</span>
                {floor === 10 && <span className="floor-tag top">TOP</span>}
              </div>
              <div className="lift-cell" title="Lift / Stairs">
                <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                  <rect x="1" y="1" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M4 7l3-3 3 3M4 9l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="rooms-row">
                {Array.from({ length: count }, (_, j) => j + 1).map(pos => {
                  const num = getRoomNumber(floor, pos);
                  const status = getRoomStatus(num);
                  return (
                    <div
                      key={num}
                      className={`room room-${status}`}
                      title={`Room ${num} — ${status}`}
                    >
                      <span className="room-number">{num}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FloorMap;
