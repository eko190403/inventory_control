import React, { useMemo } from 'react';
import { CheckCircle, AlertTriangle, Box, DollarSign } from 'lucide-react';

export default function SummaryCards({ data }) {
  const stats = useMemo(() => {
    let sudahGR = { count: 0, qty: 0 };
    let belumGR = { count: 0, qty: 0 };
    
    let invSudahGR = { count: 0, qty: 0 };
    let invBelumGR = { count: 0, qty: 0 };
    
    let expSudahGR = { count: 0, qty: 0 };
    let expBelumGR = { count: 0, qty: 0 };

    data.forEach(item => {
      let qty = parseInt(item['Quantity TMR'], 10);
      if (isNaN(qty)) qty = 0;

      const status = item['Status Keterangan GR'];
      const matlGroup = (item['Matl. Group'] || '').toLowerCase();

      if (status === 'SUDAH GR') {
        sudahGR.count += 1;
        sudahGR.qty += qty;
        if (matlGroup.includes('inventory')) {
            invSudahGR.count += 1;
            invSudahGR.qty += qty;
        }
        else if (matlGroup.includes('expence') || matlGroup.includes('expense')) {
            expSudahGR.count += 1;
            expSudahGR.qty += qty;
        }
      } else if (status === 'BELUM GR') {
        belumGR.count += 1;
        belumGR.qty += qty;
        if (matlGroup.includes('inventory')) {
            invBelumGR.count += 1;
            invBelumGR.qty += qty;
        }
        else if (matlGroup.includes('expence') || matlGroup.includes('expense')) {
            expBelumGR.count += 1;
            expBelumGR.qty += qty;
        }
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
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Sudah GR</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1 }}>
              {stats.sudahGR.count.toLocaleString('id-ID')} <span style={{fontSize: '1rem', fontWeight: 'normal', color: 'var(--text-secondary)'}}>TMR</span>
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Total Qty: <strong style={{color: 'var(--status-success)'}}>{stats.sudahGR.qty.toLocaleString('id-ID')}</strong>
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
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Belum GR</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1 }}>
              {stats.belumGR.count.toLocaleString('id-ID')} <span style={{fontSize: '1rem', fontWeight: 'normal', color: 'var(--text-secondary)'}}>TMR</span>
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Total Qty: <strong style={{color: 'var(--status-warning)'}}>{stats.belumGR.qty.toLocaleString('id-ID')}</strong>
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
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1 }}>
              {(stats.invSudahGR.count + stats.invBelumGR.count).toLocaleString('id-ID')} <span style={{fontSize: '1rem', fontWeight: 'normal', color: 'var(--text-secondary)'}}>TMR</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Sudah GR: <strong style={{color: 'var(--status-success)'}}>{stats.invSudahGR.qty.toLocaleString('id-ID')}</strong> Qty
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Belum GR: <strong style={{color: 'var(--status-warning)'}}>{stats.invBelumGR.qty.toLocaleString('id-ID')}</strong> Qty
                </span>
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
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1 }}>
              {(stats.expSudahGR.count + stats.expBelumGR.count).toLocaleString('id-ID')} <span style={{fontSize: '1rem', fontWeight: 'normal', color: 'var(--text-secondary)'}}>TMR</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Sudah GR: <strong style={{color: 'var(--status-success)'}}>{stats.expSudahGR.qty.toLocaleString('id-ID')}</strong> Qty
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Belum GR: <strong style={{color: 'var(--status-warning)'}}>{stats.expBelumGR.qty.toLocaleString('id-ID')}</strong> Qty
                </span>
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
