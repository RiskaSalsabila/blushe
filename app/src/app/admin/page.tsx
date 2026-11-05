'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentRuns, setRecentRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.stats);
          setRecentRuns(data.recentRuns || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>Memuat ringkasan data admin...</div>;
  }

  const statCards = [
    { label: 'Total Merek', value: stats?.brands ?? 0, desc: 'Merek terdaftar aktif' },
    { label: 'Total Produk', value: stats?.products ?? 0, desc: 'Varian produk blush' },
    { label: 'Total Shade (Alternatif)', value: stats?.shades ?? 0, desc: 'Kandidat rekomendasi SPK' },
    { label: 'Kriteria Keputusan', value: stats?.criteria ?? 0, desc: 'C1 hingga C4 aktif' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <div className="eyebrow">Ringkasan Sistem</div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', margin: '6px 0 8px' }}>
          Dashboard Pengelola Blushé
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>
          Pantau status katalog produk-shade, parameter kriteria keputusan, dan riwayat kalkulasi VIKOR.
        </p>
      </div>

      {/* Grid Statistik */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {statCards.map((card, i) => (
          <div
            key={i}
            style={{
              background: 'var(--paper)',
              border: '1px solid var(--line)',
              borderRadius: '16px',
              padding: '22px',
              boxShadow: 'var(--shadow)',
            }}
          >
            <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>{card.label}</div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '38px', color: 'var(--rose-dark)', margin: '10px 0 4px' }}>
              {card.value}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{card.desc}</div>
          </div>
        ))}
      </div>

      {/* Quick Action Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', margin: '0 0 10px' }}>
            Kelola Katalog Alternatif
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
            Perbarui data merek, produk, dan shade (formula, warna hex, harga). Setiap kombinasi produk-shade bertindak sebagai alternatif SPK.
          </p>
          <Link href="/admin/products" className="primary" style={{ marginTop: '12px', fontSize: '12px' }}>
            Buka Katalog Produk →
          </Link>
        </div>

        <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', margin: '0 0 10px' }}>
            Audit & Uji Kalkulasi VIKOR
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
            Lakukan simulasi transparan perhitungan $f^*$, $f^-$, $S$, $R$, $Q$, serta pengujian kondisi kompromi C1 dan C2 untuk keperluan bimbingan.
          </p>
          <Link href="/admin/vikor" className="secondary" style={{ marginTop: '12px', fontSize: '12px' }}>
            Buka Layar Audit VIKOR →
          </Link>
        </div>
      </div>

      {/* Riwayat Rekomendasi Terakhir */}
      <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: '16px', padding: '24px' }}>
        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', margin: '0 0 16px' }}>
          Riwayat Sesi Rekomendasi Pengguna (Audit Trail)
        </h3>
        {recentRuns.length === 0 ? (
          <div style={{ color: 'var(--muted)', fontSize: '12px', padding: '16px 0' }}>
            Belum ada sesi rekomendasi yang tercatat. Coba jalankan wizard pada halaman utama.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--line)', textAlign: 'left', color: 'var(--muted)' }}>
                  <th style={{ padding: '10px 12px' }}>ID</th>
                  <th style={{ padding: '10px 12px' }}>Pengguna</th>
                  <th style={{ padding: '10px 12px' }}>Skin Tone</th>
                  <th style={{ padding: '10px 12px' }}>Undertone</th>
                  <th style={{ padding: '10px 12px' }}>Warna Favorit</th>
                  <th style={{ padding: '10px 12px' }}>Formula</th>
                  <th style={{ padding: '10px 12px' }}>Budget</th>
                  <th style={{ padding: '10px 12px' }}>Kandidat Lolos</th>
                  <th style={{ padding: '10px 12px' }}>Waktu</th>
                </tr>
              </thead>
              <tbody>
                {recentRuns.map((r) => {
                  let colorsStr = r.selected_colors;
                  try {
                    const parsed = JSON.parse(r.selected_colors);
                    colorsStr = Array.isArray(parsed) ? parsed.join(', ') : colorsStr;
                  } catch (e) {}

                  return (
                    <tr key={r.id} style={{ borderBottom: '1px solid #f2ece7' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 600 }}>#{r.id}</td>
                      <td style={{ padding: '10px 12px' }}>
                        {r.user_name ? (
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{r.user_name}</div>
                            <div style={{ fontSize: '10px', color: 'var(--muted)' }}>{r.user_email}</div>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--muted)', fontStyle: 'italic', fontSize: '11px' }}>Tamu</span>
                        )}
                      </td>
                      <td style={{ padding: '10px 12px' }}>{r.skin_tone}</td>
                      <td style={{ padding: '10px 12px' }}>{r.undertone}</td>
                      <td style={{ padding: '10px 12px' }}>{colorsStr || '-'}</td>
                      <td style={{ padding: '10px 12px' }}>{r.selected_formula}</td>
                      <td style={{ padding: '10px 12px' }}>
                        {r.budget_limit === 999999 ? 'Bebas' : `Rp${Number(r.budget_limit).toLocaleString('id-ID')}`}
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ background: '#f8f2ee', padding: '3px 8px', borderRadius: '99px', fontSize: '11px' }}>
                          {r.candidates_count} alternatif
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', color: 'var(--muted)' }}>{r.created_at}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
