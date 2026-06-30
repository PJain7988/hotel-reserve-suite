import React from 'react';
import { useHotel } from '../context/HotelContext';
import './StatsBar.css';

const StatsBar = () => {
  const { stats } = useHotel();
  const occupancyPct = Math.round((stats.occupied / 97) * 100) || 0;

  return (
    <div className="stats-bar">
      <div className="stat-card stat-available">
        <div className="stat-icon" style={{ boxShadow: '0 0 15px rgba(16, 185, 129, 0.15)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <div className="stat-info">
          <span className="stat-value" style={{ color: '#10b981' }}>{stats.available}</span>
          <span className="stat-label">Available</span>
        </div>
      </div>

      <div className="stat-card stat-occupied">
        <div className="stat-icon" style={{ boxShadow: '0 0 15px rgba(239, 68, 68, 0.15)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <div className="stat-info">
          <span className="stat-value" style={{ color: '#ef4444' }}>{stats.occupied}</span>
          <span className="stat-label">Occupied</span>
        </div>
      </div>

      <div className="stat-card stat-total">
        <div className="stat-icon" style={{ boxShadow: '0 0 15px rgba(99, 102, 241, 0.15)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
            <path d="M9 22V12h6v10" />
            <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M12 6h.01" />
          </svg>
        </div>
        <div className="stat-info">
          <span className="stat-value" style={{ color: '#818cf8' }}>97</span>
          <span className="stat-label">Total Rooms</span>
        </div>
      </div>

      <div className="stat-card stat-bookings">
        <div className="stat-icon" style={{ boxShadow: '0 0 15px rgba(245, 158, 11, 0.15)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <div className="stat-info">
          <span className="stat-value" style={{ color: '#fbbf24' }}>{stats.totalBookings}</span>
          <span className="stat-label">Active Bookings</span>
        </div>
      </div>

      <div className="stat-card stat-pct">
        <div className="stat-occupancy-label">
          <span>Live Occupancy Rate</span>
          <span className="pct-value">{occupancyPct}%</span>
        </div>
        <div className="occupancy-bar">
          <div
            className="occupancy-fill"
            style={{ width: `${occupancyPct}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};


export default StatsBar;
