# DECISIONS & OPEN QUESTIONS — BLUSHÉ

Dokumen ini mencegah coding agent mengubah asumsi sementara menjadi keputusan final.

## A. Sudah diarahkan / disepakati dalam diskusi

- Objek utama adalah produk blush on beserta shade.
- Aplikasi berbasis website.
- Nama visual sementara: Blushé.
- Desain HTML prototype yang disertakan disukai pemilik proyek dan harus dipertahankan.
- Referensi struktur aplikasi utama: SkinBloom UII (2025), tetapi bukan untuk disalin 100%.
- Karakteristik pengguna meliputi skin tone dan undertone sebagai calon input.
- Preferensi warna merupakan input pengguna.
- Pengguna memilih sendiri formula yang disukai.
- Formula diperlakukan sebagai filter alternatif, bukan kriteria yang membandingkan formula satu dengan lainnya.
- Harga/anggaran perlu dipertimbangkan, tetapi implementasi filter vs kriteria belum final.
- VIKOR adalah metode yang direncanakan dan masih memerlukan finalisasi akademik.
- Tidak perlu kamera/AR/virtual try-on pada ruang lingkup awal.

## B. Nilai sementara dari prototype

- Skin tone: Fair, Light, Medium, Tan, Deep.
- Undertone: Warm, Cool, Neutral.
- Warna: Pink, Peach, Coral, Mauve, Berry, Terracotta.
- Formula: Powder, Liquid, Cream, Stick, No preference.
- Anggaran: di bawah Rp50.000; Rp50.000–Rp100.000; Rp100.000–Rp150.000; tanpa batas.
- Hasil demo menampilkan maksimal tiga alternatif.

Nilai di atas adalah isi prototype, bukan keputusan akademik final.

## C. Belum diputuskan

1. Stack final aplikasi.
2. Pengguna umum perlu login atau tidak.
3. Riwayat hasil rekomendasi masuk MVP atau tidak.
4. Definisi dan referensi kategori skin tone.
5. Definisi dan metode identifikasi undertone.
6. Daftar kategori warna final dan metode pemetaan ke shade aktual.
7. Sumber data produk dan jumlah merek/alternatif.
8. Cara mendapatkan foto produk dan bukti sumbernya.
9. Cara mengukur atau menetapkan kecocokan skin tone.
10. Cara mengukur atau menetapkan kecocokan undertone.
11. Cara mengukur preferensi warna terhadap shade aktual.
12. Skala penilaian masing-masing kriteria.
13. Bobot setiap kriteria dan metode penentuan bobot.
14. Harga menjadi filter, kriteria cost, atau kombinasi yang dibenarkan.
15. Parameter VIKOR dan aturan solusi kompromi.
16. Jumlah alternatif hasil yang ditampilkan.
17. Cara pengujian rekomendasi (pakar, pengguna, perbandingan hasil, atau kombinasi).

## D. Larangan asumsi untuk coding agent

- Jangan memilih bobot sendiri.
- Jangan membuat tabel skin tone-to-blush shade sebagai fakta tanpa sumber/validasi.
- Jangan membuat produk dan harga fiktif untuk katalog produksi.
- Jangan mengklaim hasil ranking demo adalah hasil VIKOR.
- Jangan menambahkan fitur kamera, AI, AR, marketplace, atau transaksi.
- Jangan mengubah desain prototype tanpa persetujuan.
