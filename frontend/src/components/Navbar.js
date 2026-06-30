import React from 'react';
import './Navbar.css';

const Navbar = () => (
  <nav className="navbar">
    <div className="nav-brand">
      <div className="brand-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', width: '40px', height: '40px', overflow: 'hidden', boxShadow: '0 0 15px rgba(99, 102, 241, 0.15)' }}>
        <img src="/logo.png" alt="HotelReserve Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div>
        <span className="brand-name">HotelReserve</span>
        <span className="brand-sub">Premium Room Allocation</span>
      </div>
    </div>
    <div className="nav-info">
      <span className="nav-badge">97 Intelligent Rooms · 10 Floors</span>
    </div>
  </nav>
);

export default Navbar;
