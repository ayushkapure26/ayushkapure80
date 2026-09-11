import React from 'react';
import { Fuel, Clock, Gauge, Heart, Navigation, ChevronRight, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function StationCard({ station, onBook, isFavorite, onToggleFavorite }) {
  // Pressure status color code
  const isHighPressure = station.gasPressure >= 210;
  const isModeratePressure = station.gasPressure >= 195 && station.gasPressure < 210;
  
  const pressureColor = isHighPressure ? '#00F5A0' : isModeratePressure ? '#F59E0B' : '#EF4444';

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div>
          <span className={`badge ${station.status === 'Open' ? 'badge-success' : 'badge-warning'}`}>
            <span className="pulse-dot" style={{ backgroundColor: station.status === 'Open' ? '#10B981' : '#F59E0B' }}></span>
            {station.status} ({station.operatingHours})
          </span>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginTop: '0.5rem', color: '#fff' }}>
            {station.name}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
            <Navigation size={14} color="var(--accent-cyan)" /> {station.area}
          </p>
        </div>

        <button 
          onClick={() => onToggleFavorite(station.id)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: isFavorite ? '#EF4444' : 'var(--text-dim)', padding: '0.2rem' }}
          title={isFavorite ? 'Remove from favorites' : 'Save as favorite'}
        >
          <Heart size={22} fill={isFavorite ? '#EF4444' : 'none'} />
        </button>
      </div>

      {/* Address */}
      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem', flex: 1 }}>
        {station.address}
      </p>

      {/* Telemetry Metrics Grid */}
      <div style={{
        background: '#1E293B',
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.5rem',
        textAlign: 'center',
        marginBottom: '1rem',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        {/* Gas Pressure */}
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
            <Gauge size={13} color={pressureColor} /> Pressure
          </div>
          <div style={{ fontSize: '1rem', fontWeight: '800', color: pressureColor, marginTop: '0.1rem' }}>
            {station.gasPressure} <span style={{ fontSize: '0.7rem' }}>bar</span>
          </div>
        </div>

        {/* Live Queue */}
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
            <Clock size={13} color="var(--accent-cyan)" /> Queue
          </div>
          <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--accent-cyan)', marginTop: '0.1rem' }}>
            {station.queueCount} <span style={{ fontSize: '0.7rem' }}>veh.</span>
          </div>
        </div>

        {/* Price / kg */}
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
            <Fuel size={13} color="var(--primary)" /> Rate
          </div>
          <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--primary)', marginTop: '0.1rem' }}>
            ₹{station.pricePerKg} <span style={{ fontSize: '0.7rem' }}>/kg</span>
          </div>
        </div>
      </div>

      {/* Nozzle Availability Bar */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
          <span>Dispenser Nozzles:</span>
          <span style={{ color: '#fff', fontWeight: '600' }}>
            {station.activeNozzles} of {station.totalNozzles} Active
          </span>
        </div>
        <div style={{ height: '6px', background: '#334155', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{
            width: `${(station.activeNozzles / station.totalNozzles) * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--primary), var(--accent-cyan))',
            borderRadius: '3px'
          }} />
        </div>
      </div>

      {/* Estimated Wait Time Banner */}
      <div style={{
        background: 'rgba(0, 245, 160, 0.08)',
        border: '1px dashed var(--primary-glow)',
        borderRadius: 'var(--radius-sm)',
        padding: '0.5rem 0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.82rem',
        color: '#fff',
        marginBottom: '1.25rem'
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)' }}>
          <Clock size={15} /> Est. Wait:
        </span>
        <span style={{ fontWeight: '700' }}>~{station.avgWaitMins} Minutes</span>
      </div>

      {/* Book Button */}
      <button 
        className="btn btn-primary" 
        onClick={() => onBook(station)}
        style={{ width: '100%', marginTop: 'auto' }}
      >
        Book Express Slot <ChevronRight size={18} />
      </button>
    </div>
  );
}
