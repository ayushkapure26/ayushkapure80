import React, { useState } from 'react';
import { Calculator, TrendingUp, Leaf, DollarSign, Fuel, Award } from 'lucide-react';

export default function SavingsCalculator() {
  const [dailyKm, setDailyKm] = useState(60);
  const [mileagePetrol, setMileagePetrol] = useState(14);
  const [petrolPrice, setPetrolPrice] = useState(104);
  const [cngPrice, setCngPrice] = useState(76);

  // Calculations
  const cngMileage = mileagePetrol * 1.3; // CNG gives ~30% higher mileage per kg compared to petrol per liter
  const dailyLitresPetrol = dailyKm / mileagePetrol;
  const dailyKgCng = dailyKm / cngMileage;

  const dailyCostPetrol = dailyLitresPetrol * petrolPrice;
  const dailyCostCng = dailyKgCng * cngPrice;

  const dailySavings = Math.max(0, dailyCostPetrol - dailyCostCng);
  const monthlySavings = Math.round(dailySavings * 30);
  const annualSavings = Math.round(dailySavings * 365);
  
  // CO2 savings calculation (1 L petrol = ~2.31 kg CO2, 1 kg CNG = ~1.65 kg CO2)
  const annualCo2Petrol = (dailyLitresPetrol * 365 * 2.31) / 1000; // Tons
  const annualCo2Cng = (dailyKgCng * 365 * 1.65) / 1000; // Tons
  const annualCo2SavedTons = Math.max(0, annualCo2Petrol - annualCo2Cng).toFixed(2);

  return (
    <div>
      {/* Banner */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary)', fontWeight: '700', fontSize: '0.85rem' }}>
          <Calculator size={18} /> Financial & Environmental Analytics
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', marginTop: '0.2rem', color: '#fff' }}>
          CNG Fuel Savings & Eco Calculator
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Calculate how much money you save each month by switching to CNG refueled at optimal pressure.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Sliders Input Panel */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.25rem', color: '#fff' }}>
            Input Parameters
          </h3>

          {/* Slider 1: Daily Distance */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Daily Distance Driven:</span>
              <strong style={{ color: 'var(--primary)' }}>{dailyKm} km / day</strong>
            </div>
            <input 
              type="range" 
              min="10" 
              max="250" 
              value={dailyKm} 
              onChange={(e) => setDailyKm(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
          </div>

          {/* Slider 2: Petrol Mileage */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Petrol Vehicle Mileage:</span>
              <strong style={{ color: 'var(--accent-cyan)' }}>{mileagePetrol} km / Liter</strong>
            </div>
            <input 
              type="range" 
              min="8" 
              max="25" 
              value={mileagePetrol} 
              onChange={(e) => setMileagePetrol(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
            />
          </div>

          {/* Slider 3: Petrol Price */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Petrol Price per Liter:</span>
              <strong style={{ color: '#fff' }}>₹{petrolPrice} / L</strong>
            </div>
            <input 
              type="range" 
              min="90" 
              max="120" 
              value={petrolPrice} 
              onChange={(e) => setPetrolPrice(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#fff', cursor: 'pointer' }}
            />
          </div>

          {/* Slider 4: CNG Price */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>CNG Station Rate:</span>
              <strong style={{ color: 'var(--primary)' }}>₹{cngPrice} / kg</strong>
            </div>
            <input 
              type="range" 
              min="65" 
              max="95" 
              value={cngPrice} 
              onChange={(e) => setCngPrice(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Results Output Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Big Monthly Savings Box */}
          <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(0, 245, 160, 0.15) 0%, rgba(0, 210, 255, 0.1) 100%)', border: '1px solid var(--primary-glow)', textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              YOUR ESTIMATED MONTHLY SAVINGS
            </div>
            <div style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--primary)', margin: '0.5rem 0' }}>
              ₹{monthlySavings.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#fff' }}>
              Annual Savings: <strong style={{ color: 'var(--accent-cyan)' }}>₹{annualSavings.toLocaleString('en-IN')}</strong> / year
            </div>
          </div>

          {/* Eco Impact Metrics */}
          <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: '#1E293B', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <Leaf size={24} color="#10B981" style={{ margin: '0 auto 0.4rem auto' }} />
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#34D399' }}>
                {annualCo2SavedTons} Tons
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                CO2 Emissions Prevented
              </div>
            </div>

            <div style={{ background: '#1E293B', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <TrendingUp size={24} color="var(--accent-cyan)" style={{ margin: '0 auto 0.4rem auto' }} />
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>
                +{Math.round((dailyCostPetrol / dailyCostCng - 1) * 100)}%
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Cost Efficiency Gain
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
