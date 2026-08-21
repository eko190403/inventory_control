import React, { useMemo } from 'react';
import { Box, DollarSign } from 'lucide-react';

export default function SummaryCards({ data }) {
  const stats = useMemo(() => {
    let invSudahGRQty = 0;
    let invBelumGRQty = 0;
    let expSudahGRQty = 0;
    let expBelumGRQty = 0;

    data.forEach(item => {
      let qty = parseInt(item['Quantity TMR'], 10);
      if (isNaN(qty)) qty = 0;

      const status = item['Status Keterangan GR'];
      const matlGroup = (item['Matl. Group'] || '').toLowerCase();

      if (matlGroup.includes('expence') || matlGroup.includes('expense')) {
        if (status === 'SUDAH GR') {
            expSudahGRQty += qty;
        } else {
            expBelumGRQty += qty;
        }
      } else {
        if (status === 'SUDAH GR') {
            invSudahGRQty += qty;
        } else {
            invBelumGRQty += qty;
        }
      }
    });

    return { invSudahGRQty, invBelumGRQty, expSudahGRQty, expBelumGRQty };
  }, [data]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
      
      <div className="glass-card" style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100px', height: '100px', background: 'var(--brand-purple)', filter: 'blur(60px)', opacity: 0.15, borderRadius: '50%' }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 2 }}>
          <div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Inventory</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                  Sudah GR: <strong style={{color: 'var(--status-success)', fontSize: '1.75rem', marginLeft: '0.5rem'}}>{stats.invSudahGRQty.toLocaleString('id-ID')}</strong> <span style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>Qty</span>
                </span>
                <span style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                  Belum GR: <strong style={{color: 'var(--status-warning)', fontSize: '1.75rem', marginLeft: '0.5rem'}}>{stats.invBelumGRQty.toLocaleString('id-ID')}</strong> <span style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>Qty</span>
                </span>
            </div>
          </div>
          <div className="icon-container" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa', width: '64px', height: '64px' }}>
            <Box size={32} strokeWidth={2.5} />
          </div>
        </div>
      </div>
      
      <div className="glass-card" style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100px', height: '100px', background: 'var(--brand-blue)', filter: 'blur(60px)', opacity: 0.15, borderRadius: '50%' }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 2 }}>
          <div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Expense (OB)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                  Sudah GR: <strong style={{color: 'var(--status-success)', fontSize: '1.75rem', marginLeft: '0.5rem'}}>{stats.expSudahGRQty.toLocaleString('id-ID')}</strong> <span style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>Qty</span>
                </span>
                <span style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                  Belum GR: <strong style={{color: 'var(--status-warning)', fontSize: '1.75rem', marginLeft: '0.5rem'}}>{stats.expBelumGRQty.toLocaleString('id-ID')}</strong> <span style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>Qty</span>
                </span>
            </div>
          </div>
          <div className="icon-container" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#7dd3fc', width: '64px', height: '64px' }}>
            <DollarSign size={32} strokeWidth={2.5} />
          </div>
        </div>
      </div>

    </div>
  );
}
