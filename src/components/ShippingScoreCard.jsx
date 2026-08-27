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
    <div className="glass-card" style={{ position: 'relative', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.25rem', height: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div className="icon-container" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', width: '40px', height: '40px' }}>
          <Truck size={20} />
        </div>
        <div>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Status Shipping Date TMR</h3>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
        {/* Texts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-dark)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Late (&gt;2h)</span>
            <strong style={{ color: 'var(--danger)', fontSize: '1.25rem' }}>{stats.lateCount.toLocaleString('id-ID')}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-dark)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Ontime (&le;2h)</span>
            <strong style={{ color: 'var(--status-success)', fontSize: '1.25rem' }}>{stats.ontimeCount.toLocaleString('id-ID')}</strong>
          </div>
        </div>

        {/* Chart */}
        <div style={{ height: '160px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          {totalScored > 0 ? (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                    labelLine={false}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                      if (percent === 0) return null;
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                      const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                      return (
                        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="0.75rem" fontWeight="bold">
                          {`${(percent * 100).toFixed(0)}%`}
                        </text>
                      );
                    }}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => {
                      const percent = totalScored > 0 ? (value / totalScored * 100).toFixed(0) : 0;
                      return [`${percent}%`, 'Persentase'];
                    }}
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
