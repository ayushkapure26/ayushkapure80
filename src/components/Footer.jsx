import React from 'react';
import { Zap, Phone, ShieldCheck, Heart, MapPin, Fuel } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: '#070B14',
      borderTop: '1px solid var(--glass-border)',
      padding: '3rem 1.5rem 1.5rem 1.5rem',
      marginTop: '4rem',
      color: 'var(--text-muted)',
      fontSize: '0.88rem'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        
        {/* Col 1: Brand Info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.25rem', fontWeight: '800', color: '#fff', marginBottom: '0.75rem' }}>
            <div className="logo-icon" style={{ width: '32px', height: '32px' }}>
              <Zap size={18} />
            </div>
            GreenFlow <span className="gradient-text">CNG</span>
          </div>
          <p style={{ lineHeight: '1.6', fontSize: '0.85rem' }}>
            Next-gen Compressed Natural Gas station locator, express queue slot booking, and high-pressure telemetry management platform.
          </p>
        </div>

        {/* Col 2: Emergency Helpline & Safety */}
        <div>
          <h4 style={{ color: '#fff', fontWeight: '700', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
            Emergency & Support
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)' }}>
              <Phone size={15} /> CNG Emergency Leakage Hotline: 1800-22-2640
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={15} color="var(--accent-cyan)" /> Hydro Test Cylinder Compliance Check
            </li>
            <li>Station Nozzle Bar Pressure Guidelines</li>
          </ul>
        </div>

        {/* Col 3: Coverage Hubs */}
        <div>
          <h4 style={{ color: '#fff', fontWeight: '700', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
            Supported Metro Regions
          </h4>
          <p style={{ fontSize: '0.82rem', lineHeight: '1.7' }}>
            Mumbai MMR • Delhi NCR & Gurugram • Pune & Pimpri Chinchwad • Ahmedabad & Gandhinagar • Bengaluru • Hyderabad
          </p>
        </div>

      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.25rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', fontSize: '0.8rem' }}>
        <div>
          © {new Date().getFullYear()} GreenFlow CNG Technologies. All rights reserved.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--primary)' }}>
          Powered by High-Pressure Smart Metering
        </div>
      </div>
    </footer>
  );
}
