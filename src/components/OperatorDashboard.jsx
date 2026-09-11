import React, { useState } from 'react';
import { ShieldCheck, Play, Gauge, Fuel, CheckCircle, AlertTriangle, RefreshCw, QrCode, ArrowRight, UserCheck } from 'lucide-react';

export default function OperatorDashboard({ stations, onUpdateStation, bookings, onUpdateBookingStatus }) {
  const [selectedStationId, setSelectedStationId] = useState(stations[0]?.id || 'st-101');
  const [scanTokenInput, setScanTokenInput] = useState('');
  const [scanFeedback, setScanFeedback] = useState(null);

  const activeStation = stations.find(s => s.id === selectedStationId) || stations[0];

  // Advance queue
  const handleCallNext = () => {
    if (activeStation.queueCount > 0) {
      const seq = parseInt(activeStation.servingToken.split('-')[2] || '100') + 1;
      const nextToken = `${activeStation.servingToken.split('-')[0]}-${activeStation.servingToken.split('-')[1]}-${seq}`;
      
      const updated = {
        ...activeStation,
        queueCount: Math.max(0, activeStation.queueCount - 1),
        servingToken: nextToken,
        avgWaitMins: Math.max(2, Math.round((activeStation.queueCount - 1) * 2.2))
      };
      onUpdateStation(updated);
    }
  };

  // Toggle Nozzle Status
  const handleToggleNozzle = () => {
    const newActive = activeStation.activeNozzles >= activeStation.totalNozzles 
      ? activeStation.totalNozzles - 1 
      : activeStation.activeNozzles + 1;
      
    onUpdateStation({ ...activeStation, activeNozzles: Math.max(1, newActive) });
  };

  // Gas Pressure Slider
  const handlePressureChange = (e) => {
    const newPressure = parseInt(e.target.value);
    onUpdateStation({ ...activeStation, gasPressure: newPressure });
  };

  // QR Scan Process
  const handleScanSubmit = (e) => {
    e.preventDefault();
    const tokenClean = scanTokenInput.trim().toUpperCase();
    const foundBooking = bookings.find(b => b.tokenNo.toUpperCase() === tokenClean || b.id.toUpperCase() === tokenClean);

    if (foundBooking) {
      onUpdateBookingStatus(foundBooking.id, 'Completed');
      setScanFeedback({ success: true, message: `Token ${foundBooking.tokenNo} Verified! Refill Authorized for ${foundBooking.vehicleNo}.` });
    } else {
      setScanFeedback({ success: false, message: `Token "${scanTokenInput}" not found in system database.` });
    }
    setScanTokenInput('');
  };

  return (
    <div>
      {/* Admin Banner */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary)', fontWeight: '700', fontSize: '0.85rem' }}>
          <ShieldCheck size={18} /> Station Operator Control Portal
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', marginTop: '0.2rem', color: '#fff' }}>
          Pump Manager Dashboard
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Manage dispenser nozzle assignment, advance serving queue, adjust bar pressure, and scan driver QR passes.
        </p>
      </div>

      {/* Station Switcher Toolbar */}
      <div className="glass-card" style={{ marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Fuel size={20} color="var(--primary)" />
          <span style={{ fontWeight: '700', color: '#fff' }}>Select CNG Hub:</span>
          <select 
            value={selectedStationId} 
            onChange={(e) => setSelectedStationId(e.target.value)}
            className="form-select"
            style={{ width: 'auto', minWidth: '240px' }}
          >
            {stations.map(st => (
              <option key={st.id} value={st.id}>{st.name} ({st.city})</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span className="badge badge-success">
            {activeStation.status} • {activeStation.operatingHours}
          </span>
        </div>
      </div>

      {/* Main Grid Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        
        {/* Panel 1: Queue Flow Controller */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserCheck size={20} color="var(--primary)" /> Live Queue Sequencer
          </h3>

          <div style={{ background: '#1E293B', padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'center', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>NOW SERVING TOKEN</div>
            <div style={{ fontSize: '2.2rem', fontWeight: '900', color: 'var(--primary)', letterSpacing: '0.05em', margin: '0.2rem 0' }}>
              {activeStation.servingToken}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Vehicles Waiting in Line: <strong style={{ color: '#FBBF24' }}>{activeStation.queueCount}</strong>
            </div>
          </div>

          <button 
            className="btn btn-primary"
            onClick={handleCallNext}
            disabled={activeStation.queueCount === 0}
            style={{ width: '100%', opacity: activeStation.queueCount === 0 ? 0.6 : 1 }}
          >
            <Play size={18} /> Call Next Driver Token
          </button>
        </div>

        {/* Panel 2: Telemetry & Pressure Adjuster */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Gauge size={20} color="var(--accent-cyan)" /> Pressure & Dispensers
          </h3>

          {/* Gas Pressure Range */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Gas Compressor Pressure:</span>
              <strong style={{ color: activeStation.gasPressure >= 210 ? 'var(--primary)' : '#F59E0B' }}>
                {activeStation.gasPressure} Bar
              </strong>
            </div>
            <input 
              type="range" 
              min="180" 
              max="230" 
              value={activeStation.gasPressure}
              onChange={handlePressureChange}
              style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
          </div>

          {/* Nozzles Active Control */}
          <div style={{ background: '#1E293B', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#fff' }}>Nozzle Bay Dispensers</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {activeStation.activeNozzles} of {activeStation.totalNozzles} Nozzles Operational
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={handleToggleNozzle}>
              Toggle Nozzle
            </button>
          </div>
        </div>

        {/* Panel 3: QR Code Driver Scanner Simulator */}
        <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <QrCode size={20} color="var(--primary)" /> Driver QR Code Terminal Scanner
          </h3>

          <form onSubmit={handleScanSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              className="form-input"
              placeholder="Scan or enter Token ID (e.g. GF-BDW-108)..."
              value={scanTokenInput}
              onChange={(e) => setScanTokenInput(e.target.value)}
              style={{ flex: 1, minWidth: '260px' }}
            />
            <button type="submit" className="btn btn-primary">
              Verify & Authorize Refill <ArrowRight size={18} />
            </button>
          </form>

          {scanFeedback && (
            <div style={{
              marginTop: '1rem',
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              background: scanFeedback.success ? 'rgba(0, 245, 160, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: scanFeedback.success ? '1px solid var(--primary)' : '1px solid #EF4444',
              color: scanFeedback.success ? 'var(--primary)' : '#FCA5A5'
            }}>
              {scanFeedback.message}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
