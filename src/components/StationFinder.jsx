import React, { useState } from 'react';
import { Search, Filter, Map, Grid, Gauge, Truck, Car, Bus, Zap, Sparkles, Navigation, CheckCircle2 } from 'lucide-react';
import StationCard from './StationCard';
import { VEHICLE_TYPES } from '../data/mockStations';

export default function StationFinder({ 
  stations, 
  selectedCity, 
  onBookStation, 
  favorites, 
  onToggleFavorite 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('All');
  const [highPressureOnly, setHighPressureOnly] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'
  const [selectedMapStation, setSelectedMapStation] = useState(null);

  // Filter stations for selected city & search query & vehicle type
  const filteredStations = stations.filter(station => {
    const matchesCity = station.city === selectedCity;
    const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          station.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          station.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVehicle = selectedVehicle === 'All' || station.supportedVehicles.includes(selectedVehicle);
    const matchesPressure = !highPressureOnly || station.gasPressure >= 210;

    return matchesCity && matchesSearch && matchesVehicle && matchesPressure;
  });

  return (
    <div>
      {/* Hero Header Section */}
      <section className="hero-banner">
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(0, 245, 160, 0.1)',
          border: '1px solid var(--primary-glow)',
          padding: '0.4rem 1rem',
          borderRadius: '9999px',
          color: 'var(--primary)',
          fontSize: '0.85rem',
          fontWeight: '700',
          marginBottom: '1rem'
        }}>
          <Sparkles size={16} /> Zero Queue CNG Station Booking
        </div>

        <h1 className="hero-title">
          Skip The CNG Line. <br />
          Refill at Peak Pressure in <span className="gradient-text">{selectedCity}</span>.
        </h1>

        <p className="hero-subtitle">
          Book digital tokens, view live station bar pressure, track real-time queue position, and save over 45 minutes on every CNG refill.
        </p>

        {/* Hero Stats */}
        <div className="hero-stats">
          <div className="stat-box">
            <div className="stat-number">
              {stations.filter(s => s.city === selectedCity).length} Active
            </div>
            <div className="stat-label">CNG Hubs in {selectedCity}</div>
          </div>

          <div className="stat-box">
            <div className="stat-number" style={{ color: 'var(--accent-cyan)' }}>
              215 Bar
            </div>
            <div className="stat-label">Average Fleet Gas Pressure</div>
          </div>

          <div className="stat-box">
            <div className="stat-number" style={{ color: '#FBBF24' }}>
              8.5 Mins
            </div>
            <div className="stat-label">Avg Refill Wait Time Saved</div>
          </div>
        </div>
      </section>

      {/* Control Toolbar & Filters */}
      <div className="glass-card" style={{ marginBottom: '2rem', marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Row 1: Search Input & View Mode Toggles */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
              <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text"
                className="form-input"
                placeholder={`Search station by area, road, or name in ${selectedCity}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.8rem' }}
              />
            </div>

            {/* High Pressure Filter Switch */}
            <button
              onClick={() => setHighPressureOnly(!highPressureOnly)}
              className={`btn btn-sm ${highPressureOnly ? 'btn-primary' : 'btn-secondary'}`}
              style={{ gap: '0.4rem' }}
            >
              <Gauge size={16} /> High Bar Only (&gt;200 Bar)
            </button>

            {/* View Mode Toggle */}
            <div style={{ display: 'flex', background: '#1E293B', padding: '4px', borderRadius: 'var(--radius-md)' }}>
              <button 
                className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setViewMode('grid')}
                style={{ borderRadius: 'var(--radius-sm)', padding: '0.4rem 0.8rem' }}
              >
                <Grid size={16} /> Cards
              </button>
              <button 
                className={`btn btn-sm ${viewMode === 'map' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setViewMode('map')}
                style={{ borderRadius: 'var(--radius-sm)', padding: '0.4rem 0.8rem' }}
              >
                <Map size={16} /> Visual Map
              </button>
            </div>
          </div>

          {/* Row 2: Vehicle Filter Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', whiteSpace: 'nowrap' }}>
              Vehicle Filter:
            </span>
            <button 
              className={`badge ${selectedVehicle === 'All' ? 'badge-primary' : 'badge-cyan'}`}
              onClick={() => setSelectedVehicle('All')}
              style={{ cursor: 'pointer', border: selectedVehicle === 'All' ? '1px solid var(--primary)' : '1px solid transparent' }}
            >
              All Vehicles
            </button>
            {VEHICLE_TYPES.map(v => (
              <button
                key={v.id}
                className={`badge ${selectedVehicle === v.id ? 'badge-primary' : 'badge-cyan'}`}
                onClick={() => setSelectedVehicle(v.id)}
                style={{ cursor: 'pointer', background: selectedVehicle === v.id ? 'rgba(0, 245, 160, 0.2)' : 'rgba(255, 255, 255, 0.05)', color: selectedVehicle === v.id ? 'var(--primary)' : 'var(--text-muted)' }}
              >
                {v.name}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Main Display: Grid or Interactive Visual Map */}
      {viewMode === 'grid' ? (
        filteredStations.length > 0 ? (
          <div className="station-grid">
            {filteredStations.map(station => (
              <StationCard 
                key={station.id}
                station={station}
                onBook={onBookStation}
                isFavorite={favorites.includes(station.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Gauge size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No CNG stations matched your filters</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search query or high pressure filter for {selectedCity}.</p>
          </div>
        )
      ) : (
        /* Visual Interactive Map View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="map-canvas">
            {/* Map Background Legend */}
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(15, 23, 42, 0.9)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', fontSize: '0.8rem' }}>
              <div style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '0.2rem' }}>📍 {selectedCity} Live Station Map</div>
              <div style={{ color: 'var(--text-muted)' }}>Click pin to inspect pressure & book slot</div>
            </div>

            {/* Station Pins */}
            {filteredStations.map(st => (
              <div 
                key={st.id} 
                className="map-pin"
                style={{ left: `${st.coordinates.x}%`, top: `${st.coordinates.y}%` }}
                onClick={() => setSelectedMapStation(st)}
              >
                <div className="pin-bubble">
                  <span className="pulse-dot" style={{ backgroundColor: st.gasPressure >= 210 ? '#00F5A0' : '#F59E0B' }}></span>
                  {st.code} ({st.queueCount} in queue)
                </div>
              </div>
            ))}
          </div>

          {/* Selected Station Map Details Card Popup */}
          {selectedMapStation && (
            <div className="glass-card" style={{ border: '1px solid var(--primary)', animation: 'fadeIn 0.2s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span className="badge badge-success">{selectedMapStation.status} ({selectedMapStation.operatingHours})</span>
                  <h3 style={{ fontSize: '1.2rem', marginTop: '0.4rem' }}>{selectedMapStation.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{selectedMapStation.address}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)' }}>
                    {selectedMapStation.gasPressure} bar
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Gas Pressure</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button className="btn btn-primary" onClick={() => onBookStation(selectedMapStation)} style={{ flex: 1 }}>
                  Book Express Token Pass Now
                </button>
                <button className="btn btn-secondary" onClick={() => setSelectedMapStation(null)}>
                  Close Map Details
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
