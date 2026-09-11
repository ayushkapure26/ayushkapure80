import React from 'react';
import { Fuel, MapPin, Ticket, ShieldCheck, Calculator, Zap } from 'lucide-react';
import { CITIES } from '../data/mockStations';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  selectedCity, 
  setSelectedCity, 
  activeBookingsCount 
}) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <a href="#home" onClick={() => setCurrentTab('stations')} className="logo">
          <div className="logo-icon">
            <Zap size={24} />
          </div>
          <div>
            GreenFlow <span className="gradient-text">CNG</span>
          </div>
        </a>

        {/* City Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin size={16} color="var(--primary)" />
          <select 
            value={selectedCity} 
            onChange={(e) => setSelectedCity(e.target.value)}
            className="city-select"
            aria-label="Select City"
          >
            {CITIES.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Nav Links */}
        <nav>
          <ul className="nav-links">
            <li>
              <button 
                className={`nav-link ${currentTab === 'stations' ? 'active' : ''}`}
                onClick={() => setCurrentTab('stations')}
              >
                <Fuel size={18} /> Station Locator
              </button>
            </li>

            <li>
              <button 
                className={`nav-link ${currentTab === 'liveQueue' ? 'active' : ''}`}
                onClick={() => setCurrentTab('liveQueue')}
                style={{ position: 'relative' }}
              >
                <Ticket size={18} /> My Tokens
                {activeBookingsCount > 0 && (
                  <span style={{
                    background: 'var(--primary)',
                    color: '#000',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {activeBookingsCount}
                  </span>
                )}
              </button>
            </li>

            <li>
              <button 
                className={`nav-link ${currentTab === 'calculator' ? 'active' : ''}`}
                onClick={() => setCurrentTab('calculator')}
              >
                <Calculator size={18} /> Fuel Savings
              </button>
            </li>

            <li>
              <button 
                className={`btn btn-sm btn-outline-primary ${currentTab === 'operator' ? 'active' : ''}`}
                onClick={() => setCurrentTab('operator')}
                style={{ gap: '0.4rem', border: '1px solid rgba(0, 245, 160, 0.4)' }}
              >
                <ShieldCheck size={16} /> Operator Admin
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
