import React, { useState, useEffect } from 'react';
import { Ticket, Clock, CheckCircle2, Navigation, AlertCircle, RefreshCw, XCircle, Fuel, ShieldCheck, QrCode } from 'lucide-react';
import TokenPassModal from './TokenPassModal';

export default function LiveQueueTracker({ bookings, onUpdateBookingStatus, stations }) {
  const [selectedPass, setSelectedPass] = useState(null);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'history'

  const activeBookings = bookings.filter(b => b.status === 'Active' || b.status === 'In Progress');
  const pastBookings = bookings.filter(b => b.status === 'Completed' || b.status === 'Cancelled');

  return (
    <div>
      {/* Header Banner */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary)', fontWeight: '700', fontSize: '0.85rem' }}>
          <Ticket size={18} /> Live Queue Monitor
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', marginTop: '0.2rem', color: '#fff' }}>
          My CNG Refill Passes
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Track real-time queue movement, token serving progress, and dispenser nozzle assignments.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveTab('active')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'active' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'active' ? 'var(--primary)' : 'var(--text-muted)',
            padding: '0.6rem 1rem',
            fontWeight: '700',
            cursor: 'pointer',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          Active Tokens ({activeBookings.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'history' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'history' ? 'var(--primary)' : 'var(--text-muted)',
            padding: '0.6rem 1rem',
            fontWeight: '700',
            cursor: 'pointer',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          Completed History ({pastBookings.length})
        </button>
      </div>

      {/* Active Passes View */}
      {activeTab === 'active' && (
        activeBookings.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {activeBookings.map(booking => {
              const stationInfo = stations.find(s => s.id === booking.stationId);
              const servingToken = stationInfo ? stationInfo.servingToken : 'GF-BDW-104';

              return (
                <div key={booking.id} className="glass-card" style={{ border: '1px solid var(--primary-glow)' }}>
                  {/* Top Row Info */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <span className="badge badge-success">
                        <span className="pulse-dot"></span> Live Queue Active
                      </span>
                      <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#fff', marginTop: '0.3rem' }}>
                        Token: <span style={{ color: 'var(--primary)' }}>{booking.tokenNo}</span>
                      </h2>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                        📍 {booking.stationName} ({booking.city})
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Currently Serving</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>
                        {servingToken}
                      </div>
                    </div>
                  </div>

                  {/* Real-time Queue Progress Tracker Bar */}
                  <div style={{ background: '#1E293B', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: '600' }}>
                      <span>Your Queue Position: <span style={{ color: '#FBBF24' }}>#{booking.positionInQueue} in line</span></span>
                      <span>Est. Wait: <span style={{ color: 'var(--primary)' }}>~{booking.estWaitMinutes} mins</span></span>
                    </div>

                    {/* Progress Steps Timeline */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginTop: '1rem', textAlign: 'center' }}>
                      {[
                        { step: 1, label: 'Booked', active: true },
                        { step: 2, label: 'En Route', active: booking.status === 'Active' || booking.status === 'In Progress' },
                        { step: 3, label: 'In Queue', active: booking.positionInQueue <= 2 },
                        { step: 4, label: 'Refueling', active: booking.status === 'In Progress' }
                      ].map(s => (
                        <div key={s.step} style={{ opacity: s.active ? 1 : 0.4 }}>
                          <div style={{
                            height: '6px',
                            background: s.active ? 'linear-gradient(90deg, var(--primary), var(--accent-cyan))' : '#334155',
                            borderRadius: '3px',
                            marginBottom: '0.4rem'
                          }} />
                          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: s.active ? 'var(--primary)' : 'var(--text-muted)' }}>
                            {s.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Refill Pass Meta Info Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Vehicle Reg.</div>
                      <div style={{ fontWeight: '700', color: '#fff' }}>{booking.vehicleNo} ({booking.vehicleType})</div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Assigned Nozzle</div>
                      <div style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>{booking.assignedNozzle}</div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Refill Preference</div>
                      <div style={{ fontWeight: '700', color: '#fff' }}>{booking.refillQty}</div>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <button className="btn btn-primary btn-sm" onClick={() => setSelectedPass(booking)}>
                      <QrCode size={16} /> View Digital QR Pass
                    </button>
                    
                    <button 
                      className="btn btn-secondary btn-sm" 
                      onClick={() => onUpdateBookingStatus(booking.id, 'Completed')}
                      style={{ color: '#34D399' }}
                    >
                      <CheckCircle2 size={16} /> Simulate Fueling Complete
                    </button>

                    <button 
                      className="btn btn-secondary btn-sm" 
                      onClick={() => onUpdateBookingStatus(booking.id, 'Cancelled')}
                      style={{ color: '#FCA5A5', marginLeft: 'auto' }}
                    >
                      <XCircle size={16} /> Cancel Token
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
            <Ticket size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Active CNG Refill Tokens</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>You don't have any pending CNG bookings right now.</p>
          </div>
        )
      )}

      {/* History View */}
      {activeTab === 'history' && (
        pastBookings.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pastBookings.map(b => (
              <div key={b.id} className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`badge ${b.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                      {b.status}
                    </span>
                    <strong style={{ color: '#fff' }}>{b.tokenNo}</strong>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>• {b.vehicleNo}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                    {b.stationName} — {b.bookingDate} ({b.refillQty})
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>No past booking history found.</p>
          </div>
        )
      )}

      {/* Modal for QR pass view */}
      {selectedPass && (
        <TokenPassModal 
          booking={selectedPass}
          onClose={() => setSelectedPass(null)}
          onGoToTracker={() => setSelectedPass(null)}
        />
      )}
    </div>
  );
}
