import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Truck } from 'lucide-react';

const COLORS = ['#ef4444', '#10b981']; // Red for Late, Green for Ontime

export default function ShippingScoreCard({ data }) {
  const stats = useMemo(() => {
    let lateCount = 0;
    let ontimeCount = 0;

    data.forEach(item => {
      const status = item['Status Shipping'];
      if (status === 'Late') {
        lateCount += 1;
      } else if (status === 'Ontime') {
        ontimeCount += 1;
      }
    });

    return { lateCount, ontimeCount };
  }, [data]);

  const chartData = [
    { name: 'Late', value: stats.lateCount },
    { name: 'Ontime', value: stats.ontimeCount }
  ];

  const totalScored = stats.lateCount + stats.ontimeCount;

  return (
    <div className="glass-card" style={{ position: 'relative', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div className="icon-container" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', width: '48px', height: '48px' }}>
          <Truck size={24} />
        </div>
        <div>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Status Shipping Date TMR</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>Total Baris Data berdasarkan Waktu Pengerjaan</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
        {/* Texts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-dark)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Late (&gt; 2 hari)</span>
            <strong style={{ color: 'var(--danger)', fontSize: '1.5rem' }}>{stats.lateCount.toLocaleString('id-ID')}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-dark)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Ontime (&le; 2 hari)</span>
            <strong style={{ color: 'var(--status-success)', fontSize: '1.5rem' }}>{stats.ontimeCount.toLocaleString('id-ID')}</strong>
          </div>
        </div>

        {/* Chart */}
        <div style={{ height: '220px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          {totalScored > 0 ? (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value.toLocaleString('id-ID')} Baris`, 'Total']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none', marginTop: '-18px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total</span>
                <br />
                <strong style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{totalScored.toLocaleString('id-ID')}</strong>
              </div>
            </>
          ) : (
            <div style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
              Tidak ada data / Status belum dihitung
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
