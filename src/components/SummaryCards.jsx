import React, { useMemo } from 'react';
import { Package, Truck, CheckCircle, Clock, Send, Activity, Archive, CreditCard, AlertCircle, CalendarCheck, Layers } from 'lucide-react';

export default function SummaryCards({ data }) {
  const stats = useMemo(() => {
    let totalQty = 0;
    let delivered = 0;
    let dispatch = 0;
    let onProcess = 0;
    let sudahGR = 0;
    let belumGR = 0;
    let stockCount = 0;
    let expenseCount = 0;
    let onTime = 0;
    let late = 0;

    data.forEach(item => {
      totalQty += Number(item['Quantity TMR']) || 0;
      
      if (item['Status TMR'] === 'Delivered') delivered++;
      if (item['Status TMR'] === 'Dispatch') dispatch++;
      if (item['Status TMR'] === 'On Process') onProcess++;
      
      if (item['Status Keterangan GR'] === 'Sudah GR') {
        sudahGR++;
        // Calculate On Time / Late (SLA: <= 3 days from Shipping to GR)
        if (item['Shipping Date'] && item['GR Date TMR']) {
          const ship = new Date(item['Shipping Date']);
          const gr = new Date(item['GR Date TMR']);
          const diffDays = (gr - ship) / (1000 * 60 * 60 * 24);
          if (diffDays > 3) {
            late++;
          } else {
            onTime++;
          }
        }
      }
      if (item['Status Keterangan GR'] === 'Belum GR') belumGR++;

      const matType = (item['Material Type'] || '').toUpperCase();
      if (matType.includes('STOK') || matType.includes('STOCK')) {
        stockCount++;
      } else {
        expenseCount++;
      }
    });

    return {
      totalItems: data.length,
      totalQty,
      delivered,
      dispatch,
      onProcess,
      sudahGR,
      belumGR,
      stockCount,
      expenseCount,
      onTime,
      late
    };
  }, [data]);

  return (
    <div className="dashboard-grid">
      {/* Left Column: Main Metrics & Logistics */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Section 1: Overview */}
        <section>
          <div className="section-title">
            <Layers size={16} /> Key Metrics
          </div>
          <div className="grid-2">
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Total Records</h3>
                  <div className="text-gradient" style={{ fontSize: '3rem', fontWeight: 'bold', lineHeight: 1.2 }}>
                    {stats.totalItems.toLocaleString()}
                  </div>
                </div>
                <div className="icon-box blue" style={{ width: '64px', height: '64px' }}>
                  <Package size={32} />
                </div>
              </div>
              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.9rem' }}>
                Total Quantity: <strong style={{ color: 'var(--text-primary)' }}>{stats.totalQty.toLocaleString()}</strong> units
              </div>
            </div>

            {/* Split Card for Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="glass-card" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem' }}>
                <div>
                  <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Stock Items</h3>
                  <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{stats.stockCount.toLocaleString()}</div>
                </div>
                <div className="icon-box green"><Archive size={20} /></div>
              </div>
              <div className="glass-card" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem' }}>
                <div>
                  <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Expense Items</h3>
                  <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{stats.expenseCount.toLocaleString()}</div>
                </div>
                <div className="icon-box orange"><CreditCard size={20} /></div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Logistics */}
        <section>
          <div className="section-title">
            <Truck size={16} /> Logistics Pipeline
          </div>
          <div className="grid-3">
            <div className="glass-card">
              <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Dispatch</h3>
                <div className="icon-box purple" style={{ width: '36px', height: '36px' }}><Send size={18} /></div>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{stats.dispatch.toLocaleString()}</div>
            </div>
            
            <div className="glass-card">
              <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>On Process</h3>
                <div className="icon-box" style={{ width: '36px', height: '36px', background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6' }}><Activity size={18} /></div>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{stats.onProcess.toLocaleString()}</div>
            </div>

            <div className="glass-card">
              <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Delivered</h3>
                <div className="icon-box green" style={{ width: '36px', height: '36px' }}><Truck size={18} /></div>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{stats.delivered.toLocaleString()}</div>
            </div>
          </div>
        </section>
      </div>

      {/* Right Column: GR Status */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <section style={{ height: '100%' }}>
          <div className="section-title">
            <CheckCircle size={16} /> Goods Receipt (GR)
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: 'calc(100% - 2.5rem)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="glass-card" style={{ padding: '1rem' }}>
                <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Sudah GR</h3>
                <div className="text-gradient-green" style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{stats.sudahGR.toLocaleString()}</div>
              </div>
              <div className="glass-card" style={{ padding: '1rem' }}>
                <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Belum GR</h3>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--status-warning)' }}>{stats.belumGR.toLocaleString()}</div>
              </div>
            </div>
            
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem', marginTop: 'auto', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SLA Performance</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="icon-box green" style={{ width: '44px', height: '44px' }}><CalendarCheck size={20} /></div>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{stats.onTime.toLocaleString()}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>On Time (≤ 3d)</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="icon-box red" style={{ width: '44px', height: '44px' }}><AlertCircle size={20} /></div>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--status-danger)' }}>{stats.late.toLocaleString()}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Late (&gt; 3d)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}
