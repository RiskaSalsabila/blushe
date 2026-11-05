# BLUSHÉ — SPESIFIKASI DESAIN SISTEM & TEKNIS LENGKAP
**Sistem Pendukung Keputusan Rekomendasi Produk & Shade Blush On Berbasis Web (Metode VIKOR)**
*Versi:* 1.0 (Ready for Agent Implementation)  
*Tanggal:* 2 November 2026  
*Status:* Spesifikasi Arsitektur, Desain UI, Skema Data, dan Algoritma Final

---

## 1. Ringkasan Eksekutif & Prinsip Desain

Dokumen ini adalah cetak biru teknis (*technical blueprint*) untuk implementasi aplikasi **Blushé**. Dokumen ini menggabungkan seluruh instruksi dari `PRD.md`, `UI_DESIGN_SPEC.md`, `DATA_AND_VIKOR_SPEC.md`, `DECISIONS_AND_OPEN_QUESTIONS.md`, serta file acuan utama `prototype/index.html`.

### 1.1 Prinsip Wajib (Non-Negotiable)
1. **Preservasi Visual 100%**:
   - Mengikuti styling dari `prototype/index.html` (Playfair Display untuk display/heading, DM Sans untuk UI/body, palet warna *warm rose, cream, paper, ink*).
   - Elemen khas seperti komposisi hero dua kolom, ilustrasi *compact blush* melingkar dengan *floating swatches*, wizard 4 langkah dengan progress bar, selectable cards, dan detail modal harus dipertahankan persis.
   - **Bukan generic dashboard**, bukan tema gelap, dan bukan layout e-commerce / marketplace biasa.
2. **Karakter Sistem**:
   - Sistem adalah **SPK (Sistem Pendukung Keputusan)**, bukan marketplace. Tidak ada keranjang belanja, checkout, pembayaran, atau pengiriman.
   - Tidak ada deteksi kamera AI, AR, atau klaim medis diagnosis kulit.
3. **Pemisahan Data Nyata vs. Simulasi**:
   - Data demo fiktif bawaan prototype harus dilabeli jelas dengan badge `SIMULASI` / `DEMO`.
   - Modul VIKOR disiapkan terisolasi (`lib/vikor.ts`) dengan unit testing matematis terverifikasi.
4. **Lokasi Proyek**:
   - Proyek aplikasi diimplementasikan di subdirektori `D:\IF23\SMT 7\.ika\TA\blushe\app`, menjaga folder `prototype/` asli tetap utuh sebagai baseline acuan.

---

## 2. Arsitektur Teknologi & Struktur Folder

### 2.1 Pilihan Stack
- **Framework**: Next.js 15+ (App Router) dengan TypeScript.
- **Styling**: Native CSS Variables & CSS Modules sesuai design tokens dari `prototype/index.html`.
- **Database**: SQLite lokal (`blushe.db`) menggunakan `better-sqlite3` (cepat, tanpa daemon server terpisah, portable untuk skripsi).
- **Testing**: Vitest untuk unit test algoritma VIKOR dan aturan bisnis.
- **Authentication (Admin)**: Cookie-based secure session sederhana dengan password hashing (bcrypt).

### 2.2 Struktur Direktori Proyek (`D:\IF23\SMT 7\.ika\TA\blushe\app`)
```text
blushe/
├── docs/
│   └── SYSTEM_DESIGN_SPEC.md     # Dokumen spesifikasi ini
├── prototype/                    # Prototype HTML asli (Read-only reference)
│   ├── index.html
│   └── README.txt
└── app/                          # Implementasi kode aplikasi
    ├── package.json
    ├── tsconfig.json
    ├── next.config.ts
    ├── vitest.config.ts
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx        # Shell global, font Google (Playfair Display & DM Sans)
    │   │   ├── page.tsx          # Landing page publik & Wizard 4-langkah pengguna
    │   │   ├── globals.css       # Design tokens & base styles prototype
    │   │   ├── admin/
    │   │   │   ├── login/
    │   │   │   │   └── page.tsx  # Halaman login admin
    │   │   │   ├── layout.tsx    # Shell dashboard admin yang konsisten (gaya Blushé)
    │   │   │   ├── page.tsx      # Dashboard ringkasan katalog & statistik
    │   │   │   ├── products/
    │   │   │   │   └── page.tsx  # CRUD Merek, Produk, dan Shade (Alternatif)
    │   │   │   ├── criteria/
    │   │   │   │   └── page.tsx  # Pengelolaan Kriteria, Bobot, & Arah (Benefit/Cost)
    │   │   │   ├── scores/
    │   │   │   │   └── page.tsx  # Matriks Nilai Alternatif per Kriteria
    │   │   │   └── vikor/
    │   │   │       └── page.tsx  # Kalkulator & audit perhitungan S, R, Q
    │   │   └── api/
    │   │       ├── recommend/
    │   │       │   └── route.ts  # Endpoint rekomendasi pengguna (filter + VIKOR)
    │   │       ├── auth/
    │   │       │   └── route.ts  # Login & logout admin
    │   │       └── admin/
    │   │           ├── products/route.ts
    │   │           ├── criteria/route.ts
    │   │           └── scores/route.ts
    │   ├── components/
    │   │   ├── Navbar.tsx        # Sticky topbar dengan logo brand Blushé & CTA
    │   │   ├── Hero.tsx          # Hero section + ilustrasi compact blush
    │   │   ├── HowItWorks.tsx    # 4 preview cards langkah
    │   │   ├── Wizard.tsx        # Kontainer interaktif wizard 4 langkah
    │   │   ├── WizardStep0.tsx   # Langkah 1: Skin Tone & Undertone
    │   │   ├── WizardStep1.tsx   # Langkah 2: Preferensi Warna & Formula
    │   │   ├── WizardStep2.tsx   # Langkah 3: Batas Anggaran
    │   │   ├── WizardStep3.tsx   # Langkah 4: Tampilan Hasil Rekomendasi
    │   │   ├── ProductDetailModal.tsx # Modal detail produk & swatch
    │   │   └── AdminTable.tsx    # Komponen tabel data admin yang rapi
    │   ├── lib/
    │   │   ├── db.ts             # Koneksi database SQLite & schema migration otomatis
    │   │   ├── vikor.ts          # Pure mathematical service untuk algoritma VIKOR
    │   │   ├── auth.ts           # Helper autentikasi admin & JWT/session
    │   │   └── seed.ts           # Data awal katalog & fixture simulasi demo
    │   └── tests/
    │       ├── vikor.test.ts     # Unit test rumus VIKOR, edge cases, tie, bobot
    │       └── filter.test.ts    # Unit test filter formula & budget
```

---

## 3. Skema Basis Data Relasional (SQLite)

Database disimpan di file lokal `blushe.db`. Skema ini mendukung model keputusan di mana **satu alternatif adalah satu kombinasi produk + shade**.

```sql
-- 1. Tabel Merek
CREATE TABLE IF NOT EXISTS brands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    website_url TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel Produk
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    description TEXT,
    product_url TEXT,
    image_url TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
);

-- 3. Tabel Shade (Alternatif Keputusan SPK)
CREATE TABLE IF NOT EXISTS product_shades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    shade_name TEXT NOT NULL,
    shade_description TEXT,
    formula TEXT NOT NULL CHECK(formula IN ('Powder', 'Liquid', 'Cream', 'Stick', 'Other')),
    color_family TEXT NOT NULL, -- Pink, Peach, Coral, Mauve, Berry, Terracotta, etc.
    color_hex TEXT NOT NULL,    -- Contoh: #d78f9a
    price_idr INTEGER NOT NULL, -- Disimpan numerik bulat dalam Rupiah
    price_source_url TEXT,
    price_checked_at DATE,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 4. Tabel Kriteria VIKOR
CREATE TABLE IF NOT EXISTS criteria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,   -- C1, C2, C3, C4
    name TEXT NOT NULL,          -- Kecocokan Skin Tone, Kecocokan Undertone, Preferensi Warna, Harga
    description TEXT,
    type TEXT NOT NULL CHECK(type IN ('benefit', 'cost')),
    weight REAL NOT NULL,        -- Nilai bobot (jumlah total bobot = 1.0)
    scale_min REAL NOT NULL DEFAULT 1.0,
    scale_max REAL NOT NULL DEFAULT 5.0,
    is_active INTEGER NOT NULL DEFAULT 1
);

-- 5. Tabel Aturan Pencocokan / Penilaian Dinamis (Matching Rules)
CREATE TABLE IF NOT EXISTS matching_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rule_type TEXT NOT NULL,     -- 'skin_tone', 'undertone', 'color_family'
    input_value TEXT NOT NULL,   -- e.g. 'Fair', 'Warm', 'Pink'
    target_value TEXT NOT NULL,  -- e.g. shade color family, shade depth
    match_score REAL NOT NULL,   -- Skor kecocokan (provisional, dapat diedit admin)
    rationale TEXT,
    is_active INTEGER NOT NULL DEFAULT 1
);

-- 6. Tabel Sesi Rekomendasi Pengguna (Recommendation Runs)
CREATE TABLE IF NOT EXISTS recommendation_runs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    skin_tone TEXT NOT NULL,
    undertone TEXT NOT NULL,
    selected_colors TEXT NOT NULL,     -- JSON array string (Multi-select)
    selected_formula TEXT NOT NULL,
    budget_limit INTEGER,
    candidates_count INTEGER,
    v_parameter REAL NOT NULL DEFAULT 0.5,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tabel Skor Dinamis per Sesi (Recommendation Scores - Matriks X)
CREATE TABLE IF NOT EXISTS recommendation_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    run_id INTEGER NOT NULL,
    product_shade_id INTEGER NOT NULL,
    criterion_code TEXT NOT NULL,      -- C1, C2, C3, C4
    score REAL NOT NULL,
    FOREIGN KEY (run_id) REFERENCES recommendation_runs(id) ON DELETE CASCADE,
    FOREIGN KEY (product_shade_id) REFERENCES product_shades(id) ON DELETE CASCADE
);

-- 8. Tabel Hasil VIKOR per Sesi (Recommendation Results)
CREATE TABLE IF NOT EXISTS recommendation_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    run_id INTEGER NOT NULL,
    product_shade_id INTEGER NOT NULL,
    S_value REAL NOT NULL,
    R_value REAL NOT NULL,
    Q_value REAL NOT NULL,
    rank INTEGER NOT NULL,
    is_compromise INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (run_id) REFERENCES recommendation_runs(id) ON DELETE CASCADE,
    FOREIGN KEY (product_shade_id) REFERENCES product_shades(id) ON DELETE CASCADE
);

-- 9. Tabel Admin User
CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. Alur Pengguna & Spesifikasi UI (Frontend)

### 4.1 Design Tokens (CSS Variables)
```css
:root {
  --ink: #302521;
  --muted: #84736d;
  --rose: #b96f70;
  --rose-dark: #915455;
  --rose-light: #f5e7e3;
  --cream: #fbf8f4;
  --paper: #fffdfa;
  --line: #eee4de;
  --green: #667c68;
  --shadow: 0 18px 55px rgba(86, 57, 45, 0.08);
}
```

### 4.2 Alur Wizard 4-Langkah
1. **Langkah 0: Karakteristik Kulit**
   - *Skin tone* (Single select): `Fair` (#f4d8c4), `Light` (#e9c09f), `Medium` (#c98e68), `Tan` (#9b6248), `Deep` (#603b32).
   - *Undertone* (Single select): `Warm` (gold-peach gradient), `Cool` (rose-berry gradient), `Neutral` (balanced neutral gradient).
   - Validasi: Kedua pilihan wajib dipilih sebelum tombol "Lanjutkan →" aktif.
2. **Langkah 1: Preferensi Warna & Formula**
   - *Preferensi Warna* (Multi select): `Pink` (#d78f9a), `Peach` (#e9ad8b), `Coral` (#df8c78), `Mauve` (#ac7888), `Berry` (#a85d76), `Terracotta` (#b86c50). Pengguna dapat memilih satu atau beberapa.
   - *Formula* (Single select): `Powder`, `Liquid`, `Cream`, `Stick`, atau `Bebas (No preference)`.
   - Validasi: Minimal 1 warna dan 1 pilihan formula.
3. **Langkah 2: Anggaran**
   - *Pilihan Rentang*:
     - `< Rp50.000`
     - `Rp50.000 – Rp100.000`
     - `Rp100.000 – Rp150.000`
     - `Tanpa batas khusus` (999.999)
   - Validasi: Wajib memilih 1 opsi.
4. **Langkah 3: Hasil Rekomendasi & Modal Detail**
   - Menampilkan *Profile Summary Pills* (Skin tone, Undertone, Warna pilihan, Formula, Budget).
   - Badge `DATA SIMULASI` / `DEMO` tetap ditampilkan di samping judul hasil.
   - Menampilkan daftar kartu produk yang direkomendasikan dengan:
     - Rank badge: "Contoh peringkat 1", "Contoh peringkat 2", dll.
     - Swatch lingkaran warna shade.
     - Nama brand, produk, shade, formula, dan harga dalam Rupiah.
     - Tombol "Lihat detail" yang memicu Modal Produk (backdrop click dan tombol X dapat menutup modal).
   - Tombol "Ubah preferensi" (kembali ke step 2) dan "Mulai dari awal" (reset state kembali ke step 0).
   - Catatan metodologis di bagian bawah yang menjelaskan bahwa data dan peringkat masih menunggu validasi akhir.

### 4.3 Penanganan Empty State
Jika seluruh alternatif tersaring habis oleh kombinasi formula dan anggaran yang terlalu ketat, antarmuka tidak boleh kosong atau error. Sistem menampilkan kartu empty state elegan:
> *"Belum ada alternatif produk yang sesuai dengan batasan saat ini. Coba pilih formula 'Bebas' atau perluas rentang anggaran Anda."* dengan tombol cepat untuk melonggarkan filter.

---

## 5. Spesifikasi Algoritma & Modul VIKOR (`lib/vikor.ts`)

Modul ini diimplementasikan secara terisolasi tanpa ketergantungan pada React atau UI.

### 5.1 Pipeline Eksekusi
```text
Input Pengguna (Formula, Budget, Warna, Kulit)
     ↓
Filter Keras (Hard Filter)
  - Formula: cocok dengan pilihan (jika bukan 'Bebas')
  - Budget: harga <= batas budget (jika bukan 'Tanpa batas')
  - Status aktif: is_active = 1
     ↓
Cek Jumlah Alternatif Lolos (m)
  - Jika m == 0 -> Return EMPTY_STATE
  - Jika m == 1 -> Alternatif langsung mendapat peringkat 1 (Q = 0.0)
  - Jika m >= 2 -> Bentuk Matriks Keputusan X (m x n)
     ↓
Eksekusi VIKOR
  1. Tentukan f* dan f- per kriteria (sesuai arah Benefit / Cost)
  2. Hitung S_i (Utility Measure) & R_i (Regret Measure)
  3. Hitung Q_i (Indeks Kompromi) dengan parameter v (default = 0.5)
  4. Urutkan berdasarkan Q_i ascending (nilai terkecil adalah peringkat terbaik)
  5. Evaluasi Solusi Kompromi (Acceptable Advantage & Acceptable Stability)
     ↓
Output Hasil Peringkat + Penjelasan (Audit Trail)
```

### 5.2 Formulasi Matematis

1. **Nilai Terbaik ($f^*_j$) dan Terburuk ($f^-_j$)**:
   - Jika kriteria $j$ adalah **Benefit**:
     $$f^*_j = \max_i f_{ij}, \quad f^-_j = \min_i f_{ij}$$
   - Jika kriteria $j$ adalah **Cost**:
     $$f^*_j = \min_i f_{ij}, \quad f^-_j = \max_i f_{ij}$$

2. **Perhitungan Utility ($S_i$) dan Individual Regret ($R_i$)**:
   $$S_i = \sum_{j=1}^n w_j \left( \frac{f^*_j - f_{ij}}{f^*_j - f^-_j} \right)$$
   $$R_i = \max_{j} \left[ w_j \left( \frac{f^*_j - f_{ij}}{f^*_j - f^-_j} \right) \right]$$
   *Catatan Penanganan Zero Denominator*: Jika seluruh alternatif memiliki nilai identik pada kriteria $j$ ($f^*_j = f^-_j$), maka rasio jarak dinormalisasi bernilai 0 untuk mencegah pembagian dengan nol (`NaN`/`Infinity`).

3. **Perhitungan Indeks Kompromi ($Q_i$)**:
   $$Q_i = v \frac{S_i - S^*}{S^- - S^*} + (1 - v) \frac{R_i - R^*}{R^- - R^*}$$
   Di mana:
   - $S^* = \min_i S_i$, $S^- = \max_i S_i$
   - $R^* = \min_i R_i$, $R^- = \max_i R_i$
   - $v$ adalah bobot strategi mayoritas kriteria (default disiapkan $v = 0.5$, dapat diatur di admin).
   *Catatan Zero Denominator*: Jika $S^- = S^*$ atau $R^- = R^*$, masing-masing suku dinormalisasi menjadi 0.

4. **Kondisi Solusi Kompromi**:
   Alternatif $A^{(1)}$ (peringkat pertama dengan $Q$ terendah) diusulkan sebagai solusi kompromi definitif jika memenuhi dua syarat:
   - **C1: Acceptable Advantage**:
     $$Q(A^{(2)}) - Q(A^{(1)}) \ge DQ, \quad \text{dengan } DQ = \frac{1}{m - 1}$$
   - **C2: Acceptable Stability in Decision Making**:
     Alternatif $A^{(1)}$ juga harus menempati peringkat terbaik pada urutan $S$ atau urutan $R$.
   - Jika C1 tidak terpenuhi: serangkaian alternatif $A^{(1)}, A^{(2)}, \dots, A^{(k)}$ di mana $Q(A^{(k)}) - Q(A^{(1)}) < DQ$ diajukan sebagai solusi kompromi bersama.
   - Jika C2 tidak terpenuhi: $A^{(1)}$ dan $A^{(2)}$ diajukan sebagai solusi kompromi.

---

## 6. Antarmuka Pengelola (Admin Dashboard)

Halaman admin dilindungi autentikasi di rute `/admin`. Menggunakan token styling Blushé agar estetika tetap serasi:
1. **Dashboard (`/admin`)**:
   - Kartu statistik: Total Merek, Total Produk, Total Shade (Alternatif Aktif), Jumlah Kriteria Aktif.
   - Status kelengkapan matriks keputusan (apakah ada shade yang belum memiliki nilai kriteria).
2. **Katalog Produk & Shade (`/admin/products`)**:
   - Daftar produk dengan expand/collapse untuk melihat shade masing-masing.
   - Form Tambah/Ubah Produk: Nama brand, nama produk, deskripsi, URL.
   - Form Tambah/Ubah Shade: Nama shade, formula, kelompok warna, color hex picker, harga (IDR), URL sumber harga.
3. **Kriteria & Bobot (`/admin/criteria`)**:
   - Kelola kode, nama, tipe (benefit/cost), dan bobot.
   - Validasi otomatis: Menampilkan peringatan jika $\sum w_j \neq 1.0$.
4. **Matriks Penilaian (`/admin/scores`)**:
   - Tabel grid (Baris: Alternatif Produk-Shade, Kolom: Kriteria C1–C4).
   - Fitur simpan nilai instan per sel atau massal.
5. **Audit & Pemeriksaan VIKOR (`/admin/vikor`)**:
   - Memilih filter simulasi (misal: formula Powder, budget 100k).
   - Menampilkan tabel lengkap tahap demi tahap: Matriks awal, nilai $f^*$ dan $f^-$, tabel $S$, $R$, dan $Q$, serta evaluasi kondisi kompromi C1 & C2.

---

## 7. Rencana Verifikasi & Pengujian (DoD)

| Bidang | Kriteria Sukses | Cara Verifikasi |
|---|---|---|
| **Visual & UI** | 100% konsisten dengan `prototype/index.html` (font, token warna, wizard, card, modal). Responsif dari ponsel (360px) hingga desktop (1440px). | Inspeksi visual & Playwright headless screenshot. |
| **Interaksi** | Wizard 4-langkah berjalan mulus, validasi sebelum lanjut, tombol kembali, ubah preferensi, reset, dan modal detail bekerja. | Pengujian klik elemen & verifikasi state. |
| **Algoritma VIKOR** | Implementasi terisolasi di `lib/vikor.ts`, lulus semua pengujian matematika dengan dataset acuan. | Unit tests di Vitest (`pnpm test` / `npm test`). |
| **Edge Cases VIKOR** | Penanganan zero denominator ($f^*=f^-$), pembagian nol pada $S$ dan $R$, 1 alternatif, tidak ada alternatif, dan kasus nilai seri. | Unit test edge cases khusus di `vikor.test.ts`. |
| **Admin & Data** | Autentikasi aman, CRUD produk/shade bekerja, skor tersimpan di SQLite `blushe.db`. | Manual QA & verifikasi query database. |
| **Label Etis** | Data simulasi berlabel `SIMULASI`/`DEMO`, tidak mengklaim rekomendasi medis atau hasil final sebelum validasi akademik. | Inspeksi teks & UI banner. |

---

Spesifikasi ini siap dijadikan panduan implementasi untuk coding agent. Tidak ada bagian yang diasumsikan secara sepihak di luar batasan handoff.
