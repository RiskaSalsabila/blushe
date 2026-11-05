'use client';

import { useEffect, useState } from 'react';

export default function AdminProductsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [shades, setShades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showAddShade, setShowAddShade] = useState(false);
  const [newShade, setNewShade] = useState({
    productId: '',
    shadeName: '',
    formula: 'Powder',
    colorFamily: 'Pink',
    colorHex: '#d78f9a',
    priceIdr: 75000,
    toneDepth: 'Medium',
    undertoneBias: 'Neutral',
    shadeDescription: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.success) {
        setBrands(data.brands || []);
        setProducts(data.products || []);
        setShades(data.shades || []);
        if (data.products.length > 0 && !newShade.productId) {
          setNewShade((prev) => ({ ...prev, productId: String(data.products[0].id) }));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateShade = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_shade',
          ...newShade,
          productId: Number(newShade.productId),
          priceIdr: Number(newShade.priceIdr),
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Shade berhasil ditambahkan!');
        setShowAddShade(false);
        loadData();
      } else {
        alert(data.message || 'Gagal menambahkan shade');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteShade = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menonaktifkan shade alternatif ini?')) return;
    try {
      const res = await fetch(`/api/admin/products?shadeId=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div className="eyebrow">Manajemen Katalog</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '30px', margin: '4px 0' }}>
            Produk & Shade (Alternatif SPK)
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '12px', margin: 0 }}>
            Setiap baris shade merupakan satu alternatif keputusan dalam model VIKOR.
          </p>
        </div>
        <button className="primary" onClick={() => setShowAddShade(true)}>
          + Tambah Shade Baru
        </button>
      </div>

      {/* Modal Tambah Shade */}
      {showAddShade && (
        <div className="detail-modal show">
          <div className="modal-card" style={{ maxWidth: '560px' }}>
            <button className="modal-close" onClick={() => setShowAddShade(false)}>×</button>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', margin: '0 0 16px' }}>
              Tambah Shade Alternatif Baru
            </h3>
            <form onSubmit={handleCreateShade} style={{ display: 'grid', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>Pilih Produk</label>
                <select
                  value={newShade.productId}
                  onChange={(e) => setNewShade({ ...newShade, productId: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--line)', background: '#fff' }}
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.brand_name} · {p.product_name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>Nama Shade</label>
                  <input
                    type="text"
                    value={newShade.shadeName}
                    onChange={(e) => setNewShade({ ...newShade, shadeName: e.target.value })}
                    required
                    placeholder="Contoh: Coral Glow"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--line)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>Formula</label>
                  <select
                    value={newShade.formula}
                    onChange={(e) => setNewShade({ ...newShade, formula: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--line)', background: '#fff' }}
                  >
                    <option value="Powder">Powder</option>
                    <option value="Liquid">Liquid</option>
                    <option value="Cream">Cream</option>
                    <option value="Stick">Stick</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>Kelompok Warna</label>
                  <select
                    value={newShade.colorFamily}
                    onChange={(e) => setNewShade({ ...newShade, colorFamily: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--line)', background: '#fff' }}
                  >
                    {['Pink', 'Peach', 'Coral', 'Mauve', 'Berry', 'Terracotta'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>Kode Hex Warna</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={newShade.colorHex}
                      onChange={(e) => setNewShade({ ...newShade, colorHex: e.target.value })}
                      style={{ width: '40px', height: '40px', padding: 0, border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      value={newShade.colorHex}
                      onChange={(e) => setNewShade({ ...newShade, colorHex: e.target.value })}
                      style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--line)' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>Kedalaman Skin Tone</label>
                  <select
                    value={newShade.toneDepth}
                    onChange={(e) => setNewShade({ ...newShade, toneDepth: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--line)', background: '#fff' }}
                  >
                    {['Fair', 'Light', 'Medium', 'Tan', 'Deep'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>Undertone Bias</label>
                  <select
                    value={newShade.undertoneBias}
                    onChange={(e) => setNewShade({ ...newShade, undertoneBias: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--line)', background: '#fff' }}
                  >
                    {['Warm', 'Cool', 'Neutral'].map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>Harga (Rupiah)</label>
                <input
                  type="number"
                  value={newShade.priceIdr}
                  onChange={(e) => setNewShade({ ...newShade, priceIdr: Number(e.target.value) })}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--line)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" className="text-btn" onClick={() => setShowAddShade(false)}>Batal</button>
                <button type="submit" className="primary">Simpan Alternatif</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabel Shade */}
      <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px', overflowX: 'auto', boxShadow: 'var(--shadow)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--line)', textAlign: 'left', color: 'var(--muted)' }}>
              <th style={{ padding: '12px' }}>Warna</th>
              <th style={{ padding: '12px' }}>Merek & Produk</th>
              <th style={{ padding: '12px' }}>Shade</th>
              <th style={{ padding: '12px' }}>Formula</th>
              <th style={{ padding: '12px' }}>Kelompok</th>
              <th style={{ padding: '12px' }}>Tone Depth</th>
              <th style={{ padding: '12px' }}>Undertone</th>
              <th style={{ padding: '12px' }}>Harga</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {shades.map((s) => (
              <tr key={s.id} style={{ borderBottom: '1px solid #f4ece6' }}>
                <td style={{ padding: '12px' }}>
                  <span
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: s.color_hex,
                      display: 'inline-block',
                      border: '2px solid #fff',
                      boxShadow: '0 0 0 1px #e0d0c8',
                    }}
                  ></span>
                </td>
                <td style={{ padding: '12px', fontWeight: 600 }}>
                  {s.brand_name} · {s.product_name}
                </td>
                <td style={{ padding: '12px' }}>{s.shade_name}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ background: '#f8f2ee', padding: '3px 8px', borderRadius: '99px', fontSize: '11px' }}>
                    {s.formula}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>{s.color_family}</td>
                <td style={{ padding: '12px' }}>{s.tone_depth || 'Medium'}</td>
                <td style={{ padding: '12px' }}>{s.undertone_bias || 'Neutral'}</td>
                <td style={{ padding: '12px', fontWeight: 600 }}>
                  Rp{Number(s.price_idr).toLocaleString('id-ID')}
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  <button
                    onClick={() => handleDeleteShade(s.id)}
                    style={{ background: 'none', border: 'none', color: '#c53030', cursor: 'pointer', fontSize: '11px' }}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
