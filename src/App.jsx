import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Calendar, X, UploadCloud, DownloadCloud } from 'lucide-react';
import { read, utils, writeFile } from 'xlsx';
import { supabase } from './supabaseClient';

import SummaryCards from './components/SummaryCards';
import DashboardCharts from './components/DashboardCharts';
import DataTable from './components/DataTable';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);

  // Filter state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [matlGroupFilter, setMatlGroupFilter] = useState('');

  useEffect(() => {
    const fetchFromSupabase = async () => {
      try {
        let allData = [];
        let from = 0;
        const step = 1000;
        
        // Fetch data in chunks to bypass 1000 row limit
        while (true) {
          const { data: chunk, error } = await supabase
            .from('inventory_records')
            .select('*')
            .range(from, from + step - 1);
            
          if (error) throw error;
          if (!chunk || chunk.length === 0) break;
          
          allData = [...allData, ...chunk];
          if (chunk.length < step) break;
          from += step;
        }
        
        // Map database columns back to original keys needed by components
        const mappedData = allData.map(row => ({
          'TMR Number': row.tmr_number,
          'Purchasing Document': row.purchasing_document,
          'Material': row.material,
          'Short Text': row.short_text,
          'Status TMR': row.status_tmr,
          'Status Keterangan GR': row.status_keterangan_gr,
          'Destination.1': row.destination_1,
          'Shipping Date': row.shipping_date,
          'GR Date TMR': row.gr_date_tmr,
          'Matl. Group': row.material_type,
          'Quantity TMR': row.quantity_tmr,
          'Material Document': row.material_document
        }));
        
        setData(mappedData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchFromSupabase();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const arrayBuffer = evt.target.result;
        const wb = read(arrayBuffer, { type: 'array' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        
        const rawDataArray = utils.sheet_to_json(ws, { header: 1 });
        let headerRowIndex = 0;
        for (let i = 0; i < Math.min(20, rawDataArray.length); i++) {
          if (rawDataArray[i] && rawDataArray[i].includes('TMR Number')) {
            headerRowIndex = i;
            break;
          }
        }
        
        const dataJson = utils.sheet_to_json(ws, { raw: false, range: headerRowIndex });
        
        if (dataJson.length === 0) {
          alert('File Excel kosong atau tidak bisa dibaca!');
          setLoading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
        }

        if (!('TMR Number' in dataJson[0])) {
          alert('Format Excel salah! Tidak ditemukan kolom: TMR Number');
          setLoading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
        }

        // Map keys to Supabase format (ONLY ALLOWED KEYS to prevent insert crash)
        const allowedKeys = [
          'tmr_number', 'purchasing_document', 'material', 'short_text', 'status_tmr', 
          'status_keterangan_gr', 'destination_1', 'shipping_date', 'gr_date_tmr',
          'material_type', 'material_document', 'quantity_tmr'
        ];
        
        const cleanedData = dataJson.map(row => {
          const cleanedRow = {};
          for (const key in row) {
             const cleanKey = key.replace(/ /g, '_').replace(/\./g, '_').replace(/\//g, '_').toLowerCase();
             if (allowedKeys.includes(cleanKey)) {
                 cleanedRow[cleanKey] = String(row[key]);
             }
             // Fallback for destination
             if (cleanKey === 'destination' && !row['Destination.1']) {
                 cleanedRow['destination_1'] = String(row[key]);
             }
             // Mapping Matl.Group to material_type
             if (cleanKey === 'matl_group') {
                 cleanedRow['material_type'] = String(row[key]).trim();
             }
             // Parsing Quantity TMR (take number before comma)
             if (cleanKey === 'quantity_tmr') {
                 let rawQty = String(row[key]);
                 if (rawQty.includes(',')) {
                     rawQty = rawQty.split(',')[0];
                 }
                 cleanedRow['quantity_tmr'] = rawQty.trim();
             }
          }
          
          // AUTO-CALCULATE 'Status Keterangan GR'
          // Logic: If Material Document exists, it's SUDAH GR
          if (row['Material Document']) {
              cleanedRow['status_keterangan_gr'] = 'SUDAH GR';
          } else {
              cleanedRow['status_keterangan_gr'] = 'BELUM GR';
          }
          
          return cleanedRow;
        });

        // 1. Delete old data
        const { error: delError } = await supabase.from('inventory_records').delete().neq('id', 0);
        if (delError) {
          console.error('Delete error:', delError);
        }

        // 2. Insert new data in chunks
        const chunkSize = 500;
        for (let i = 0; i < cleanedData.length; i += chunkSize) {
          const chunk = cleanedData.slice(i, i + chunkSize);
          const { error: insertError } = await supabase.from('inventory_records').insert(chunk);
          if (insertError) {
             console.error('Insert error chunk', i, insertError);
             alert('Error menyimpan data: ' + insertError.message);
             setLoading(false);
             return; // abort
          }
        }
        
        alert('Sukses! Data Excel berhasil diunggah dan disimpan ke Database Supabase.');
        // Reload to fetch the newly uploaded data
        window.location.reload();

      } catch (err) {
        console.error(err);
        alert('Gagal mengunggah file. ' + err.message);
        setLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.onerror = () => {
      alert('Gagal membaca file');
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsArrayBuffer(file);
  };

  const handleExport = () => {
    if (!filteredData.length) {
      alert("No data to export");
      return;
    }
    const ws = utils.json_to_sheet(filteredData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Filtered Data");
    writeFile(wb, "export_data.xlsx");
  };

  const filteredData = useMemo(() => {
    if (!data.length) return [];
    
    return data.filter(item => {
      let valid = true;
      
      // Filter GR Date TMR Range
      if (startDate || endDate) {
        const dStr = item['GR Date TMR'] || ''; 
        const itemDate = dStr.substring(0, 10);
        if (!itemDate) valid = false;
        if (startDate && itemDate < startDate) valid = false;
        if (endDate && itemDate > endDate) valid = false;
      }
      
      // Filter Status TMR
      if (statusFilter && item['Status TMR'] !== statusFilter) {
        valid = false;
      }
      
      // Filter Matl. Group
      if (matlGroupFilter) {
         const matl = item['Matl. Group'] || '';
         if (!matl.toLowerCase().includes(matlGroupFilter.toLowerCase())) {
             valid = false;
         }
      }

      return valid;
    });
  }, [data, startDate, endDate, statusFilter, matlGroupFilter]);
  
  // Unique Options for Status TMR
  const statusOptions = useMemo(() => {
     const statuses = data.map(d => d['Status TMR']).filter(Boolean);
     return [...new Set(statuses)];
  }, [data]);


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

          <button 
            className="btn"
            style={{ background: 'var(--brand-purple)', color: '#fff', border: 'none', marginLeft: '0.5rem' }}
            onClick={handleExport}
            disabled={!filteredData.length}
          >
            <DownloadCloud size={18} />
            <span>Export Data</span>
          </button>

          <div style={{ width: '1px', height: '24px', background: 'var(--border-strong)', margin: '0 0.5rem' }}></div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {/* GR Date Range Filter */}
            <div className="input-group date-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={16} style={{ color: 'var(--text-secondary)' }} />
              <input 
                type="date" 
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="input-field date-input"
                style={{ background: 'transparent', color: 'var(--text-primary)', border: 'none', outline: 'none' }}
                title="Start GR Date"
              />
              <span style={{ color: 'var(--text-secondary)' }}>-</span>
              <input 
                type="date" 
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="input-field date-input"
                style={{ background: 'transparent', color: 'var(--text-primary)', border: 'none', outline: 'none' }}
                title="End GR Date"
              />
            </div>

            {/* Status TMR Filter */}
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              className="input-group"
              style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '0.4rem', outline: 'none' }}
            >
              <option value="">Semua Status TMR</option>
              {statusOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>

            {/* Matl Group Filter */}
            <select 
              value={matlGroupFilter} 
              onChange={e => setMatlGroupFilter(e.target.value)}
              className="input-group"
              style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '0.4rem', outline: 'none' }}
            >
              <option value="">Semua Matl Group</option>
              <option value="Inventory">Inventory</option>
              <option value="Expense">Expense (OB)</option>
            </select>

            {(startDate || endDate || statusFilter || matlGroupFilter) && (
              <button 
                onClick={() => { setStartDate(''); setEndDate(''); setStatusFilter(''); setMatlGroupFilter(''); }}
                className="icon-button danger"
                title="Clear Filters"
                style={{ padding: '0.4rem' }}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </header>

      <main>
        <SummaryCards data={filteredData} />
        <DashboardCharts data={filteredData} />
        <DataTable data={filteredData} />
      </main>
    </div>
  );
}

export default App;
