import React, { useMemo } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function SummaryCards({ data }) {
  const stats = useMemo(() => {
    let sudahGR = 0;
    let belumGR = 0;

    data.forEach(item => {
      if (item['Status Keterangan GR'] === 'Sudah GR') sudahGR++;
      if (item['Status Keterangan GR'] === 'Belum GR') belumGR++;
    });

    return {
      sudahGR,
      belumGR
    };
  }, [data]);

  return (
    <div className="grid-2" style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
      
      <div className="glass-card">
        <div className="flex-between" style={{ marginBottom: '1rem' }}>
          <div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Sudah GR</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#34d399' }}>
              {stats.sudahGR.toLocaleString()}
            </div>
          </div>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '12px', color: '#34d399' }}>
            <CheckCircle size={32} />
          </div>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Items that have been successfully received
        </p>
      </div>

      <div className="glass-card">
        <div className="flex-between" style={{ marginBottom: '1rem' }}>
          <div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Belum GR</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fbbf24' }}>
              {stats.belumGR.toLocaleString()}
            </div>
          </div>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '1rem', borderRadius: '12px', color: '#fbbf24' }}>
            <AlertCircle size={32} />
          </div>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Items still waiting to be received
        </p>
      </div>

    </div>
  );
}
