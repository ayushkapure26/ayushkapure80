import React from 'react';
import { X, QrCode, Ticket, CheckCircle, Download, Clock, Navigation, Zap, Fuel } from 'lucide-react';

export default function TokenPassModal({ booking, onClose, onGoToTracker }) {
  if (!booking) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', textAlign: 'center' }}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* Success Header */}
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(0, 245, 160, 0.2)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem auto',
          border: '1px solid var(--primary)'
        }}>
          <CheckCircle size={32} />
        </div>

        <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>
          <Zap size={14} /> Token Confirmed & Registered
        </span>

        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff', marginTop: '0.25rem' }}>
          Digital CNG Refill Pass
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Show this QR code at station dispenser counter
        </p>

        {/* Digital Ticket Card */}
        <div style={{
          background: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',
          border: '1px dashed var(--primary-glow)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          margin: '1.25rem 0',
          position: 'relative'
        }}>
          {/* Token Serial Number */}
          <div style={{
            fontSize: '1.8rem',
            fontWeight: '900',
            letterSpacing: '0.05em',
            color: 'var(--primary)',
            background: 'rgba(0, 245, 160, 0.1)',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-md)',
            display: 'inline-block',
            marginBottom: '1rem',
            border: '1px solid rgba(0, 245, 160, 0.3)'
          }}>
            {booking.tokenNo}
          </div>

          {/* QR Code Container */}
          <div style={{
            background: '#fff',
            padding: '0.75rem',
            borderRadius: '12px',
            width: '160px',
            height: '160px',
            margin: '0 auto 1rem auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
          }}>
            <img 
              src={booking.qrCodeUrl} 
              alt="CNG Pass QR Code"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              onError={(e) => {
                // Fallback icon if image offline
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* Ticket Details Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
            textAlign: 'left',
            background: 'rgba(0, 0, 0, 0.2)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem'
          }}>
            <div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Vehicle Reg. No.</div>
              <div style={{ fontWeight: '700', color: '#fff' }}>{booking.vehicleNo}</div>
            </div>

            <div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Assigned Nozzle</div>
              <div style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>{booking.assignedNozzle}</div>
            </div>

            <div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Queue Position</div>
              <div style={{ fontWeight: '700', color: '#FBBF24' }}>#{booking.positionInQueue} in line</div>
            </div>

            <div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Est. Arrival Wait</div>
              <div style={{ fontWeight: '700', color: 'var(--primary)' }}>~{booking.estWaitMinutes} mins</div>
            </div>
          </div>
          
          <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            📍 {booking.stationName}
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <button 
            className="btn btn-primary" 
            onClick={() => {
              onClose();
              onGoToTracker();
            }}
            style={{ width: '100%' }}
          >
            Track Live Queue Status <Clock size={16} />
          </button>
          
          <button 
            className="btn btn-secondary" 
            onClick={onClose}
            style={{ width: '100%' }}
          >
            Close & Save to Passbook
          </button>
        </div>
      </div>
    </div>
  );
}
