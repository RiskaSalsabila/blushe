# DATA MODEL & VIKOR IMPLEMENTATION NOTES

Dokumen ini membantu coding agent menyiapkan arsitektur tanpa mengunci keputusan penelitian yang belum disahkan.

## 1. Alternatif keputusan

Satu alternatif adalah satu kombinasi **produk + shade**. Contoh: Produk A / shade Soft Rose dan Produk A / shade Peach Bloom harus menjadi dua alternatif berbeda jika keduanya dinilai terpisah.

## 2. Data produk

Minimal atribut produk:
- brand
- product_name
- product_description (opsional)
- product_image_url/path (opsional)
- product_url (opsional)
- active_status

Minimal atribut shade:
- product_id
- shade_name
- formula
- color_family (opsional, kategori final menunggu validasi)
- swatch/color value (opsional; jangan menebak)
- price_idr
- source_url
- price_checked_at
- active_status

Harga dan keterangan produk harus punya sumber data yang dapat diperiksa. Data demo fiktif harus dipisahkan dari data aktual.

## 3. Input pengguna yang diprototipekan

| Input | Nilai prototype | Peran sementara |
|---|---|---|
| Skin tone | Fair, Light, Medium, Tan, Deep | Profil pengguna |
| Undertone | Warm, Cool, Neutral | Profil pengguna |
| Preferensi warna | Pink, Peach, Coral, Mauve, Berry, Terracotta | Preferensi pengguna; multi-select |
| Formula | Powder, Liquid, Cream, Stick, No preference | Filter alternatif |
| Budget | <=50k, 50–100k, 100–150k, no limit | Filter/batas; belum final |

Kategori ini hanya nilai prototype. Jangan menyatakan kategori tersebut sebagai klasifikasi ilmiah final tanpa rujukan dan persetujuan.

## 4. Kandidat kriteria VIKOR

Kandidat awal yang dibahas:
- C1: kecocokan skin tone.
- C2: kecocokan undertone.
- C3: kesesuaian preferensi warna.
- C4: harga (kemungkinan cost).

Semua kandidat harus divalidasi. Jangan mengisi nilai, skala, bobot, atau aturan pemetaan dengan asumsi. Struktur data harus memungkinkan kriteria berubah.

### Pertanyaan metodologis yang wajib dijawab sebelum perhitungan produksi

1. Bagaimana skor kecocokan skin tone ditentukan?
2. Bagaimana skor kecocokan undertone ditentukan?
3. Bagaimana preferensi warna multi-select diterjemahkan menjadi skor alternatif?
4. Apakah penilaian dilakukan oleh pakar, responden, aturan literatur, pengukuran warna, atau kombinasi?
5. Apa skala setiap kriteria dan bagaimana konsistensinya dijaga?
6. Bagaimana bobot diperoleh dan divalidasi?
7. Apakah harga hanya filter atau juga kriteria cost?
8. Apakah skor kriteria bersifat benefit atau cost?
9. Bagaimana nilai warna aktual produk didapatkan dan dikendalikan pencahayaannya bila diukur?
10. Parameter v dan aturan solusi kompromi VIKOR mana yang digunakan sesuai rujukan metodologi?

## 5. Alur filter dan ranking

Pipeline yang disarankan:

1. Ambil data produk-shade aktif.
2. Terapkan filter formula sesuai pilihan (kecuali no preference).
3. Terapkan batas anggaran bila pengguna memilih batas tertentu dan keputusan ini disahkan.
4. Validasi bahwa alternatif yang tersisa mencukupi dan mempunyai nilai pada seluruh kriteria yang diperlukan.
5. Bentuk matriks keputusan alternatif x kriteria.
6. Jalankan perhitungan VIKOR.
7. Kembalikan hasil ranking dan informasi yang menjelaskan ranking.
8. Simpan snapshot hasil jika fitur riwayat disetujui.

Jika tidak ada alternatif, tampilkan empty state dan tawarkan pengguna memperluas batasan (misalnya mengubah formula atau budget). Jangan mengabaikan filter secara diam-diam.

## 6. Rumus VIKOR untuk referensi implementasi

Gunakan rumus yang sama dengan metodologi final dan sumber yang akan dikutip dalam skripsi. Notasi umum:

- `f_ij`: nilai alternatif i pada kriteria j.
- `w_j`: bobot kriteria j, dengan total bobot mengikuti ketentuan metode.
- `f*_j`: nilai terbaik pada kriteria j.
- `f-_j`: nilai terburuk pada kriteria j.
- `S_i`: utility measure.
- `R_i`: individual regret.
- `Q_i`: indeks kompromi.
- `v`: parameter strategi kompromi.

Untuk kriteria benefit, nilai terbaik umumnya maksimum dan terburuk minimum. Untuk cost, nilai terbaik umumnya minimum dan terburuk maksimum. Normalisasi dan rumus lengkap wajib mengikuti referensi metodologi final.

Bentuk umum yang sering digunakan:

`S_i = Σ_j w_j * (f*_j - f_ij) / (f*_j - f-_j)`

`R_i = max_j [w_j * (f*_j - f_ij) / (f*_j - f-_j)]`

`Q_i = v * (S_i - S*) / (S- - S*) + (1-v) * (R_i - R*) / (R- - R*)`

Dengan `S* = min(S)`, `S- = max(S)`, `R* = min(R)`, dan `R- = max(R)`. Nilai Q yang lebih kecil biasanya menunjukkan posisi lebih baik dalam ranking kompromi.

**Penting:** formula, pembalikan normalisasi untuk benefit/cost, definisi solusi kompromi, acceptable advantage, acceptable stability, nilai `v`, dan kebijakan tie/zero denominator perlu dicocokkan dengan sumber VIKOR yang dipilih peneliti. Jangan mengimplementasikan formula di atas sebagai spesifikasi final tanpa pemeriksaan metodologi.

## 7. Pengujian algoritma

- Buat fixture kecil dengan 3–5 alternatif dan 3–4 kriteria.
- Hitung hasil fixture secara manual atau dengan spreadsheet terverifikasi.
- Bandingkan hasil service dengan hasil pembanding.
- Uji benefit dan cost.
- Uji bobot tidak valid.
- Uji nilai kosong.
- Uji denominator nol (semua alternatif sama pada satu kriteria).
- Uji satu alternatif tersisa setelah filter.
- Uji hasil seri/tie.
- Uji tidak ada alternatif setelah filter.
- Pastikan hasil deterministik untuk input sama.

## 8. Prinsip pemisahan kode

Pisahkan setidaknya:
- UI components.
- Form validation.
- Product catalog service/repository.
- Filter service.
- VIKOR calculation service.
- Admin access control.
- Demo/seed fixtures.

Jangan menaruh seluruh perhitungan VIKOR di event handler halaman UI.
