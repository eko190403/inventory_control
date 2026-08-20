import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Filter, Database, ArrowUpDown, ArrowUp, ArrowDown, X } from 'lucide-react';

export default function DataTable({ data }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const rowsPerPage = 50;

  const filteredData = useMemo(() => {
    let result = data;
    
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(item => {
        const tmr = (item['TMR Number'] || '').toString().toLowerCase();
        const pd = (item['Purchasing Document'] || '').toString().toLowerCase();
        const material = (item['Material'] || '').toString().toLowerCase();
        const text = (item['Short Text'] || '').toString().toLowerCase();
        return tmr.includes(lowerSearch) || 
               pd.includes(lowerSearch) ||
               material.includes(lowerSearch) || 
               text.includes(lowerSearch);
      });
    }

    if (sortConfig !== null) {
      result = [...result].sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];
        
        // Handle null/undefined
        if (valA == null) valA = '';
        if (valB == null) valB = '';

        if (valA < valB) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, sortConfig]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };
  
  const handleTmrFilterChange = (e) => {
    setStatusTmrFilter(e.target.value);
    setCurrentPage(1);
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const renderSortIcon = (columnKey) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ArrowUpDown size={14} style={{ opacity: 0.3 }} />;
    }
    if (sortConfig.direction === 'ascending') {
      return <ArrowUp size={14} style={{ color: 'var(--brand-blue)' }} />;
    }
    return <ArrowDown size={14} style={{ color: 'var(--brand-blue)' }} />;
  };

  return (
    <div style={{ marginTop: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem' }}>
          <Database className="text-gradient" />
          Data Records
          <span className="badge neutral" style={{ marginLeft: '0.5rem', fontSize: '0.85rem' }}>{filteredData.length.toLocaleString('id-ID')} Total</span>
        </h2>
        
        <div className="controls-bar">
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', minWidth: '250px' }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search TMR, Pur.Doc, Material..." 
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => requestSort('Purchasing Document')} style={{ cursor: 'pointer', minWidth: '150px', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Purchasing Doc {renderSortIcon('Purchasing Document')}
                </div>
              </th>
              <th onClick={() => requestSort('TMR Number')} style={{ cursor: 'pointer', minWidth: '130px', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  TMR Number {renderSortIcon('TMR Number')}
                </div>
              </th>
              <th onClick={() => requestSort('Short Text')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Short Text {renderSortIcon('Short Text')}
                </div>
              </th>
              <th onClick={() => requestSort('Destination.1')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Destination {renderSortIcon('Destination.1')}
                </div>
              </th>
              <th onClick={() => requestSort('Matl. Group')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Matl. Group {renderSortIcon('Matl. Group')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? currentData.map((row, idx) => {
              const statusTmr = row['Status TMR'] || 'Unknown';
              let badgeTmrClass = 'neutral';
              if (statusTmr === 'Delivered') badgeTmrClass = 'success';
              else if (statusTmr === 'On Process') badgeTmrClass = 'info';
              else if (statusTmr === 'Dispatch') badgeTmrClass = 'warning';

              const statusGr = row['Status Keterangan GR'] || '-';
              let badgeGrClass = 'neutral';
              if (statusGr === 'Sudah GR') badgeGrClass = 'success';
              else if (statusGr === 'Belum GR') badgeGrClass = 'warning';

              return (
                <tr key={idx} onClick={() => setSelectedRow(row)} style={{ cursor: 'pointer' }}>
                  <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{row['Purchasing Document'] || '-'}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{row['TMR Number'] || '-'}</td>
                  <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--brand-blue)', fontWeight: 500 }} title={row['Short Text']}>
                    {row['Short Text'] || '-'}
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{row['Destination.1'] || '-'}</td>
                  <td><span className="badge info">{row['Matl. Group'] || '-'}</span></td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '6rem 2rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <Search size={48} style={{ opacity: 0.2 }} />
                    <p style={{ fontSize: '1.1rem' }}>No records found matching your filters</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', padding: '0 0.5rem' }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Showing <strong style={{ color: 'var(--text-primary)' }}>{currentData.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}</strong> to <strong style={{ color: 'var(--text-primary)' }}>{Math.min(currentPage * rowsPerPage, filteredData.length)}</strong> of <strong style={{ color: 'var(--text-primary)' }}>{filteredData.length.toLocaleString('id-ID')}</strong> records
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
            <ChevronLeft size={18} /> Prev
          </button>
          <button className="btn" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)}>
            Next <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Row Detail Modal */}
      {selectedRow && (
        <div className="modal-overlay" onClick={() => setSelectedRow(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>Detail Data</h3>
              <button 
                onClick={() => setSelectedRow(null)} 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.25rem', display: 'flex' }}
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              {Object.keys(selectedRow).map((key, idx) => {
                if (selectedRow[key] == null) return null; // skip null values
                return (
                  <div className="detail-row" key={idx}>
                    <span className="detail-label">{key}</span>
                    <span className="detail-value">{String(selectedRow[key])}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
