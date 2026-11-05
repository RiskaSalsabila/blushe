# PROMPT UNTUK AI CODING AGENT

Kamu bertugas mengimplementasikan aplikasi web **Blushé**, sistem pendukung keputusan rekomendasi produk dan shade blush on.

## File yang wajib dibaca sebelum coding

1. `PRD.md` — kebutuhan produk dan ruang lingkup.
2. `UI_DESIGN_SPEC.md` — pedoman visual.
3. `DATA_AND_VIKOR_SPEC.md` — rancangan data dan batasan algoritma.
4. `DECISIONS_AND_OPEN_QUESTIONS.md` — keputusan sementara dan pertanyaan yang belum final.
5. `prototype/index.html` — **SUMBER KEBENARAN DESAIN UTAMA**. Baca file ini secara menyeluruh.

## Instruksi paling penting: pertahankan desain prototype

Pemilik proyek secara eksplisit menyukai desain HTML prototype dan meminta desain tersebut dipertahankan.

- Jangan mendesain ulang dari nol.
- Jangan mengganti palet warna, tipografi, hero composition, bentuk card, wizard, progress bar, swatch, result card, atau detail modal tanpa alasan teknis yang kuat dan persetujuan pemilik proyek.
- Jangan mengubah gaya menjadi dashboard generik, dark mode, atau template e-commerce biasa.
- Gunakan `prototype/index.html` sebagai acuan visual langsung. Port markup, CSS, token, dan interaksinya ke stack aplikasi jika perlu.
- Jaga file prototype asli tetap utuh. Implementasikan di folder/source kerja terpisah.
- Jika project sudah punya stack dan konvensi, inspeksi dahulu dan ikuti konvensinya. Jangan mengganti stack yang ada tanpa alasan dan persetujuan.
- Jika project benar-benar kosong, usulkan stack sederhana dan jelaskan pilihan sebelum membangun infrastruktur yang besar.

## Tujuan implementasi

Bangun aplikasi bertahap:

### Tahap 1 — Front-end mendekati prototype

Implementasikan landing page dan alur empat langkah:
1. Skin tone dan undertone.
2. Preferensi warna dan formula.
3. Anggaran.
4. Hasil rekomendasi dan detail produk.

Pastikan tombol, validasi, progress, back/next, reset, edit preference, dan modal detail berfungsi. Desain harus mobile responsive.

### Tahap 2 — Struktur aplikasi dan data

Implementasikan model data brand, product, product shade (alternatif), criterion, alternative score, dan admin user sesuai PRD. Implementasikan autentikasi admin dan CRUD katalog.

### Tahap 3 — Integrasi VIKOR

Jangan membuat bobot atau skor kriteria sendiri. Kriteria, bobot, arah benefit/cost, skala penilaian, pemetaan skin tone/undertone, dan parameter VIKOR belum disahkan. Sampai keputusan tersebut diberikan, siapkan modul/service VIKOR yang terpisah, struktur input matriks, tampilan tabel admin, dan fixture demo yang jelas diberi label.

Setelah pemilik proyek memberikan definisi final, implementasikan perhitungan dan unit test. Jangan menyajikan hasil hard-coded atau sample ordering sebagai hasil VIKOR.

## Data demo

Prototype berisi merek, produk, shade, harga, dan urutan rekomendasi fiktif untuk demo UI. Jangan tampilkan data ini seolah-olah produk nyata. Simpan seed/demo data terpisah dari katalog produksi dan beri badge `SIMULASI` / `DEMO`.

Jangan mengambil foto, harga, atau data produk komersial tanpa sumber yang bisa dicatat. Setiap produk nyata harus memiliki sumber informasi dan tanggal pengecekan harga bila tersedia.

## Batasan produk

- Ini adalah sistem rekomendasi/SPK, bukan marketplace.
- Jangan menambahkan pembayaran, checkout, cart, atau pengiriman.
- Jangan menambahkan computer vision, kamera, AR, atau virtual try-on pada MVP.
- Jangan membuat klaim medis atau diagnosis kulit.
- Formula powder/liquid/cream/stick adalah filter sesuai pilihan pengguna, bukan kriteria yang menyatakan formula tertentu lebih baik.
- Pengguna memilih skin tone dan undertone secara mandiri pada versi awal.

## Aturan kerja agent

1. Mulai dengan memeriksa struktur repo, stack, package manager, dan cara menjalankan project.
2. Laporkan rencana implementasi singkat dan file yang akan diubah.
3. Buat baseline yang mudah dijalankan dan dokumentasikan command setup/run/test.
4. Implementasikan per fase; jangan mencoba menyelesaikan hal metodologis yang belum diputuskan dengan asumsi tersembunyi.
5. Pisahkan komponen UI, sample data, data service, dan algoritma.
6. Validasi form di client dan server (untuk fungsi backend).
7. Buat empty state ketika tidak ada produk yang lolos filter. Jangan diam-diam mengabaikan filter pengguna.
8. Tambahkan unit test untuk aturan bisnis dan VIKOR setelah definisinya final.
9. Jalankan lint, test, dan build. Perbaiki error sebelum menyerahkan hasil.
10. Laporkan apa yang sudah selesai, apa yang masih berupa mock/demo, dan keputusan apa yang masih dibutuhkan pemilik proyek.

## Definisi berhasil untuk tahap pertama

- Tampilan sangat dekat dengan `prototype/index.html`.
- Alur empat langkah bekerja.
- Input dapat dipilih dan diedit.
- Demo result dapat ditampilkan dengan label simulasi.
- Detail produk dapat dibuka dan ditutup.
- Layout responsif.
- Tidak ada klaim bahwa demo result telah dihitung menggunakan VIKOR.

Mulai dengan membaca seluruh file handoff. Jangan mengabaikan `prototype/index.html` atau menggantinya dengan desain baru.
