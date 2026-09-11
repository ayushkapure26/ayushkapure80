import React, { useState } from 'react';
import { X, Fuel, Car, Calendar, Clock, Zap, CheckCircle2, ShieldCheck } from 'lucide-react';
import { VEHICLE_TYPES } from '../data/mockStations';

export default function BookingModal({ station, onClose, onSubmitBooking }) {
  const [driverName, setDriverName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleType, setVehicleType] = useState('Car');
  const [vehicleNo, setVehicleNo] = useState('');
  const [refillQty, setRefillQty] = useState('Full Tank (10 kg)');
  const [bookingType, setBookingType] = useState('Express Queue'); // 'Express Queue' | 'Scheduled'
  const [selectedSlot, setSelectedSlot] = useState('Instant Express');
  const [errorMsg, setErrorMsg] = useState('');

  const timeSlots = [
    'Instant Express (Next in Queue)',
    '15 Mins from now',
    '30 Mins from now',
    '03:30 PM - 04:00 PM',
    '04:00 PM - 04:30 PM',
    '05:00 PM - 05:30 PM (Evening Peak)',
    '07:30 PM - 08:00 PM'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!driverName.trim()) {
      setErrorMsg('Please enter driver name');
      return;
    }
    if (!phone.trim() || phone.length < 8) {
      setErrorMsg('Please enter a valid mobile number');
      return;
    }
    if (!vehicleNo.trim()) {
      setErrorMsg('Please enter vehicle registration number (e.g. MH-02-AB-1234)');
      return;
    }

    const stationCode = station.code.split('-')[1] || 'CNG';
    const randomSeq = Math.floor(100 + Math.random() * 900);
    const tokenNo = `GF-${stationCode}-${randomSeq}`;
    const tokenGuid = `GF-${stationCode}-${Date.now().toString().slice(-4)}`;

    const newBooking = {
      id: tokenGuid,
      stationId: station.id,
      stationName: station.name,
      stationAddress: station.address,
      city: station.city,
      driverName: driverName.trim(),
      phone: phone.trim(),
      vehicleType,
      vehicleNo: vehicleNo.trim().toUpperCase(),
      refillQty,
      bookingType,
      slotTime: bookingType === 'Express Queue' ? 'Instant Express' : selectedSlot,
      bookingDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      tokenNo,
      positionInQueue: (station.queueCount || 2) + 1,
      estWaitMinutes: Math.max(5, (station.queueCount || 2) * 2 + 2),
      assignedNozzle: `Dispenser No. ${Math.floor(Math.random() * station.activeNozzles) + 1}`,
      status: 'Active',
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${tokenGuid}-${vehicleNo}`
    };

    onSubmitBooking(newBooking);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span className="badge badge-primary">
            <Zap size={14} /> CNG Express Refill Token
          </span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginTop: '0.4rem', color: '#fff' }}>
            Book Refill Pass
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            {station.name} — <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{station.gasPressure} Bar Pressure</span>
          </p>
        </div>

        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#FCA5A5', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Driver & Mobile Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Driver / Owner Name *</label>
              <input 
                type="text" 
                className="form-input"
                placeholder="e.g. Ramesh Kumar"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Number *</label>
              <input 
                type="tel" 
                className="form-input"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Vehicle Type & Vehicle Reg No */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Vehicle Category</label>
              <select 
                className="form-select"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
              >
                {VEHICLE_TYPES.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Vehicle Number (Plate No.) *</label>
              <input 
                type="text" 
                className="form-input"
                placeholder="MH-02-CB-1234"
                value={vehicleNo}
                onChange={(e) => setVehicleNo(e.target.value)}
                required
                style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}
              />
            </div>
          </div>

          {/* Refill Amount Preference */}
          <div className="form-group">
            <label className="form-label">Target Fueling Quantity</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {['Full Tank (10 kg)', '5 kg Express Fill', '₹500 Amount'].map(qty => (
                <button
                  type="button"
                  key={qty}
                  onClick={() => setRefillQty(qty)}
                  style={{
                    background: refillQty === qty ? 'rgba(0, 245, 160, 0.15)' : '#1E293B',
                    border: refillQty === qty ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                    color: refillQty === qty ? 'var(--primary)' : 'var(--text-muted)',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {qty}
                </button>
              ))}
            </div>
          </div>

          {/* Booking Type: Express vs Scheduled */}
          <div className="form-group">
            <label className="form-label">Refill Scheduling Option</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div 
                onClick={() => setBookingType('Express Queue')}
                style={{
                  background: bookingType === 'Express Queue' ? 'rgba(0, 245, 160, 0.15)' : '#1E293B',
                  border: bookingType === 'Express Queue' ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700', color: bookingType === 'Express Queue' ? 'var(--primary)' : '#fff', fontSize: '0.9rem' }}>
                  <Zap size={16} /> Instant Express
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Join live sequence now. ~{station.avgWaitMins} mins wait.
                </div>
              </div>

              <div 
                onClick={() => setBookingType('Scheduled')}
                style={{
                  background: bookingType === 'Scheduled' ? 'rgba(0, 210, 255, 0.15)' : '#1E293B',
                  border: bookingType === 'Scheduled' ? '1px solid var(--accent-cyan)' : '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700', color: bookingType === 'Scheduled' ? 'var(--accent-cyan)' : '#fff', fontSize: '0.9rem' }}>
                  <Clock size={16} /> Scheduled Slot
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Reserve 30-min window for later today.
                </div>
              </div>
            </div>
          </div>

          {bookingType === 'Scheduled' && (
            <div className="form-group">
              <label className="form-label">Select Time Slot Today</label>
              <select 
                className="form-select" 
                value={selectedSlot} 
                onChange={(e) => setSelectedSlot(e.target.value)}
              >
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.85rem' }}>
            Generate Digital CNG Pass <CheckCircle2 size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
