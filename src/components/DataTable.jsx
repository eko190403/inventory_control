import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DataTable({ data }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerSearch = searchTerm.toLowerCase();
    return data.filter(item => {
      const tmr = (item['TMR Number'] || '').toString().toLowerCase();
      const material = (item['Material'] || '').toString().toLowerCase();
      const text = (item['Short Text'] || '').toString().toLowerCase();
      const dest = (item['Destination.1'] || '').toString().toLowerCase();
      return tmr.includes(lowerSearch) || 
             material.includes(lowerSearch) || 
             text.includes(lowerSearch) ||
             dest.includes(lowerSearch);
    });
  }, [data, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="glass-card" style={{ padding: '2rem' }}>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Data Records
          <span className="badge neutral">{filteredData.length}</span>
        </h2>
        
        <div className="search-container">
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search by TMR, Material, or Dest..." 
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>TMR Number</th>
              <th>Material</th>
              <th>Short Text</th>
              <th>Destination</th>
              <th>Qty TMR</th>
              <th>Status TMR</th>
              <th>Status GR</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? currentData.map((row, idx) => {
              // Determine Status TMR Badge
              const statusTmr = row['Status TMR'] || 'Unknown';
              let badgeTmrClass = 'neutral';
              if (statusTmr === 'Delivered') badgeTmrClass = 'success';
              else if (statusTmr === 'On Process') badgeTmrClass = 'info';
              else if (statusTmr === 'Dispatch') badgeTmrClass = 'warning';

              // Determine Status GR Badge
              const statusGr = row['Status Keterangan GR'] || '-';
              let badgeGrClass = 'neutral';
              if (statusGr === 'Sudah GR') badgeGrClass = 'success';
              else if (statusGr === 'Belum GR') badgeGrClass = 'warning';

              return (
                <tr key={idx}>
                  <td style={{ fontWeight: 600 }}>{row['TMR Number'] || '-'}</td>
                  <td style={{ color: 'var(--brand-blue)' }}>{row['Material'] || '-'}</td>
                  <td style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={row['Short Text']}>
                    {row['Short Text'] || '-'}
                  </td>
                  <td>{row['Destination.1'] || '-'}</td>
                  <td style={{ fontWeight: 500 }}>{row['Quantity TMR'] || 0}</td>
                  <td>
                    <span className={`badge ${badgeTmrClass}`}>
                      {statusTmr}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${badgeGrClass}`}>
                      {statusGr}
                    </span>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <Search size={32} style={{ opacity: 0.5 }} />
                    <p>No records found matching "{searchTerm}"</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex-between" style={{ marginTop: '1.5rem' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Showing {currentData.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} to {Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length} records
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className="btn" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <button 
            className="btn" 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
