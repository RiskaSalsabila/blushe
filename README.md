# Blushé

Sistem Pendukung Keputusan (SPK) Rekomendasi Produk dan Shade Blush On menggunakan metode VIKOR.

## Cara Menjalankan Aplikasi

1. Masuk ke folder aplikasi:
   ```bash
   cd app
   ```

2. Instal dependensi:
   ```bash
   npm install
   ```

3. Jalankan server pengembangan:
   ```bash
   npm run dev
   ```

4. Buka di peramban:
   - Pengguna: [http://localhost:3000](http://localhost:3000)
   - Admin: [http://localhost:3000/admin](http://localhost:3000/admin) (Username: `admin`, Password: `admin123`)

## Menjalankan Pengujian (Testing)

```bash
cd app
npm test
```

## Struktur Direktori

- `app/` : Aplikasi web Next.js (App Router, UI, SQLite, dan Mesin VIKOR).
- `docs/` : Spesifikasi desain teknis dan arsitektur sistem.
- `prototype/` : Prototype HTML asli acuan visual awal.
