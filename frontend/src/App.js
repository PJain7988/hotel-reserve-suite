import React from 'react';
import { Toaster } from 'react-hot-toast';
import { HotelProvider } from './context/HotelContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <HotelProvider>
      <div className="App">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontSize: '14px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            },
            success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } },
            error: { iconTheme: { primary: '#dc2626', secondary: '#fff' } }
          }}
        />
        <Navbar />
        <Dashboard />
      </div>
    </HotelProvider>
  );
}

export default App;
