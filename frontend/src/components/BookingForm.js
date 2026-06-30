import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import './BookingForm.css';

const BookingForm = () => {
  const { bookRooms, randomOccupancy, resetAll, loading, stats } = useHotel();
  const [guestName, setGuestName] = useState('');
  const [numRooms, setNumRooms] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    await bookRooms(Number(numRooms), guestName.trim());
    setGuestName('');
    setNumRooms(1);
  };

  return (
    <div className="booking-form-card">
      <div className="form-header">
        <div className="form-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 21V9a3 3 0 0 1 6 0v12" />
            <path d="M21 16H3" />
          </svg>
        </div>
        <div>
          <h2 className="form-title">Book Rooms</h2>
          <p className="form-subtitle">Up to 5 rooms per booking</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label htmlFor="guestName">Guest Name</label>
          <input
            id="guestName"
            type="text"
            placeholder="Enter guest name"
            value={guestName}
            onChange={e => setGuestName(e.target.value)}
            required
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label htmlFor="numRooms">Number of Rooms</label>
          <div className="stepper">
            <button
              type="button"
              className="stepper-btn"
              onClick={() => setNumRooms(v => Math.max(1, v - 1))}
              disabled={numRooms <= 1}
            >−</button>
            <span className="stepper-value">{numRooms}</span>
            <button
              type="button"
              className="stepper-btn"
              onClick={() => setNumRooms(v => Math.min(5, v + 1))}
              disabled={numRooms >= 5}
            >+</button>
          </div>
          <p className="form-hint">Range: 1 – 5 rooms</p>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !guestName.trim() || stats.available < numRooms}
        >
          {loading ? (
            <span className="spinner"></span>
          ) : (
            <>Book {numRooms} Room{numRooms > 1 ? 's' : ''}</>
          )}
        </button>
      </form>

      <div className="action-buttons">
        <button
          className="btn btn-secondary"
          onClick={randomOccupancy}
          disabled={loading}
        >
          🎲 Random Occupancy
        </button>
        <button
          className="btn btn-danger"
          onClick={resetAll}
          disabled={loading}
        >
          🔄 Reset All
        </button>
      </div>
    </div>
  );
};

export default BookingForm;
