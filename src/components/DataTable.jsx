import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Database, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

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
        return (
          (item['TMR Number'] || '').toLowerCase().includes(lowerSearch) ||
          (item['Purchasing Document'] || '').toLowerCase().includes(lowerSearch) ||
          (item['Material'] || '').toLowerCase().includes(lowerSearch) ||
          (item['Short Text'] || '').toLowerCase().includes(lowerSearch)
        );
      });
    }

    if (sortConfig) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
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
              <th onClick={() => requestSort('TMR Number')} style={{ cursor: 'pointer', minWidth: '130px', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  TMR Number {renderSortIcon('TMR Number')}
                </div>
              </th>
              <th onClick={() => requestSort('Purchasing Document')} style={{ cursor: 'pointer', minWidth: '150px', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Purchasing Doc {renderSortIcon('Purchasing Document')}
                </div>
              </th>
              <th onClick={() => requestSort('GR Date TMR')} style={{ cursor: 'pointer', minWidth: '130px', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  GR Date TMR {renderSortIcon('GR Date TMR')}
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
              <th onClick={() => requestSort('Material Document')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Material Document {renderSortIcon('Material Document')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((row, idx) => (
                <tr key={idx} onClick={() => setSelectedRow(row)} style={{ cursor: 'pointer' }}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{row['TMR Number'] || '-'}</td>
                  <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{row['Purchasing Document'] || '-'}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{row['GR Date TMR'] || '-'}</td>
                  <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--brand-blue)', fontWeight: 500 }} title={row['Short Text']}>
                    {row['Short Text'] || '-'}
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{row['Destination.1'] || '-'}</td>
                  <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{row['Material Document'] || '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <Search size={48} style={{ opacity: 0.2 }} />
                    <p>No records found matching your filters</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="btn btn-outline"
            style={{ padding: '0.5rem' }}
          >
            <ChevronLeft size={20} />
          </button>
          
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Page <strong style={{ color: 'var(--text-primary)' }}>{currentPage}</strong> of {totalPages}
          </span>
          
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="btn btn-outline"
            style={{ padding: '0.5rem' }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
