# Blushé — Sistem Pendukung Keputusan Rekomendasi Blush On

Aplikasi web Sistem Pendukung Keputusan (SPK) untuk rekomendasi produk dan shade blush on menggunakan metode **VIKOR** (VlseKriterijumska Optimizacija I Kompromisno Resenje).

Dibuat berbasis **Next.js 15+ (App Router)**, **TypeScript**, **CSS Design Tokens prototype asli**, dan **SQLite lokal (`blushe.db`)**.

---

## 1. Menjalankan Aplikasi

Pastikan Node.js v20+ atau v22+ telah terpasang.

```bash
# 1. Pindah ke direktori aplikasi
cd "D:\IF23\SMT 7\.ika\TA\blushe\app"

# 2. Instal dependensi (jika belum)
npm install

# 3. Jalankan server pengembangan lokal
npm run dev
```

Buka peramban di:
- **Halaman Pengguna (Wizard 4 Langkah)**: [http://localhost:3000](http://localhost:3000)
- **Portal Admin**: [http://localhost:3000/admin](http://localhost:3000/admin)
  - Username: `admin`
  - Password: `admin123`

---

## 2. Menjalankan Pengujian (Unit Tests)

Pengujian matematis algoritma VIKOR dan database SQLite menggunakan Vitest:

```bash
npm test
```

Cakupan pengujian:
1. `tests/vikor.test.ts`:
   - Validasi perhitungan $S_i, R_i, Q_i$.
   - Penanganan *zero-denominator* saat nilai kriteria alternatif identik.
   - Penanganan kasus khusus 1 alternatif dan daftar kosong.
   - Pengurutan peringkat ascending berdasarkan nilai $Q_i$.
2. `tests/db.test.ts`:
   - Validasi skema relasional tabel database SQLite.
   - Validasi data seed simulasi awal.

---

## 3. Fitur Utama

### A. Sisi Pengguna
- **Desain Presisi Prototype**: Tipografi *Playfair Display* & *DM Sans*, palet warna warm rose/cream, ilustrasi CSS compact blush dengan floating swatches.
- **Wizard 4-Langkah**:
  1. *Karakteristik Kulit*: Skin tone (*Fair, Light, Medium, Tan, Deep*) & Undertone (*Warm, Cool, Neutral*).
  2. *Warna & Formula*: Preferensi warna (multi-select) & Formula (*Powder, Liquid, Cream, Stick, Bebas*).
  3. *Anggaran*: Batas harga (<50rb, 50-100rb, 100-150rb, Tanpa batas).
  4. *Hasil Rekomendasi*: Ringkasan profil, urutan peringkat teratas, formula, harga, dan tombol detail.
- **Modal Detail Produk**: Membuka detail swatch, formula, dan harga.
- **Empty State Elegan**: Menampilkan opsi pelonggaran filter jika batasan formula & anggaran menyaring seluruh alternatif.

### B. Sisi Admin (`/admin`)
- **Dashboard Statistik**: Total merek, produk, shade alternatif, dan log riwayat sesi rekomendasi.
- **Katalog Produk & Shade**: Tambah shade alternatif baru dengan formula, kelompok warna, hex picker, dan harga.
- **Kriteria & Bobot**: Konfigurasi bobot $w_j$ dan arah benefit/cost dengan validasi total $\sum w_j = 1.0$.
- **Audit Kalkulator VIKOR**: Simulasi transparan langkah perhitungan untuk bahan bimbingan skripsi.

---

## 4. Catatan Metodologi & Akademik

1. **Status Data**: Seluruh data produk, merek, dan harga awal merupakan **DATA SIMULASI** dari prototype acuan.
2. **Kriteria VIKOR**:
   - `C1`: Kecocokan Skin Tone (Benefit, Bobot default 0.35).
   - `C2`: Kecocokan Undertone (Benefit, Bobot default 0.25).
   - `C3`: Kesesuaian Preferensi Warna multi-select (Benefit, Bobot default 0.25).
   - `C4`: Harga Produk dalam Rupiah (Cost, Bobot default 0.15).
3. **Fleksibilitas Penelitian**: Bobot, aturan pencocokan warna, dan arah kriteria dapat dikonfigurasi melalui modul admin tanpa perlu merombak kode sumber.
