import React, { useMemo } from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';

export default function SummaryCards({ data }) {
  const stats = useMemo(() => {
    let sudahGR = 0;
    let belumGR = 0;

    data.forEach(item => {
      if (item['Status Keterangan GR'] === 'Sudah GR') sudahGR++;
      if (item['Status Keterangan GR'] === 'Belum GR') belumGR++;
    });

    return { sudahGR, belumGR };
  }, [data]);

  return (
    <div className="grid-2" style={{ marginBottom: '3rem' }}>
      
      <div className="glass-card" style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--status-success)', filter: 'blur(80px)', opacity: 0.15, borderRadius: '50%' }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', position: 'relative', zIndex: 2 }}>
          <div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Sudah GR</h3>
            <div style={{ fontSize: '3.5rem', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1 }}>
              {stats.sudahGR.toLocaleString()}
            </div>
          </div>
          <div className="icon-container" style={{ background: 'var(--status-success-bg)', color: 'var(--status-success)' }}>
            <CheckCircle size={28} strokeWidth={2.5} />
          </div>
        </div>
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge success">Completed</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Items successfully received</span>
        </div>
      </div>

      <div className="glass-card" style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--status-warning)', filter: 'blur(80px)', opacity: 0.15, borderRadius: '50%' }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', position: 'relative', zIndex: 2 }}>
          <div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Belum GR</h3>
            <div style={{ fontSize: '3.5rem', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1 }}>
              {stats.belumGR.toLocaleString()}
            </div>
          </div>
          <div className="icon-container" style={{ background: 'var(--status-warning-bg)', color: 'var(--status-warning)' }}>
            <AlertTriangle size={28} strokeWidth={2.5} />
          </div>
        </div>
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge warning">Pending</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Items waiting to be received</span>
        </div>
      </div>

    </div>
  );
}
