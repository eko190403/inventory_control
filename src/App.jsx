import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Calendar, X, UploadCloud } from 'lucide-react';
import { read, utils } from 'xlsx';
import SummaryCards from './components/SummaryCards';
import DataTable from './components/DataTable';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);

  // Filter state
  const [filterMode, setFilterMode] = useState('range'); // 'range' or 'month'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [monthValue, setMonthValue] = useState('');

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'data.json')
      .then(response => {
        if (!response.ok) throw new Error('Failed to load data');
        return response.json();
      })
      .then(jsonData => {
        setData(jsonData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const arrayBuffer = evt.target.result;
        const wb = read(arrayBuffer, { type: 'array' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        // Convert sheet to json
        // raw: false ensures dates are parsed as strings instead of Excel date numbers
        const dataJson = utils.sheet_to_json(ws, { raw: false });
        
        // Replace existing data with new data
        setData(dataJson);
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Failed to parse Excel file. Please ensure it's a valid .xlsx or .xls file.");
        setLoading(false);
      }
    };
    reader.onerror = () => {
      alert("Failed to read file");
      setLoading(false);
    };
    reader.readAsArrayBuffer(file);
  };

  const filteredData = useMemo(() => {
    if (!data.length) return [];
    
    if (filterMode === 'range' && (startDate || endDate)) {
      return data.filter(item => {
        const dStr = item['Shipping Date'] || item['GR Date TMR'] || ''; 
        const itemDate = dStr.substring(0, 10);
        if (!itemDate) return false;

        let valid = true;
        if (startDate && itemDate < startDate) valid = false;
        if (endDate && itemDate > endDate) valid = false;
        
        return valid;
      });
    } else if (filterMode === 'month' && monthValue) {
      return data.filter(item => {
        const d = item['Shipping Date'] || item['GR Date TMR'] || ''; 
        return d.startsWith(monthValue);
      });
    }
    
    return data;
  }, [data, filterMode, startDate, endDate, monthValue]);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Loading dataset...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loader-container" style={{ color: 'var(--danger)' }}>
        <h2>Error Loading Data</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div>
          <h1 className="app-title text-gradient">Logistics Dashboard</h1>
          <p className="app-subtitle">Goods Receipt & Inventory Monitoring System</p>
        </div>
        
        <div className="toolbar glass-panel">
          {/* Upload Button */}
          <input 
            type="file" 
            accept=".xlsx, .xls, .csv" 
            style={{ display: 'none' }} 
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <button 
            className="btn btn-primary"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud size={18} />
            <span>Upload Data</span>
          </button>

          <div style={{ width: '1px', height: '24px', background: 'var(--border-strong)', margin: '0 0.5rem' }}></div>

          {/* Filters */}
          <div className="input-group">
            <Calendar size={16} style={{ color: 'var(--text-secondary)' }} />
            <select 
              value={filterMode} 
              onChange={e => { setFilterMode(e.target.value); setStartDate(''); setEndDate(''); setMonthValue(''); }}
              style={{ background: 'transparent', color: 'var(--text-primary)', border: 'none', outline: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '0.2rem' }}
            >
              <option value="range" style={{ background: 'var(--bg-card)' }}>Range Date</option>
              <option value="month" style={{ background: 'var(--bg-card)' }}>By Month</option>
            </select>
          </div>
          
          {filterMode === 'range' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="input-group">
                <input 
                  type="date" 
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="search-input"
                  style={{ padding: '0', background: 'transparent' }}
                  title="Start Date"
                />
              </div>
              <span style={{ color: 'var(--text-secondary)' }}>-</span>
              <div className="input-group">
                <input 
                  type="date" 
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="search-input"
                  style={{ padding: '0', background: 'transparent' }}
                  title="End Date"
                />
              </div>
            </div>
          ) : (
            <div className="input-group">
              <input 
                type="month" 
                value={monthValue}
                onChange={e => setMonthValue(e.target.value)}
                className="search-input"
                style={{ padding: '0', background: 'transparent' }}
              />
            </div>
          )}

          {(startDate || endDate || monthValue) && (
            <button 
              onClick={() => { setStartDate(''); setEndDate(''); setMonthValue(''); }}
              className="icon-button danger"
              title="Clear Filter"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </header>

      <main>
        <SummaryCards data={filteredData} />
        <DataTable data={filteredData} />
      </main>
    </div>
  );
}

export default App;
