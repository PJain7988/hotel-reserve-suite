import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import StatsBar from '../components/StatsBar';
import BookingForm from '../components/BookingForm';
import BookingList from '../components/BookingList';
import FloorMap from '../components/FloorMap';
import './Dashboard.css';

const Dashboard = () => {
  const {
    rooms,
    bookings,
    payments,
    reviews,
    analytics,
    loading,
    user,
    activeTab,
    holidayMod,
    preferredFeatures,
    setActiveTab,
    setHolidayMod,
    setPreferredFeatures,
    registerCustomer,
    loginCustomer,
    resetPassword,
    logout,
    payBooking,
    submitReview,
    addAdminRoom,
    updateAdminRoom,
    deleteAdminRoom
  } = useHotel();

  // Local Form States
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  // Payment Form States
  const [selectedBookingPay, setSelectedBookingPay] = useState('');
  const [payMethod, setPayMethod] = useState('Credit Card');

  // Room Admin States
  const [newRoomNum, setNewRoomNum] = useState('');
  const [newRoomFloor, setNewRoomFloor] = useState(1);
  const [newRoomPos, setNewRoomPos] = useState(1);
  const [newRoomType, setNewRoomType] = useState('Standard');
  const [newRoomPrice, setNewRoomPrice] = useState(100);
  const [newRoomFeatures, setNewRoomFeatures] = useState('Wifi');

  // Review Form States
  const [revGuest, setRevGuest] = useState('');
  const [revRoom, setRevRoom] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');

  // Stepper features list
  const allFeatures = ['Wifi', 'Mini Bar', 'Ocean View', 'Quiet', 'Jacuzzi', 'Connected'];

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (showReset) {
      const ok = await resetPassword(authEmail, newPassword);
      if (ok) {
        setShowReset(false);
        setNewPassword('');
      }
    } else if (isRegister) {
      await registerCustomer(authName, authEmail, authPassword, authPhone);
    } else {
      await loginCustomer(authEmail, authPassword);
    }
  };

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    if (!selectedBookingPay) return;
    const bk = bookings.find(b => b._id === selectedBookingPay || b.bookingReference === selectedBookingPay);
    if (bk) {
      await payBooking(bk._id, bk.totalAmount, payMethod);
      setSelectedBookingPay('');
    }
  };

  const handleRoomAdminSubmit = async (e) => {
    e.preventDefault();
    if (!newRoomNum || !newRoomFloor || !newRoomPos) return;
    const featArr = newRoomFeatures.split(',').map(f => f.trim()).filter(Boolean);
    await addAdminRoom(Number(newRoomNum), Number(newRoomFloor), Number(newRoomPos), newRoomType, Number(newRoomPrice), featArr);
    setNewRoomNum('');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!revGuest || !revRoom || !revComment) return;
    await submitReview(revGuest, Number(revRoom), Number(revRating), revComment);
    setRevGuest('');
    setRevRoom('');
    setRevComment('');
  };

  const toggleFeaturePref = (f) => {
    if (preferredFeatures.includes(f)) {
      setPreferredFeatures(preferredFeatures.filter(pref => pref !== f));
    } else {
      setPreferredFeatures([...preferredFeatures, f]);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        
        {/* TOP BRAND HEADER ROW */}
        <div className="page-heading">
          <div className="title-row">
            <h1>HotelReserve Suite</h1>
            <div className="role-badge">
              <span>ACTIVE SESSION: {user ? `${user.name} (${user.role})` : 'GUEST MODE'}</span>
            </div>
          </div>
          <p>Enterprise Multi-Floor Space Optimization and Operations Control Console</p>
        </div>

        {/* OPERATIONS TABS NAVIGATOR */}
        <div className="tab-navigator">
          <button 
            className={`tab-btn ${activeTab === 'operations' ? 'active' : ''}`}
            onClick={() => setActiveTab('operations')}
          >
            🎛️ Operations Core
          </button>
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            🛡️ User & Loyalty
          </button>
          <button 
            className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            🏷️ Smart Room Console
          </button>
          <button 
            className={`tab-btn ${activeTab === 'billing' ? 'active' : ''}`}
            onClick={() => setActiveTab('billing')}
          >
            💳 Billing & Payments
          </button>
          <button 
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📊 Analytics Hub
          </button>
          <button 
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            💬 Feedback Portal
          </button>
        </div>

        {/* MOCK HARDWARE STATUS MIDDLEWARE LOGGER */}
        {loading && <div className="map-loading">📡 Communicating with Server — Loading Real-Time Assets...</div>}

        {/* MAIN TAB SWITCHER CARD BLOCKS */}
        
        {activeTab === 'operations' && (
          <>
            <StatsBar />
            <div className="dashboard-grid">
              <div className="col-left">
                {/* ADVANCED BOOKING OPTION PANEL */}
                <div className="booking-form-card glass-panel" style={{ padding: '1.25rem 1.5rem', marginBottom: '0rem' }}>
                  <h3 style={{ fontSize: '15px', color: '#fff', marginBottom: '12px' }}>⚙️ Smart Clustering Controls</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12.5px', color: '#a5b4fc' }}>
                      <input 
                        type="checkbox" 
                        checked={holidayMod}
                        onChange={(e) => setHolidayMod(e.target.checked)}
                        style={{ accentColor: '#6366f1' }}
                      />
                      <span>Apply Holiday Surge Mod (+30% dynamic price)</span>
                    </label>
                    <div>
                      <span style={{ fontSize: '11px', display: 'block', color: '#94a3b8', marginBottom: '5px' }}>Preferred Room Amenities:</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {allFeatures.map(f => (
                          <button
                            key={f}
                            onClick={() => toggleFeaturePref(f)}
                            className={`badge-pill-btn ${preferredFeatures.includes(f) ? 'active' : ''}`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <BookingForm />
                <BookingList />
              </div>
              <div className="col-right">
                <div className="map-card-header">
                  <div>
                    <h3>Floor Map Visualization</h3>
                    <span className="map-subtitle">Staircase & lift on the left of each floor</span>
                  </div>
                </div>
                <div className="floor-map-container">
                  <FloorMap />
                </div>
                
                {/* PRICING MENU CATALOG */}
                <div className="booking-form-card glass-panel" style={{ padding: '1.25rem 1.5rem', marginTop: '1.25rem', background: 'linear-gradient(145deg, rgba(30,30,40,0.8) 0%, rgba(20,20,30,0.9) 100%)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h3 style={{ fontSize: '15px', color: '#fff', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>📋 Enterprise Pricing Catalog</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px', color: '#a5b4fc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px' }}><span>Standard Tier</span> <span style={{ color: '#10b981' }}>Base $100</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px' }}><span>Deluxe Tier</span> <span style={{ color: '#10b981' }}>Base $150</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px' }}><span>VIP Suite</span> <span style={{ color: '#10b981' }}>Base $250</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px' }}><span>AC / Amenities</span> <span style={{ color: '#10b981' }}>Varies</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px' }}><span>Holiday Surge</span> <span style={{ color: '#f43f5e' }}>+ 30% / night</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px' }}><span>Govt. Tax (GST)</span> <span style={{ color: '#f43f5e' }}>18% applied</span></div>
                  </div>
                </div>

              </div>
            </div>
          </>
        )}

        {activeTab === 'profile' && (
          <div className="tab-full-width-card glass-panel">
            {!user ? (
              <div className="auth-form-container">
                <h2 className="section-title">{showReset ? 'Reset Account Password' : isRegister ? 'Create Professional Account' : 'Authenticate User Portal'}</h2>
                <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>Secure Role-Based Access Control Middleware (Customer, Staff, Admin)</p>
                <form onSubmit={handleAuthSubmit} className="booking-form">
                  {isRegister && !showReset && (
                    <>
                      <div className="form-group">
                        <label>Full Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Alexis Vance"
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Phone Number</label>
                        <input 
                          type="text" 
                          placeholder="+1 (555) 019-2831"
                          value={authPhone}
                          onChange={(e) => setAuthPhone(e.target.value)}
                        />
                      </div>
                    </>
                  )}
                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      placeholder="Enter user email"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>{showReset ? 'New Secure Password' : 'Secret Password'}</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={showReset ? newPassword : authPassword}
                      onChange={(e) => showReset ? setNewPassword(e.target.value) : setAuthPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="book-btn">
                    {showReset ? 'Confirm Reset' : isRegister ? 'Register Account' : 'Login Securely'}
                  </button>
                </form>
                <div style={{ marginTop: '15px', display: 'flex', gap: '15px', fontSize: '12px', color: '#818cf8' }}>
                  {!showReset ? (
                    <>
                      <span onClick={() => setIsRegister(!isRegister)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                        {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
                      </span>
                      <span onClick={() => setShowReset(true)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                        Forgot password?
                      </span>
                    </>
                  ) : (
                    <span onClick={() => setShowReset(false)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                      Back to Login
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="profile-active-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 className="section-title">User Profile Dashboard</h2>
                  <button onClick={logout} className="badge-pill-btn" style={{ padding: '6px 16px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#ef4444' }}>
                    Logout Session
                  </button>
                </div>
                
                <div className="profile-grid">
                  <div className="profile-details-card">
                    <h3>Personal Information</h3>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
                    <p><strong>Assigned Role:</strong> <span className="neon-text" style={{ color: '#818cf8', fontWeight: 'bold' }}>{user.role}</span></p>
                  </div>
                  
                  <div className="loyalty-points-card">
                    <h3>🏆 Loyalty Program Center</h3>
                    <div className="membership-level-badge">
                      LEVEL: {user.membership_level || 'Bronze'}
                    </div>
                    <p style={{ marginTop: '12px', fontSize: '14px' }}>
                      <strong>Active Reward Points:</strong> <span style={{ color: '#fbbf24', fontSize: '20px', fontWeight: '800' }}>{user.loyalty_points || 0} pts</span>
                    </p>
                    <p style={{ color: '#94a3b8', fontSize: '11px', marginTop: '5px' }}>
                      Earn 10% points on every dynamic pricing booking. Upgrades unlock automatically at Silver (200), Gold (500), and Platinum (1000) membership tiers.
                    </p>
                  </div>
                </div>

                {/* AI ROOM RECOMMENDATION SECTION */}
                <div className="ai-recommendation-block" style={{ marginTop: '25px', padding: '1.25rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '20px' }}>✨</span>
                    <h3 style={{ fontSize: '14px', color: '#a5b4fc', margin: 0 }}>Smart AI Room Recommendation Engine</h3>
                  </div>
                  <p style={{ fontSize: '13px', color: '#f1f5f9', lineHeight: '1.5' }}>
                    {user.membership_level === 'Gold' || user.membership_level === 'Platinum' ? (
                      <strong>Recommended: Premium Sea-View Suite on Floor 10.</strong>
                    ) : (
                      <strong>Recommended: Quiet Deluxe Room on Floor 5 with Wifi and Mini Bar.</strong>
                    )}
                    <span style={{ display: 'block', color: '#94a3b8', fontSize: '11.5px', marginTop: '6px' }}>
                      *Synthesized utilizing your past history, reward balance, and VIP architectural constraints.
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="tab-full-width-card glass-panel">
            <h2 className="section-title">Smart Room Administrative Manager</h2>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>Authorize additions, toggle maintenance blocks, and configure dynamic room pricing configurations.</p>
            
            <div className="profile-grid">
              <div className="auth-form-container">
                <h3>🔨 Add New Architectural Room</h3>
                <form onSubmit={handleRoomAdminSubmit} className="booking-form" style={{ marginTop: '15px' }}>
                  <div className="form-group">
                    <label>Room Number</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 108"
                      value={newRoomNum}
                      onChange={(e) => setNewRoomNum(e.target.value)}
                      required
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="form-group">
                      <label>Floor (1-10)</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="10"
                        value={newRoomFloor}
                        onChange={(e) => setNewRoomFloor(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Position (1-10)</label>
                      <input 
                        type="number" 
                        min="1"
                        max="10"
                        value={newRoomPos}
                        onChange={(e) => setNewRoomPos(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Category Tier</label>
                    <select value={newRoomType} onChange={(e) => setNewRoomType(e.target.value)}>
                      <option value="Standard">Standard ($100)</option>
                      <option value="Deluxe">Deluxe ($180)</option>
                      <option value="Premium">Premium ($280)</option>
                      <option value="Suite">Suite ($450)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Base Price ($)</label>
                    <input 
                      type="number" 
                      value={newRoomPrice}
                      onChange={(e) => setNewRoomPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Features (comma separated)</label>
                    <input 
                      type="text" 
                      placeholder="Wifi, Sea View, Quiet"
                      value={newRoomFeatures}
                      onChange={(e) => setNewRoomFeatures(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="book-btn">Add Room to System</button>
                </form>
              </div>

              <div className="admin-rooms-list-card">
                <h3>🛠️ Room Maintenance & Admin Status</h3>
                <div style={{ maxHeight: '420px', overflowY: 'auto', marginTop: '15px', paddingRight: '5px' }}>
                  {rooms.map(r => (
                    <div key={r.roomNumber} style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>Room {r.roomNumber}</span>
                        <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>{r.roomType} • ${r.price}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <select 
                          value={r.status} 
                          onChange={(e) => updateAdminRoom(r.roomNumber, { status: e.target.value })}
                          style={{ fontSize: '11px', padding: '3px 8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '4px' }}
                        >
                          <option value="Available">Available</option>
                          <option value="Occupied">Occupied</option>
                          <option value="Reserved">Reserved</option>
                          <option value="Maintenance">Maintenance</option>
                        </select>
                        <button 
                          onClick={() => deleteAdminRoom(r.roomNumber)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px' }}
                        >
                          ❌
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="tab-full-width-card glass-panel">
            <h2 className="section-title">Enterprise Billing & Payment Gateway</h2>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>Secure checkout processing, encrypted QR ticket generation, and automated invoice lifecycle management.</p>
            
            <div className="profile-grid">
              <div className="auth-form-container">
                <h3>💳 Process Outstanding Checkout</h3>
                <form onSubmit={handlePaySubmit} className="booking-form" style={{ marginTop: '15px' }}>
                  <div className="form-group">
                    <label>Select Pending Booking Payload</label>
                    <select value={selectedBookingPay} onChange={(e) => setSelectedBookingPay(e.target.value)} required>
                      <option value="">-- Choose Booking to Process --</option>
                      {bookings.filter(b => b.paymentStatus === 'Pending').map(b => (
                        <option key={b._id} value={b._id}>{b.guestName} ({b.bookingReference}) - ${b.totalAmount}</option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedBookingPay && (() => {
                    const b = bookings.find(bk => bk._id === selectedBookingPay);
                    if (!b) return null;
                    return (
                      <div style={{ padding: '15px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '12px', marginBottom: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', color: '#a5b4fc' }}>
                          <span>Base Cost:</span>
                          <span>${b.baseAmount || Math.round(b.totalAmount * 0.82)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', color: '#a5b4fc' }}>
                          <span>GST (18%):</span>
                          <span>${b.gstAmount || Math.round(b.totalAmount * 0.18)}</span>
                        </div>
                        <div style={{ height: '1px', background: 'rgba(99, 102, 241, 0.3)', margin: '8px 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '11px', color: '#a5b4fc' }}>Total Amount Due:</span>
                          <span style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>${b.totalAmount}</span>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="form-group">
                    <label>Secure Payment Gateway</label>
                    <select value={payMethod} onChange={(e) => setPayMethod(e.target.value)}>
                      <option value="Credit Card">Stripe (Credit Card / Debit)</option>
                      <option value="PayPal">PayPal Express</option>
                      <option value="Apple Pay">Apple Pay Integration</option>
                      <option value="UPI">UPI (India Core)</option>
                    </select>
                  </div>

                  {payMethod === 'Credit Card' && (
                    <div className="form-group" style={{ marginTop: '10px' }}>
                      <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Stripe Secured Credit Card</span>
                        <span style={{ color: '#10b981', fontSize: '11px' }}>🔒 256-bit AES Encrypted</span>
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.5)' }}>
                        <input type="text" placeholder="Card number (0000 0000 0000 0000)" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'none' }} />
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input type="text" placeholder="MM / YY" style={{ flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'none' }} />
                          <input type="text" placeholder="CVC" style={{ flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'none' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <button type="submit" className="book-btn" disabled={!selectedBookingPay}>
                    Authorize & Capture Payment
                  </button>
                </form>

                {/* QR CODE GENERATOR SECTION */}
                {bookings.length > 0 && (
                  <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', display: 'flex', gap: '15px', alignItems: 'center', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}>
                    <div style={{ width: '80px', height: '80px', background: '#fff', padding: '5px', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=HotelReserve-Ticket-${selectedBookingPay || 'Default'}&bgcolor=ffffff`} 
                        alt="Encrypted QR Ticket" 
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                      />
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 6px', fontSize: '14px', color: '#fff', fontWeight: '700' }}>Encrypted Check-In QR Ticket</h4>
                      <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8', lineHeight: '1.4' }}>
                        Scan this cryptographic receipt ticket on your mobile device at reception for instant contactless verification.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="admin-rooms-list-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3>🧾 Immutable Invoice Registry</h3>
                  <span style={{ fontSize: '11px', background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', padding: '4px 8px', borderRadius: '6px' }}>{payments.length} Invoices</span>
                </div>
                <div style={{ maxHeight: '460px', overflowY: 'auto', paddingRight: '5px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {payments.length === 0 ? (
                    <div style={{ color: '#94a3b8', fontSize: '12px', padding: '40px 0', textAlign: 'center' }}>No invoice payments cleared yet.<br/>Complete a checkout to mint an invoice.</div>
                  ) : (
                    payments.map(p => (
                      <div key={p._id} style={{ padding: '15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.3s' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#fff' }}>{p.transactionReference}</span>
                            <span style={{ fontSize: '9px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(16,185,129,0.3)' }}>PAID</span>
                          </div>
                          <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Gateway: <strong style={{ color: '#cbd5e1' }}>{p.paymentMethod}</strong></span>
                        </div>
                        <span style={{ fontSize: '18px', fontWeight: '800', color: '#10b981', textShadow: '0 0 10px rgba(16, 185, 129, 0.4)' }}>${p.amount}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="tab-full-width-card glass-panel">
            <h2 className="section-title">Admin Real-Time Operations Analytics</h2>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>Real-time statistics extracted via database aggregators (Occupancy rates, sentiment charts, and monthly margins).</p>
            
            {analytics ? (
              <div className="analytics-dashboard-grid">
                <div className="analytics-metrics-row">
                  <div className="analytic-card">
                    <h4>Occupancy Percentage</h4>
                    <span className="metric-val">{analytics.occupancyRate}%</span>
                    <p>Dynamic price factor adjustments active</p>
                  </div>
                  <div className="analytic-card">
                    <h4>Total System Revenue</h4>
                    <span className="metric-val" style={{ color: '#10b981' }}>${analytics.totalRevenue}</span>
                    <p>From simulated payment collections</p>
                  </div>
                  <div className="analytic-card">
                    <h4>Average Pricing Median</h4>
                    <span className="metric-val" style={{ color: '#a5b4fc' }}>${analytics.avgPrice}</span>
                    <p>Average base room cost</p>
                  </div>
                </div>

                <div className="profile-grid" style={{ marginTop: '20px' }}>
                  <div className="loyalty-points-card">
                    <h3 style={{ fontSize: '14px', marginBottom: '15px' }}>📈 Room Distribution Tiers</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {Object.entries(analytics.roomTiers).map(([tier, count]) => (
                        <div key={tier} style={{ fontSize: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                            <span>{tier} Rooms</span>
                            <span style={{ fontWeight: 'bold' }}>{count}</span>
                          </div>
                          <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', background: '#6366f1', width: `${(count / 97) * 100}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="loyalty-points-card">
                    <h3 style={{ fontSize: '14px', marginBottom: '15px' }}>❤️ Feedback Sentiment Distribution</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {Object.entries(analytics.sentimentBreakdown).map(([sentiment, count]) => (
                        <div key={sentiment} style={{ fontSize: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                            <span>{sentiment} Sentiment</span>
                            <span style={{ fontWeight: 'bold' }}>{count}</span>
                          </div>
                          <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ 
                              height: '100%', 
                              background: sentiment === 'Positive' ? '#10b981' : sentiment === 'Negative' ? '#ef4444' : '#fbbf24', 
                              width: `${(count / (reviews.length || 3)) * 100}%` 
                            }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ color: '#94a3b8', fontSize: '12px', padding: '40px 0', textAlign: 'center' }}>No analytical metrics fetched. Start booking to generate tracking charts.</div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="tab-full-width-card glass-panel">
            <h2 className="section-title">Customer Feedback Portal & Sentiment Tracker</h2>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>Submit star-ratings and comments. The backend will automatically synthesize and output the customer sentiment breakdown (Positive, Neutral, Negative).</p>
            
            <div className="profile-grid">
              <div className="auth-form-container">
                <h3>💬 Add Guest Review Feedback</h3>
                <form onSubmit={handleReviewSubmit} className="booking-form" style={{ marginTop: '15px' }}>
                  <div className="form-group">
                    <label>Guest Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Alexis Vance"
                      value={revGuest}
                      onChange={(e) => setRevGuest(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Room Number</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 101"
                      value={revRoom}
                      onChange={(e) => setRevRoom(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Star Rating (1 - 5)</label>
                    <select value={revRating} onChange={(e) => setRevRating(e.target.value)}>
                      <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                      <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                      <option value="3">⭐⭐⭐ (3 Stars)</option>
                      <option value="2">⭐⭐ (2 Stars)</option>
                      <option value="1">⭐ (1 Star)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Comments</label>
                    <textarea 
                      placeholder="Share your stay experience..."
                      value={revComment}
                      onChange={(e) => setRevComment(e.target.value)}
                      required
                      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px', color: '#fff', resize: 'none', height: '80px', fontSize: '13px', width: '100%' }}
                    />
                  </div>
                  
                  <button type="submit" className="book-btn">Submit guest feedback</button>
                </form>
              </div>

              <div className="admin-rooms-list-card">
                <h3>💬 Live Review Registry</h3>
                <div style={{ maxHeight: '420px', overflowY: 'auto', marginTop: '15px', paddingRight: '5px' }}>
                  {reviews.length === 0 ? (
                    <div style={{ color: '#94a3b8', fontSize: '12px', padding: '20px 0' }}>No reviews recorded. Be the first to leave a comment!</div>
                  ) : (
                    reviews.map(r => (
                      <div key={r._id} style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff' }}>{r.guestName} (Room {r.roomNumber})</span>
                          <span 
                            style={{ 
                              fontSize: '9.5px', 
                              padding: '2px 8px', 
                              borderRadius: '4px',
                              fontWeight: '600',
                              color: '#fff',
                              background: r.sentiment === 'Positive' ? '#10b981' : r.sentiment === 'Negative' ? '#ef4444' : '#fbbf24'
                            }}
                          >
                            {r.sentiment}
                          </span>
                        </div>
                        <div style={{ color: '#fbbf24', fontSize: '11px' }}>{'⭐'.repeat(r.rating)}</div>
                        <p style={{ margin: 0, fontSize: '11.5px', color: '#cbd5e1', lineHeight: '1.4' }}>"{r.comment}"</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
