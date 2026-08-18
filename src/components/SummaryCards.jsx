import React, { useMemo } from 'react';
import { Package, Truck, CheckCircle, Clock, Send, Activity, Archive, CreditCard, AlertCircle, CalendarCheck } from 'lucide-react';

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
    <div style={{ marginBottom: '2rem' }}>
      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <div className="glass-card">
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <div>
              <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Total Records</h3>
              <div className="text-gradient" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {stats.totalItems.toLocaleString()}
              </div>
            </div>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.75rem', borderRadius: '12px', color: '#60a5fa' }}>
              <Package size={24} />
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Total Qty: <strong style={{ color: 'var(--text-primary)' }}>{stats.totalQty.toLocaleString()}</strong> units
          </p>
        </div>

        <div className="glass-card">
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <div>
              <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Sudah GR</h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {stats.sudahGR.toLocaleString()}
              </div>
            </div>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '12px', color: '#34d399' }}>
              <CheckCircle size={24} />
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Items marked as <span className="badge success" style={{ margin: '0 4px' }}>Sudah GR</span>
          </p>
        </div>

        <div className="glass-card">
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <div>
              <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Belum GR</h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {stats.belumGR.toLocaleString()}
              </div>
            </div>
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '0.75rem', borderRadius: '12px', color: '#fbbf24' }}>
              <Clock size={24} />
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Items still waiting <span className="badge warning" style={{ margin: '0 4px' }}>Belum GR</span>
          </p>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <div className="glass-card">
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <div>
              <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>On Time GR</h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {stats.onTime.toLocaleString()}
              </div>
            </div>
            <div style={{ background: 'rgba(52, 211, 153, 0.1)', padding: '0.75rem', borderRadius: '12px', color: '#34d399' }}>
              <CalendarCheck size={24} />
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Lead time ≤ 3 days <span className="badge" style={{ margin: '0 4px', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.3)' }}>On Time</span>
          </p>
        </div>

        <div className="glass-card">
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <div>
              <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Late GR</h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--danger)' }}>
                {stats.late.toLocaleString()}
              </div>
            </div>
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '12px', color: '#ef4444' }}>
              <AlertCircle size={24} />
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Lead time &gt; 3 days <span className="badge" style={{ margin: '0 4px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}>Late</span>
          </p>
        </div>

        <div className="glass-card">
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <div>
              <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Delivery Status</h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {stats.delivered.toLocaleString()}
              </div>
            </div>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '12px', color: '#34d399' }}>
              <Truck size={24} />
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Items marked as <span className="badge success" style={{ margin: '0 4px' }}>Delivered</span>
          </p>
        </div>
      </div>

      <div className="grid-3">
        <div className="glass-card">
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <div>
              <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Dispatch</h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {stats.dispatch.toLocaleString()}
              </div>
            </div>
            <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '0.75rem', borderRadius: '12px', color: '#c084fc' }}>
              <Send size={24} />
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Items marked as <span className="badge" style={{ margin: '0 4px', background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)' }}>Dispatch</span>
          </p>
        </div>

        <div className="glass-card">
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <div>
              <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>On Process</h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {stats.onProcess.toLocaleString()}
              </div>
            </div>
            <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '0.75rem', borderRadius: '12px', color: '#f472b6' }}>
              <Activity size={24} />
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Items marked as <span className="badge" style={{ margin: '0 4px', background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', border: '1px solid rgba(236, 72, 153, 0.3)' }}>On Process</span>
          </p>
        </div>

        <div className="glass-card">
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <div>
              <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Stock Items</h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {stats.stockCount.toLocaleString()}
              </div>
            </div>
            <div style={{ background: 'rgba(52, 211, 153, 0.1)', padding: '0.75rem', borderRadius: '12px', color: '#34d399' }}>
              <Archive size={24} />
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Material Type includes <span className="badge" style={{ margin: '0 4px', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.3)' }}>Stock</span>
          </p>
        </div>

        <div className="glass-card">
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <div>
              <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Expense Items</h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {stats.expenseCount.toLocaleString()}
              </div>
            </div>
            <div style={{ background: 'rgba(251, 146, 60, 0.1)', padding: '0.75rem', borderRadius: '12px', color: '#fb923c' }}>
              <CreditCard size={24} />
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Material Type marked as <span className="badge" style={{ margin: '0 4px', background: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', border: '1px solid rgba(251, 146, 60, 0.3)' }}>Expense</span>
          </p>
        </div>
      </div>
    </div>
  );
}
