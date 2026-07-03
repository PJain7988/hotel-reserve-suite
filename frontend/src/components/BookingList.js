import React from 'react';
import { useHotel } from '../context/HotelContext';
import './BookingList.css';

const BookingList = () => {
  const { bookings, cancelBooking, loading } = useHotel();

  if (bookings.length === 0) {
    return (
      <div className="booking-list-card" style={{ background: 'linear-gradient(145deg, rgba(30,30,40,0.8) 0%, rgba(20,20,30,0.9) 100%)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <h3 className="list-title" style={{ fontSize: '18px', background: 'linear-gradient(135deg, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 0 10px rgba(165,180,252,0.3)' }}>Active Bookings</h3>
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted-dark)', margin: '0 auto' }}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="4" />
              <line x1="8" y1="2" x2="8" y2="4" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <p>No active bookings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-list-card" style={{ background: 'linear-gradient(145deg, rgba(30,30,40,0.8) 0%, rgba(20,20,30,0.9) 100%)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <h3 className="list-title" style={{ fontSize: '18px', background: 'linear-gradient(135deg, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 0 10px rgba(165,180,252,0.3)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        Active Bookings
        <span className="list-count" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', boxShadow: '0 0 10px rgba(139,92,246,0.5)', WebkitTextFillColor: '#fff', textShadow: 'none' }}>{bookings.length}</span>
      </h3>
      <div className="bookings-list">
        {bookings.map(b => (
          <div key={b._id} className="booking-item">
            <div className="booking-header">
              <div>
                <p className="booking-guest">{b.guestName}</p>
                <p className="booking-ref">{b.bookingReference}</p>
              </div>
              <button
                className="cancel-btn"
                onClick={() => cancelBooking(b._id)}
                disabled={loading}
                title="Cancel booking"
              >
                ✕
              </button>
            </div>
            <div className="booking-rooms">
              {b.roomNumbers.map(num => (
                <span key={num} className="room-badge">{num}</span>
              ))}
            </div>
            <div className="booking-meta">
              <span className="meta-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Travel: <strong>{b.travelTime} min</strong>
              </span>
              <span className="meta-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                </svg>
                Floors: <strong>{b.floorsSpanned}</strong>
              </span>
              <span className="meta-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 4v16M2 8h18M2 12h18M20 4v16" />
                </svg>
                Rooms: <strong>{b.numberOfRooms}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingList;
