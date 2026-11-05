'use client';

import { useState } from 'react';

export default function AdminVikorAuditPage() {
  const [tone, setTone] = useState('Medium');
  const [undertone, setUndertone] = useState('Warm');
  const [colors, setColors] = useState<string[]>(['Peach', 'Coral']);
  const [formula, setFormula] = useState('Powder');
  const [budget, setBudget] = useState(100000);
  const [loading, setLoading] = useState(false);
  const [auditData, setAuditData] = useState<any>(null);

  const runAudit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tone,
          undertone,
          colors,
          formula,
          budget,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAuditData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <div className="eyebrow">Validasi Matematis</div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '30px', margin: '4px 0' }}>
          Audit & Pemeriksaan Perhitungan VIKOR
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>
          Gunakan layar ini untuk memvalidasi langkah perhitungan $f^*, f^-, S, R, Q$ dan kondisi kompromi saat bimbingan atau ujian skripsi.
        </p>
      </div>

      {/* Simulator Inputs */}
      <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: 'var(--shadow)' }}>
        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', margin: '0 0 16px' }}>
          Parameter Uji Simulasi Pengguna
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>Skin Tone</label>
            <select value={tone} onChange={(e) => setTone(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--line)', background: '#fff', fontSize: '12px' }}>
              {['Fair', 'Light', 'Medium', 'Tan', 'Deep'].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>Undertone</label>
            <select value={undertone} onChange={(e) => setUndertone(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--line)', background: '#fff', fontSize: '12px' }}>
              {['Warm', 'Cool', 'Neutral'].map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>Formula Filter</label>
            <select value={formula} onChange={(e) => setFormula(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--line)', background: '#fff', fontSize: '12px' }}>
              {['Powder', 'Liquid', 'Cream', 'Stick', 'No preference'].map((f) => <option key={f} value={f}>{f === 'No preference' ? 'Bebas' : f}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>Batas Anggaran</label>
            <select value={budget} onChange={(e) => setBudget(Number(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--line)', background: '#fff', fontSize: '12px' }}>
              <option value={50000}>Maks. Rp50.000</option>
              <option value={100000}>Maks. Rp100.000</option>
              <option value={150000}>Maks. Rp150.000</option>
              <option value={999999}>Tanpa Batas</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '6px' }}>Preferensi Warna (Multi-select)</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['Pink', 'Peach', 'Coral', 'Mauve', 'Berry', 'Terracotta'].map((c) => {
              const active = colors.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColors(active ? colors.filter((x) => x !== c) : [...colors, c])}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '99px',
                    border: `1px solid ${active ? 'var(--rose-dark)' : 'var(--line)'}`,
                    background: active ? 'var(--rose-light)' : '#fff',
                    color: active ? 'var(--rose-dark)' : 'var(--ink)',
                    fontSize: '11px',
                    fontWeight: active ? 600 : 400,
                    cursor: 'pointer',
                  }}
                >
                  {c} {active ? '✓' : ''}
                </button>
              );
            })}
          </div>
        </div>

        <button className="primary" onClick={runAudit} disabled={loading} style={{ marginTop: '20px' }}>
          {loading ? 'Menghitung VIKOR...' : 'Jalankan Audit VIKOR'}
        </button>
      </div>

      {/* Output Audit */}
      {auditData && (
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Summary Audit Card */}
          <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', margin: '0 0 14px' }}>
              Hasil Evaluasi VIKOR & Syarat Solusi Kompromi
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
              <div style={{ padding: '12px', background: '#faf5f1', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Kandidat Lolos Filter</div>
                <b style={{ fontSize: '18px', color: 'var(--ink)' }}>{auditData.candidatesCount} alternatif</b>
              </div>
              <div style={{ padding: '12px', background: '#faf5f1', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Threshold Keunggulan (DQ)</div>
                <b style={{ fontSize: '18px', color: 'var(--ink)' }}>DQ = {auditData.audit?.DQ ?? '-'}</b>
                <div style={{ fontSize: '10px', color: 'var(--muted)' }}>1 / (m - 1)</div>
              </div>
              <div style={{ padding: '12px', background: '#faf5f1', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>C1: Acceptable Advantage</div>
                <b style={{ fontSize: '14px', color: auditData.audit?.acceptableAdvantage ? 'var(--green)' : '#c53030' }}>
                  {auditData.audit?.acceptableAdvantage ? '✓ Terpenuhi' : '✕ Tidak Terpenuhi'}
                </b>
              </div>
              <div style={{ padding: '12px', background: '#faf5f1', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>C2: Acceptable Stability</div>
                <b style={{ fontSize: '14px', color: auditData.audit?.acceptableStability ? 'var(--green)' : '#c53030' }}>
                  {auditData.audit?.acceptableStability ? '✓ Terpenuhi' : '✕ Tidak Terpenuhi'}
                </b>
              </div>
            </div>

            {/* Tabel Peringkat */}
            <h4 style={{ fontSize: '14px', margin: '0 0 10px' }}>Tabel Nilai Indeks Kompromi (Q) & Peringkat Alternatif</h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--line)', textAlign: 'left', color: 'var(--muted)' }}>
                    <th style={{ padding: '10px' }}>Rank</th>
                    <th style={{ padding: '10px' }}>Alternatif (Produk & Shade)</th>
                    <th style={{ padding: '10px' }}>Formula</th>
                    <th style={{ padding: '10px' }}>Harga</th>
                    <th style={{ padding: '10px' }}>Utility (S)</th>
                    <th style={{ padding: '10px' }}>Regret (R)</th>
                    <th style={{ padding: '10px' }}>Indeks (Q)</th>
                    <th style={{ padding: '10px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {auditData.results.map((r: any) => (
                    <tr key={r.alternativeId} style={{ borderBottom: '1px solid #f4ece6' }}>
                      <td style={{ padding: '10px', fontWeight: 700, color: 'var(--rose-dark)' }}>#{r.rank}</td>
                      <td style={{ padding: '10px', fontWeight: 600 }}>{r.name}</td>
                      <td style={{ padding: '10px' }}>{r.formula}</td>
                      <td style={{ padding: '10px' }}>Rp{Number(r.price).toLocaleString('id-ID')}</td>
                      <td style={{ padding: '10px' }}>{r.S}</td>
                      <td style={{ padding: '10px' }}>{r.R}</td>
                      <td style={{ padding: '10px', fontWeight: 700 }}>{r.Q}</td>
                      <td style={{ padding: '10px' }}>
                        {r.isCompromise ? (
                          <span style={{ background: '#def7ec', color: '#03543f', padding: '3px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: 600 }}>
                            Solusi Kompromi
                          </span>
                        ) : (
                          <span style={{ color: 'var(--muted)', fontSize: '11px' }}>Alternatif</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
