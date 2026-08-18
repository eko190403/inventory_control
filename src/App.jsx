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
      <header className="app-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="app-title text-gradient">Data Dashboard</h1>
          <p className="app-subtitle">Logistics & Goods Receipt Monitoring</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Upload Button */}
          <div style={{ background: 'var(--bg-card)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center' }}>
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
              <span>Add Excel Data</span>
            </button>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-card)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} style={{ color: 'var(--text-secondary)' }} />
              <select 
                value={filterMode} 
                onChange={e => { setFilterMode(e.target.value); setStartDate(''); setEndDate(''); setMonthValue(''); }}
                style={{ background: 'var(--bg-dark)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '0.4rem', borderRadius: '6px', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                <option value="range">Date Range</option>
                <option value="month">By Month</option>
              </select>
            </div>
            
            <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }}></div>
            
            {filterMode === 'range' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="search-input"
                  style={{ padding: '0.4rem', width: 'auto', background: 'rgba(0,0,0,0.2)' }}
                  title="Start Date"
                />
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>to</span>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="search-input"
                  style={{ padding: '0.4rem', width: 'auto', background: 'rgba(0,0,0,0.2)' }}
                  title="End Date"
                />
              </div>
            ) : (
              <input 
                type="month" 
                value={monthValue}
                onChange={e => setMonthValue(e.target.value)}
                className="search-input"
                style={{ padding: '0.4rem', width: 'auto', background: 'rgba(0,0,0,0.2)' }}
              />
            )}

            {(startDate || endDate || monthValue) && (
              <button 
                onClick={() => { setStartDate(''); setEndDate(''); setMonthValue(''); }}
                style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.25rem' }}
                title="Clear Filter"
              >
                <X size={18} />
              </button>
            )}
          </div>
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
