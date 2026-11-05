'use client';

import { useEffect, useState } from 'react';

export default function AdminCriteriaPage() {
  const [criteria, setCriteria] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const loadCriteria = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/criteria');
      const data = await res.json();
      if (data.success) {
        setCriteria(data.criteria || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCriteria();
  }, []);

  const totalWeight = criteria.reduce((sum, c) => sum + (Number(c.weight) || 0), 0);
  const isWeightValid = Math.abs(totalWeight - 1.0) < 0.001;

  const handleWeightChange = (index: number, val: number) => {
    const updated = [...criteria];
    updated[index].weight = val;
    setCriteria(updated);
  };

  const handleTypeChange = (index: number, val: string) => {
    const updated = [...criteria];
    updated[index].type = val;
    setCriteria(updated);
  };

  const handleSave = async () => {
    try {
      const res = await fetch('/api/admin/criteria', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ criteria }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Konfigurasi bobot dan arah kriteria berhasil disimpan!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        alert(data.message);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <div className="eyebrow">Parameter VIKOR</div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '30px', margin: '4px 0' }}>
          Kriteria, Bobot, & Arah Optimasi
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>
          Pengaturan fleksibel bobot kriteria ($w_j$) dan arah (Benefit / Cost) untuk eksperimen penelitian.
        </p>
      </div>

      {message && (
        <div style={{ background: '#def7ec', color: '#03543f', padding: '12px 16px', borderRadius: '10px', fontSize: '12px', marginBottom: '16px' }}>
          {message}
        </div>
      )}

      {/* Warning total bobot */}
      <div
        style={{
          background: isWeightValid ? '#f0fdf4' : '#fffbeb',
          border: `1px solid ${isWeightValid ? '#bbf7d0' : '#fde68a'}`,
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <b style={{ color: isWeightValid ? '#15803d' : '#b45309', fontSize: '13px' }}>
            Total Bobot: {Number(totalWeight.toFixed(4))}
          </b>
          <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
            {isWeightValid
              ? '✓ Total bobot memenuhi syarat tepat 1.0 (100%).'
              : '⚠ Total bobot harus berjumlah 1.0. Sistem akan otomatis menormalkan jika belum tepat 1.0 saat kalkulasi.'}
          </div>
        </div>
        <button className="primary" onClick={handleSave} disabled={loading}>
          Simpan Perubahan
        </button>
      </div>

      {/* Tabel Kriteria */}
      <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px', boxShadow: 'var(--shadow)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--line)', textAlign: 'left', color: 'var(--muted)' }}>
              <th style={{ padding: '12px' }}>Kode</th>
              <th style={{ padding: '12px' }}>Nama Kriteria</th>
              <th style={{ padding: '12px' }}>Deskripsi</th>
              <th style={{ padding: '12px' }}>Arah Optimasi</th>
              <th style={{ padding: '12px' }}>Bobot (w)</th>
            </tr>
          </thead>
          <tbody>
            {criteria.map((c, index) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #f2ece7' }}>
                <td style={{ padding: '12px', fontWeight: 700, color: 'var(--rose-dark)' }}>{c.code}</td>
                <td style={{ padding: '12px', fontWeight: 600 }}>{c.name}</td>
                <td style={{ padding: '12px', color: 'var(--muted)' }}>{c.description}</td>
                <td style={{ padding: '12px' }}>
                  <select
                    value={c.type}
                    onChange={(e) => handleTypeChange(index, e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--line)', background: '#fff', fontSize: '12px' }}
                  >
                    <option value="benefit">Benefit (Maksimal)</option>
                    <option value="cost">Cost (Minimal)</option>
                  </select>
                </td>
                <td style={{ padding: '12px' }}>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="1"
                    value={c.weight}
                    onChange={(e) => handleWeightChange(index, parseFloat(e.target.value) || 0)}
                    style={{ width: '80px', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--line)', fontSize: '12px' }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
