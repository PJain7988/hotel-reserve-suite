import React from 'react';
import './Navbar.css';

const Navbar = () => (
  <nav className="navbar" style={{ background: 'linear-gradient(90deg, rgba(15,23,42,0.85) 0%, rgba(30,30,40,0.85) 100%)', borderBottom: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(20px)' }}>
    <div className="nav-brand">
      <div className="brand-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', width: '46px', height: '46px', overflow: 'hidden', boxShadow: '0 0 25px rgba(99, 102, 241, 0.5)' }}>
        <img src="/logo.png" alt="HotelReserve Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div>
        <span className="brand-name" style={{ fontSize: '22px', fontWeight: '900', background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 0 20px rgba(165,180,252,0.4)', letterSpacing: '0.5px' }}>HotelReserve Suite</span>
        <span className="brand-sub" style={{ color: '#818cf8', letterSpacing: '0.2em', fontSize: '10.5px', textShadow: '0 0 10px rgba(129,140,248,0.5)' }}>ENTERPRISE EDITION</span>
      </div>
    </div>
    <div className="nav-info">
      <span className="nav-badge" style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))', border: '1px solid rgba(139,92,246,0.4)', color: '#fff', padding: '8px 18px', boxShadow: '0 0 20px rgba(139,92,246,0.3)', borderRadius: '99px', fontSize: '12px' }}>⚡ 97 Intelligent Rooms · 10 Floors</span>
    </div>
  </nav>
);

export default Navbar;
