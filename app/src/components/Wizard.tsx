'use client';

import { useState } from 'react';
import ProductDetailModal, { ModalProductData } from './ProductDetailModal';

interface WizardState {
  tone: string | null;
  undertone: string | null;
  colors: string[];
  formula: string | null;
  budget: number | null;
}

const titles = [
  '01 / Karakteristik kulit',
  '02 / Preferensi warna & formula',
  '03 / Anggaran',
  '04 / Hasil rekomendasi',
];

export default function Wizard() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<WizardState>({
    tone: null,
    undertone: null,
    colors: [],
    formula: null,
    budget: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ModalProductData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRecommendations = async (customState?: WizardState) => {
    setIsLoading(true);
    const targetState = customState || state;
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(targetState),
      });
      const data = await res.json();
      if (data.success) {
        setIsEmpty(data.isEmpty || data.results.length === 0);
        setResults(data.results || []);
      }
    } catch (e) {
      console.error('Failed to fetch recommendations:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const validate = () => {
    if (step === 0 && (!state.tone || !state.undertone)) {
      alert('Pilih skin tone dan undertone terlebih dahulu.');
      return false;
    }
    if (step === 1 && (state.colors.length === 0 || !state.formula)) {
      alert('Pilih minimal satu warna dan satu formula.');
      return false;
    }
    if (step === 2 && !state.budget) {
      alert('Pilih rentang anggaran terlebih dahulu.');
      return false;
    }
    return true;
  };

  const goStep = (dir: number) => {
    if (dir > 0 && !validate()) return;
    const nextStep = Math.max(0, Math.min(3, step + dir));
    setStep(nextStep);

    if (nextStep === 3) {
      fetchRecommendations();
      const el = document.getElementById('prototype');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const resetPrototype = () => {
    setState({
      tone: null,
      undertone: null,
      colors: [],
      formula: null,
      budget: null,
    });
    setStep(0);
    setResults([]);
    setIsEmpty(false);
    const el = document.getElementById('prototype');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const editPreferences = () => {
    setStep(2);
    const el = document.getElementById('prototype');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const openDetail = (item: any) => {
    setSelectedProduct({
      brand: item.brand || 'Blushé Brand',
      name: item.metadata?.productName || item.name || 'Cloud Blush',
      shade: item.shade || 'Natural Glow',
      formula: item.formula || 'Powder',
      price: item.price || 78000,
      hex: item.colorHex || '#cf8583',
      desc: item.metadata?.desc || 'Alternatif blush on berkualitas dengan pigmentasi halus.',
      color: item.metadata?.colorFamily || 'Pink',
    });
    setIsModalOpen(true);
  };

  return (
    <section className="app-shell" id="prototype">
      <div className="app-wrap">
        <div className="app-heading">
          <div className="eyebrow">Your shade finder</div>
          <h2>Mulai eksplorasi shade</h2>
          <p>Lengkapi pilihan berikut untuk melihat contoh alur rekomendasi.</p>
        </div>

        <div className="wizard">
          <div className="wizard-top">
            <strong id="wizardTitle">{titles[step]}</strong>
            <span className="step-label" id="stepCount">
              LANGKAH {step + 1} DARI 4
            </span>
          </div>
          <div className="progress">
            <span id="progressBar" style={{ width: `${(step + 1) * 25}%` }}></span>
          </div>

          <div className="wizard-body">
            {/* Step 0: Karakteristik Kulit */}
            <section className={`step ${step === 0 ? 'active' : ''}`} data-step="0">
              <h3>Kenali karakteristik kulitmu</h3>
              <p className="step-intro">
                Pilih kategori yang paling mendekati warna kulitmu. Pilihan ini masih berupa input mandiri pada prototype awal.
              </p>

              <span className="field-label">Skin tone</span>
              <div className="choice-grid" id="toneChoices">
                {[
                  { value: 'Fair', label: 'Fair', desc: 'Sangat terang', bg: '#f4d8c4' },
                  { value: 'Light', label: 'Light', desc: 'Terang', bg: '#e9c09f' },
                  { value: 'Medium', label: 'Medium', desc: 'Menengah', bg: '#c98e68' },
                  { value: 'Tan', label: 'Tan', desc: 'Sawo matang', bg: '#9b6248' },
                  { value: 'Deep', label: 'Deep', desc: 'Gelap', bg: '#603b32' },
                ].map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    className={`choice ${state.tone === t.value ? 'selected' : ''}`}
                    onClick={() => setState({ ...state, tone: t.value })}
                  >
                    <span className="tone-dot" style={{ background: t.bg }}></span>
                    <b>{t.label}</b>
                    <small>{t.desc}</small>
                  </button>
                ))}
              </div>

              <span className="field-label">Undertone</span>
              <div className="choice-grid three" id="undertoneChoices">
                {[
                  {
                    value: 'Warm',
                    label: 'Warm',
                    desc: 'Kesan keemasan',
                    bg: 'linear-gradient(135deg, #d9a66f, #c77c55)',
                  },
                  {
                    value: 'Cool',
                    label: 'Cool',
                    desc: 'Kesan kemerahan',
                    bg: 'linear-gradient(135deg, #c68b91, #92778d)',
                  },
                  {
                    value: 'Neutral',
                    label: 'Neutral',
                    desc: 'Perpaduan seimbang',
                    bg: 'linear-gradient(135deg, #c8a28d, #b9a293)',
                  },
                ].map((u) => (
                  <button
                    key={u.value}
                    type="button"
                    className={`choice ${state.undertone === u.value ? 'selected' : ''}`}
                    onClick={() => setState({ ...state, undertone: u.value })}
                  >
                    <span className="undertone-dot" style={{ background: u.bg }}></span>
                    <b>{u.label}</b>
                    <small>{u.desc}</small>
                  </button>
                ))}
              </div>

              <div className="inline-note">
                Catatan: klasifikasi dan cara identifikasi skin tone/undertone masih perlu ditetapkan berdasarkan literatur dan validasi. Pada prototype ini, pengguna memilih sendiri.
              </div>
            </section>

            {/* Step 1: Warna & Formula */}
            <section className={`step ${step === 1 ? 'active' : ''}`} data-step="1">
              <h3>Warna apa yang kamu sukai?</h3>
              <p className="step-intro">
                Pilih satu atau beberapa kelompok warna yang ingin kamu eksplorasi. Preferensi ini menggambarkan selera pribadi, bukan penilaian benar atau salah.
              </p>

              <span className="field-label">
                Preferensi warna{' '}
                <small style={{ fontWeight: 400, color: 'var(--muted)' }}>
                  (boleh pilih lebih dari satu)
                </small>
              </span>
              <div className="choice-grid" id="colorChoices">
                {[
                  { value: 'Pink', bg: '#d78f9a' },
                  { value: 'Peach', bg: '#e9ad8b' },
                  { value: 'Coral', bg: '#df8c78' },
                  { value: 'Mauve', bg: '#ac7888' },
                  { value: 'Berry', bg: '#a85d76' },
                  { value: 'Terracotta', bg: '#b86c50' },
                ].map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    className={`choice ${state.colors.includes(c.value) ? 'selected' : ''}`}
                    onClick={() => {
                      const exists = state.colors.includes(c.value);
                      setState({
                        ...state,
                        colors: exists
                          ? state.colors.filter((x) => x !== c.value)
                          : [...state.colors, c.value],
                      });
                    }}
                  >
                    <span className="swatch" style={{ background: c.bg }}></span>
                    <b>{c.value}</b>
                  </button>
                ))}
              </div>

              <span className="field-label">Formula blush on yang kamu inginkan</span>
              <div className="choice-grid" id="formulaChoices">
                {[
                  { value: 'Powder', symbol: '✧' },
                  { value: 'Liquid', symbol: '◒' },
                  { value: 'Cream', symbol: '◉' },
                  { value: 'Stick', symbol: '▮' },
                  { value: 'No preference', symbol: '∞', label: 'Bebas', desc: 'Tanpa preferensi' },
                ].map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    className={`choice ${state.formula === f.value ? 'selected' : ''}`}
                    onClick={() => setState({ ...state, formula: f.value })}
                  >
                    <span className="formula-symbol">{f.symbol}</span>
                    <b>{f.label || f.value}</b>
                    {f.desc && <small>{f.desc}</small>}
                  </button>
                ))}
              </div>

              <div className="inline-note">
                Formula diperlakukan sebagai filter alternatif sesuai pilihan pengguna, bukan sebagai penilaian bahwa satu formula lebih baik daripada formula lain.
              </div>
            </section>

            {/* Step 2: Anggaran */}
            <section className={`step ${step === 2 ? 'active' : ''}`} data-step="2">
              <h3>Sesuaikan dengan anggaranmu</h3>
              <p className="step-intro">
                Tentukan batas harga yang nyaman. Dalam rancangan final, fungsi anggaran akan dipastikan agar tidak terjadi penghitungan ganda dengan kriteria harga.
              </p>

              <span className="field-label">Batas anggaran</span>
              <div className="budget-row" id="budgetChoices">
                {[
                  { value: 50000, label: 'Di bawah Rp50.000', desc: 'Produk terjangkau' },
                  { value: 100000, label: 'Rp50.000 – Rp100.000', desc: 'Rentang menengah' },
                  { value: 150000, label: 'Rp100.000 – Rp150.000', desc: 'Rentang menengah atas' },
                  { value: 999999, label: 'Tanpa batas khusus', desc: 'Lihat semua alternatif' },
                ].map((b) => (
                  <button
                    key={b.value}
                    type="button"
                    className={`budget-option ${state.budget === b.value ? 'selected' : ''}`}
                    onClick={() => setState({ ...state, budget: b.value })}
                  >
                    <b>{b.label}</b>
                    <small>{b.desc}</small>
                  </button>
                ))}
              </div>

              <div className="inline-note">
                Anggaran pada layar ini hanya filter simulasi. Penentuan harga sebagai kriteria cost dalam VIKOR masih menunggu finalisasi rancangan penelitian.
              </div>
            </section>

            {/* Step 3: Hasil Rekomendasi */}
            <section className={`step ${step === 3 ? 'active' : ''}`} data-step="3">
              <div className="result-head">
                <div>
                  <div className="eyebrow">A little preview</div>
                  <h3>Contoh rekomendasi untukmu</h3>
                </div>
                <span className="demo-tag">DATA SIMULASI</span>
              </div>
              <p className="step-intro">
                Berikut contoh tampilan hasil setelah preferensimu dipilih. Produk dan urutannya dihitung menggunakan mesin VIKOR dengan kriteria kecocokan dinamis.
              </p>

              <div className="profile-summary" id="profileSummary">
                <span className="pill">Skin tone: {state.tone || '-'}</span>
                <span className="pill">Undertone: {state.undertone || '-'}</span>
                <span className="pill">Warna: {state.colors.join(', ') || '-'}</span>
                <span className="pill">
                  Formula: {state.formula === 'No preference' ? 'Bebas' : state.formula || '-'}
                </span>
                <span className="pill">
                  Anggaran:{' '}
                  {state.budget === 999999
                    ? 'Tanpa batas'
                    : state.budget
                    ? `Maks. Rp${state.budget.toLocaleString('id-ID')}`
                    : '-'}
                </span>
              </div>

              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '36px', color: 'var(--muted)' }}>
                  Memproses rekomendasi dengan algoritma VIKOR...
                </div>
              ) : isEmpty || results.length === 0 ? (
                <div className="empty">
                  Belum ada alternatif yang sesuai dengan batas formula atau anggaran saat ini.
                  <div style={{ marginTop: '12px' }}>
                    <button
                      className="secondary"
                      onClick={() => {
                        const relaxedState = { ...state, formula: 'No preference', budget: 999999 };
                        setState(relaxedState);
                        fetchRecommendations(relaxedState);
                      }}
                    >
                      Bebaskan Formula & Anggaran
                    </button>
                  </div>
                </div>
              ) : (
                <div className="product-list" id="productList">
                  {results.map((p, i) => (
                    <article key={p.alternativeId || i} className="product">
                      <div
                        className="product-art"
                        style={{ ['--shade' as any]: p.colorHex || '#cf8583' }}
                      ></div>
                      <div>
                        <div className="rank">
                          Contoh peringkat {p.rank || i + 1}
                          {p.isCompromise && (
                            <span style={{ marginLeft: '6px', color: 'var(--green)' }}>
                              · Solusi Kompromi
                            </span>
                          )}
                        </div>
                        <h4>
                          {p.brand} · {p.metadata?.productName || p.name}
                        </h4>
                        <p>
                          Shade <strong>{p.shade}</strong>
                          <br />
                          {p.metadata?.desc || 'Alternatif blush on berkualitas.'}
                        </p>
                        <div className="product-meta">
                          <span>{p.formula}</span>
                          <span>{p.metadata?.colorFamily || 'Universal'}</span>
                          {p.Q !== undefined && (
                            <span title="Nilai indeks kompromi VIKOR (makin kecil makin baik)">
                              Q = {p.Q}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="product-price">
                        <b>Rp{(p.price || 0).toLocaleString('id-ID')}</b>
                        <button type="button" onClick={() => openDetail(p)}>
                          Lihat detail
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              <div className="method-note">
                <strong>Catatan metodologi:</strong> daftar ini dihitung menggunakan mesin VIKOR berdasar matriks simulasi awal. Data produk, kriteria, bobot, dan skala penilaian masih perlu ditetapkan melalui studi literatur dan arahan dosen pembimbing.
              </div>

              <div style={{ marginTop: '18px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button type="button" className="secondary" onClick={editPreferences}>
                  Ubah preferensi
                </button>
                <button type="button" className="text-btn" onClick={resetPrototype}>
                  Mulai dari awal
                </button>
              </div>
            </section>

            {/* Action Buttons Footer */}
            {step < 3 && (
              <div className="wizard-actions" id="wizardActions">
                <button
                  type="button"
                  className="text-btn"
                  id="backBtn"
                  onClick={() => goStep(-1)}
                  style={{ visibility: step === 0 ? 'hidden' : 'visible' }}
                >
                  ← Kembali
                </button>
                <button type="button" className="primary" id="nextBtn" onClick={() => goStep(1)}>
                  Lanjutkan →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info Boxes from Prototype */}
        <div className="admin-note" style={{ marginTop: '25px' }}>
          <div className="eyebrow">Rencana proses keputusan</div>
          <h3>Bagaimana rekomendasi akan dihasilkan?</h3>
          <div className="admin-grid">
            <div>
              <b>01 · Input</b>Profil kulit dan preferensi pengguna.
            </div>
            <div>
              <b>02 · Filter</b>Alternatif disaring berdasarkan formula dan batasan pilihan.
            </div>
            <div>
              <b>03 · Penilaian</b>Menyusun matriks keputusan dari kriteria yang tervalidasi.
            </div>
            <div>
              <b>04 · VIKOR</b>Menghitung indeks kompromi dan menentukan peringkat.
            </div>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.65, margin: '14px 0 0' }}>
            Alur metodologis ini masih berupa rancangan. Kriteria, bobot, skala penilaian, dan perlakuan terhadap anggaran perlu disepakati setelah studi literatur.
          </p>
        </div>

        <div className="admin-note" id="catatan">
          <div className="eyebrow">Rancangan pengelola</div>
          <h3>Pengelolaan data oleh admin</h3>
          <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
            Pada pengembangan berikutnya, admin akan mengelola katalog produk dan shade, atribut produk, kriteria, bobot, serta nilai alternatif yang digunakan dalam proses VIKOR.
          </p>
          <div className="admin-grid">
            <div>
              <b>Produk & shade</b>Tambah dan perbarui alternatif.
            </div>
            <div>
              <b>Kriteria & bobot</b>Kelola parameter keputusan.
            </div>
            <div>
              <b>Penilaian</b>Input nilai setiap alternatif.
            </div>
            <div>
              <b>Hasil VIKOR</b>Periksa S, R, Q dan peringkat.
            </div>
          </div>
        </div>
      </div>

      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
