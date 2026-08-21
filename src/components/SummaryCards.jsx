import React, { useMemo } from 'react';
import { CheckCircle, AlertTriangle, Box, DollarSign } from 'lucide-react';

export default function SummaryCards({ data }) {
  const stats = useMemo(() => {
    let sudahGR = 0;
    let belumGR = 0;
    
    let invSudahGR = 0;
    let invBelumGR = 0;
    
    let expSudahGR = 0;
    let expBelumGR = 0;

    data.forEach(item => {
      const status = item['Status Keterangan GR'];
      const matlGroup = (item['Matl. Group'] || '').toLowerCase();

      if (status === 'SUDAH GR') {
        sudahGR += 1;
        if (matlGroup.includes('inventory')) invSudahGR += 1;
        else if (matlGroup.includes('expence') || matlGroup.includes('expense')) expSudahGR += 1;
      } else if (status === 'BELUM GR') {
        belumGR += 1;
        if (matlGroup.includes('inventory')) invBelumGR += 1;
        else if (matlGroup.includes('expence') || matlGroup.includes('expense')) expBelumGR += 1;
      }
    });

    return { sudahGR, belumGR, invSudahGR, invBelumGR, expSudahGR, expBelumGR };
  }, [data]);

  return (
    <div className="grid-4" style={{ marginBottom: '3rem' }}>
      
      <div className="glass-card" style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100px', height: '100px', background: 'var(--status-success)', filter: 'blur(60px)', opacity: 0.15, borderRadius: '50%' }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', position: 'relative', zIndex: 2 }}>
          <div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Jumlah TMR Sudah GR</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1 }}>
              {stats.sudahGR.toLocaleString('id-ID')}
            </div>
          </div>
          <div className="icon-container" style={{ background: 'var(--status-success-bg)', color: 'var(--status-success)', width: '48px', height: '48px' }}>
            <CheckCircle size={24} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100px', height: '100px', background: 'var(--status-warning)', filter: 'blur(60px)', opacity: 0.15, borderRadius: '50%' }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', position: 'relative', zIndex: 2 }}>
          <div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Jumlah TMR Belum GR</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1 }}>
              {stats.belumGR.toLocaleString('id-ID')}
            </div>
          </div>
          <div className="icon-container" style={{ background: 'var(--status-warning-bg)', color: 'var(--status-warning)', width: '48px', height: '48px' }}>
            <AlertTriangle size={24} strokeWidth={2.5} />
          </div>
        </div>
      </div>
      
      <div className="glass-card" style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100px', height: '100px', background: 'var(--brand-purple)', filter: 'blur(60px)', opacity: 0.15, borderRadius: '50%' }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', position: 'relative', zIndex: 2 }}>
          <div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Inventory</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--status-success)' }}>{stats.invSudahGR.toLocaleString('id-ID')} Sudah GR</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--status-warning)' }}>{stats.invBelumGR.toLocaleString('id-ID')} Belum GR</span>
            </div>
          </div>
          <div className="icon-container" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa', width: '48px', height: '48px' }}>
            <Box size={24} strokeWidth={2.5} />
          </div>
        </div>
      </div>
      
      <div className="glass-card" style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100px', height: '100px', background: 'var(--brand-blue)', filter: 'blur(60px)', opacity: 0.15, borderRadius: '50%' }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', position: 'relative', zIndex: 2 }}>
          <div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Expense (OB)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--status-success)' }}>{stats.expSudahGR.toLocaleString('id-ID')} Sudah GR</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--status-warning)' }}>{stats.expBelumGR.toLocaleString('id-ID')} Belum GR</span>
            </div>
          </div>
          <div className="icon-container" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#7dd3fc', width: '48px', height: '48px' }}>
            <DollarSign size={24} strokeWidth={2.5} />
          </div>
        </div>
      </div>

    </div>
  );
}
