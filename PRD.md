# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Blushé — Sistem Pendukung Keputusan Rekomendasi Produk dan Shade Blush On

**Versi dokumen:** 0.1 (draft untuk handoff coding agent)  
**Tanggal:** 2 November 2026  
**Status:** Konsep awal / belum menjadi spesifikasi metodologi final  
**Bahasa aplikasi:** Bahasa Indonesia  
**Platform target:** Website responsif  
**Metode yang direncanakan:** VIKOR (masih perlu validasi rancangan akademik)

---

## 1. Ringkasan Produk

Blushé adalah rancangan sistem pendukung keputusan berbasis web untuk membantu pengguna menemukan alternatif **produk dan shade blush on** berdasarkan karakteristik warna kulit, preferensi warna pribadi, serta atribut produk yang relevan.

Pengguna memberikan informasi profil kulit secara mandiri, memilih warna yang disukai, memilih formula blush on yang ingin digunakan, dan menentukan batas anggaran. Sistem kemudian menyaring alternatif yang tidak sesuai dengan batasan pengguna dan, setelah kriteria serta model penilaian disahkan, memeringkat alternatif produk-shade menggunakan metode VIKOR.

Prototype HTML yang disertakan adalah **acuan utama desain visual dan alur interaksi**. Coding agent wajib memakainya sebagai sumber desain. Jangan membuat ulang tampilan dengan gaya yang berbeda.

### 1.1 Masalah yang ingin dibantu

Pemilihan blush on melibatkan lebih dari satu pertimbangan. Shade yang dinilai sesuai dengan karakteristik kulit belum tentu merupakan warna yang disukai pengguna. Selain itu, pengguna dapat memiliki preferensi formula dan batas harga tertentu. Aplikasi ditujukan untuk menyusun beberapa pertimbangan tersebut menjadi rekomendasi produk dan shade yang lebih terstruktur.

### 1.2 Tujuan produk

1. Memudahkan pengguna memasukkan karakteristik warna kulit dan preferensi pribadi.
2. Membatasi alternatif produk berdasarkan pilihan formula dan anggaran pengguna.
3. Memeringkat kombinasi produk dan shade berdasarkan model keputusan multikriteria yang telah divalidasi.
4. Menyajikan hasil rekomendasi dengan informasi produk yang jelas dan dapat ditelusuri.
5. Menyediakan sisi admin untuk mengelola katalog, shade, kriteria, bobot, serta nilai alternatif.

### 1.3 Bukan tujuan produk

- Bukan marketplace dan tidak memproses transaksi, pembayaran, atau pengiriman.
- Tidak melakukan deteksi skin tone otomatis melalui kamera pada MVP.
- Tidak menyediakan virtual try-on atau augmented reality.
- Tidak membuat klaim medis atau diagnosis kondisi kulit.
- Tidak menggunakan AI generatif untuk menentukan rekomendasi.

---

## 2. Pengguna dan Peran

### 2.1 Pengguna umum

Orang yang ingin mendapatkan rekomendasi blush on. Pengguna mengisi profil dan preferensi, melihat hasil pemeringkatan, lalu membuka detail produk.

### 2.2 Admin

Pengelola data sistem. Admin mengelola produk, shade, atribut produk, kriteria, bobot, nilai alternatif, dan memeriksa proses VIKOR.

### 2.3 Autentikasi

- **Admin:** wajib menggunakan autentikasi dan otorisasi yang aman.
- **Pengguna umum:** login/registrasi belum ditetapkan sebagai kebutuhan MVP. Jangan menambahkan akun pengguna hanya karena sistem referensi memilikinya. Riwayat rekomendasi lintas sesi memerlukan keputusan terpisah.

---

## 3. Ruang Lingkup MVP

### 3.1 Fitur wajib sisi pengguna

1. Landing page.
2. Wizard pengisian karakteristik kulit.
3. Wizard preferensi warna dan formula.
4. Wizard anggaran dan konfirmasi.
5. Hasil rekomendasi produk dan shade.
6. Detail produk.
7. Validasi input dan empty state jika tidak ada alternatif yang cocok.
8. Tampilan responsif untuk desktop dan ponsel.

### 3.2 Fitur wajib sisi admin

1. Login admin.
2. Dashboard ringkas.
3. CRUD merek/produk.
4. CRUD shade per produk.
5. Pengelolaan atribut alternatif produk-shade.
6. Pengelolaan kriteria dan bobot (setelah disahkan).
7. Pengelolaan nilai alternatif (setelah skema penilaian disahkan).
8. Proses dan pemeriksaan perhitungan VIKOR.

### 3.3 Fitur opsional / fase berikutnya

- Riwayat rekomendasi pengguna.
- Ekspor hasil rekomendasi.
- Statistik penggunaan.
- Perbandingan beberapa produk.
- Login/registrasi pengguna.
- Panel pengelolaan sumber data dan tanggal pembaruan harga.

Jangan menambahkan fitur opsional ke MVP tanpa persetujuan pemilik proyek.

---

## 4. Alur Pengguna Utama

Alur harus mempertahankan empat tahap wizard pada prototype HTML.

### Tahap 0 — Karakteristik kulit

Pengguna memilih:

**Skin tone (opsi prototype, masih provisional):**
- Fair
- Light
- Medium
- Tan
- Deep

**Undertone (opsi prototype, masih provisional):**
- Warm
- Cool
- Neutral

Input ini merupakan penilaian mandiri pengguna, bukan hasil deteksi otomatis. UI harus memberi keterangan singkat yang netral dan tidak menjanjikan klasifikasi pasti. Kategori dan cara penjelasan harus dikaji melalui literatur serta arahan dosen sebelum dianggap final.

### Tahap 1 — Preferensi warna dan formula

**Preferensi warna (prototype saat ini):**
- Pink
- Peach
- Coral
- Mauve
- Berry
- Terracotta

Pengguna boleh memilih lebih dari satu kelompok warna.

**Preferensi formula (prototype saat ini):**
- Powder
- Liquid
- Cream
- Stick
- Bebas / tanpa preferensi

Formula adalah **filter alternatif berdasarkan pilihan pengguna**, bukan kriteria yang menilai satu formula lebih baik daripada formula lain. Jika pengguna memilih satu formula, sistem hanya mempertimbangkan alternatif dengan formula tersebut. Jika pengguna memilih “Bebas”, seluruh formula yang tersedia dapat dipertimbangkan.

### Tahap 2 — Anggaran

Prototype menyediakan empat pilihan rentang:
- Di bawah Rp50.000
- Rp50.000–Rp100.000
- Rp100.000–Rp150.000
- Tanpa batas khusus

Nilai dan bentuk pilihan anggaran masih provisional. Coding agent harus membuatnya mudah dikonfigurasi, bukan hard-coded ke seluruh komponen.

**Keputusan metodologis yang belum final:** apakah anggaran hanya menjadi filter, atau harga juga digunakan sebagai kriteria cost di VIKOR. Jika keduanya dipakai, alasan dan dampaknya harus dijelaskan dengan jelas agar peran harga tidak rancu. Jangan menetapkan sendiri keputusan final ini.

### Tahap 3 — Hasil rekomendasi

Halaman hasil menampilkan:
- Ringkasan input pengguna.
- Daftar produk dan shade yang direkomendasikan.
- Peringkat alternatif.
- Nama merek dan produk.
- Nama shade.
- Formula.
- Harga.
- Informasi warna/swatches jika datanya tersedia dan valid.
- Penjelasan singkat yang diturunkan dari data/kriteria aktual.
- Aksi membuka detail produk.

Prototype saat ini menampilkan maksimal tiga alternatif. Pertahankan sebagai default visual, tetapi buat jumlah hasil mudah dikonfigurasi. Jangan menyebut urutan contoh sebagai hasil VIKOR.

### Detail produk

Halaman/detail modal menampilkan informasi produk dan shade yang tersedia, sekurang-kurangnya nama merek, nama produk, shade, formula, harga, gambar jika tersedia, serta sumber data/tautan resmi atau toko jika telah diverifikasi.

---

## 5. Alur Admin

Admin harus dapat:

1. Masuk melalui halaman login admin.
2. Melihat ringkasan jumlah merek, produk, shade, dan alternatif aktif.
3. Menambah, melihat, mengubah, dan menonaktifkan produk.
4. Menambah beberapa shade untuk satu produk.
5. Menyimpan atribut tiap kombinasi produk-shade.
6. Mengelola kriteria dan bobot hanya jika definisi telah disahkan.
7. Mengelola nilai alternatif berdasarkan pedoman skala yang terdokumentasi.
8. Menjalankan perhitungan VIKOR dan melihat tabel nilai S, R, Q serta urutan peringkat.
9. Melihat validasi data: bobot, nilai kosong, arah kriteria benefit/cost, dan alternatif yang tidak lengkap.

**Catatan:** bagian admin dalam HTML prototype saat ini hanya berupa panel penjelasan rancangan, bukan dashboard admin yang fungsional. Bangun halaman admin terpisah; jangan menampilkan panel penjelasan tersebut sebagai pengganti modul admin final.

---

## 6. Rancangan Kriteria dan Aturan Keputusan

Semua kriteria di bagian ini masih **kandidat awal**. Coding agent harus menyiapkan struktur yang fleksibel dan tidak mengunci skor/bobot sampai pemilik proyek memberikan hasil kajian literatur dan keputusan dosen.

| Kode | Kandidat kriteria | Peran sementara | Status |
|---|---|---|---|
| C1 | Kecocokan dengan skin tone | Penilaian alternatif | Perlu validasi definisi dan skala |
| C2 | Kecocokan dengan undertone | Penilaian alternatif | Perlu validasi definisi dan skala |
| C3 | Kesesuaian preferensi warna | Penilaian alternatif | Perlu metode pemetaan preferensi ke nilai |
| C4 | Harga produk | Kemungkinan kriteria cost | Perlu keputusan hubungan dengan filter anggaran |
| F1 | Formula blush on | Filter alternatif | Preferensi langsung pengguna |
| F2 | Batas anggaran | Filter atau batasan | Belum final |

### 6.1 Aturan yang tidak boleh diasumsikan

- Jangan hard-code bahwa shade tertentu pasti cocok untuk skin tone/undertone tertentu tanpa matriks penilaian yang bersumber dan disetujui.
- Jangan menganggap nama warna produk sama dengan warna visual aktualnya.
- Jangan menyamakan undertone kulit dengan kategori warna blush secara langsung.
- Jangan menetapkan bobot kriteria tanpa dasar.
- Jangan membuat skor alternatif secara acak untuk data produksi.
- Jangan menyajikan hasil demo sebagai rekomendasi yang tervalidasi.

### 6.2 Matriks keputusan

Setiap alternatif adalah satu kombinasi **produk + shade**, bukan sekadar merek atau produk induk. Setiap alternatif mempunyai nilai pada kriteria yang telah disahkan.

Data nilai dapat dikelola oleh admin berdasarkan pedoman penilaian yang terdokumentasi. Jika penilaian memerlukan pakar atau responden, sistem perlu mendukung proses tersebut setelah rancangan penelitian disepakati.

### 6.3 Catatan implementasi VIKOR

Implementasi VIKOR harus dipisahkan dari UI (misalnya sebagai service/module tersendiri), memiliki unit test, dan tidak mencampur logika filter dengan perhitungan ranking.

Untuk matriks alternatif i dan kriteria j, implementasi mengikuti formula VIKOR yang disepakati dalam metodologi final:

- Tentukan solusi terbaik dan terburuk per kriteria sesuai arah benefit/cost.
- Hitung utility measure S untuk total regret berbobot.
- Hitung individual regret R untuk regret maksimum berbobot.
- Hitung indeks kompromi Q dengan parameter v.
- Urutkan Q dari nilai terkecil ke terbesar.
- Periksa kondisi solusi kompromi/acceptable advantage dan acceptable stability jika metode yang digunakan mensyaratkannya.

Jangan menetapkan nilai parameter v, bobot, arah kriteria, transformasi skala, atau aturan solusi kompromi sebagai keputusan final tanpa persetujuan pemilik proyek. Tangani denominator nol, data kosong, bobot tidak berjumlah satu, jumlah alternatif terlalu sedikit, dan nilai seri dengan jelas.

---

## 7. Data Produk dan Model Data Awal

Model berikut adalah rancangan konseptual. Penamaan tabel dapat menyesuaikan stack yang dipilih.

### 7.1 Entitas utama

**Brand**
- id
- name
- website_url (nullable)
- is_active

**Product**
- id
- brand_id
- product_name
- description (nullable)
- product_url (nullable)
- image_url/path (nullable)
- is_active
- created_at / updated_at

**ProductShade (alternatif)**
- id
- product_id
- shade_name
- shade_description (nullable)
- formula: powder/liquid/cream/stick/other
- color_family (nullable; mengikuti kategori yang disahkan)
- color_hex (nullable; hanya jika nilai warna bersumber/terukur dengan benar)
- price_idr
- price_source_url (nullable)
- price_checked_at (nullable)
- is_active

**Criterion**
- id
- code
- name
- description
- type/direction (benefit/cost; ditentukan setelah disahkan)
- scale_definition
- weight
- is_active
- version/effective_date (disarankan)

**AlternativeScore**
- id
- product_shade_id
- criterion_id
- score
- score_source / rationale
- assessed_by (nullable)
- assessed_at

**AdminUser**
- id
- username/email
- password_hash (jangan menyimpan password plaintext)
- role
- is_active

**RecommendationSession (opsional)**
- id
- user_profile_snapshot (atau kolom terstruktur)
- selected_colors
- selected_formula
- budget_limit
- criteria_version
- created_at

**RecommendationResult (opsional)**
- id
- session_id
- product_shade_id
- S_value
- R_value
- Q_value
- rank

### 7.2 Integritas data

- Satu produk dapat memiliki banyak shade.
- Setiap shade harus terhubung ke tepat satu produk.
- Alternatif yang dihitung adalah shade yang aktif dan lolos filter.
- Harga disimpan dalam rupiah sebagai bilangan numerik/integer, bukan string berformat.
- Simpan URL sumber dan waktu pengecekan harga jika tersedia.
- Jangan mengisi data produk, harga, shade, atau foto fiktif pada lingkungan produksi.
- Gunakan data contoh hanya pada seed/demo terpisah dengan label yang jelas.

---

## 8. UI/UX dan Identitas Visual

**Sumber kebenaran desain:** `prototype/index.html` pada paket ini. File tersebut harus dipelajari sebelum mengubah atau mengimplementasikan antarmuka.

### 8.1 Prinsip wajib

1. Pertahankan nama visual sementara **Blushé**.
2. Pertahankan gaya feminine, warm, minimal, elegant, dan editorial.
3. Pertahankan komposisi hero, ilustrasi compact blush abstrak, floating swatches, kartu, wizard bertahap, progress bar, kartu hasil, dan modal detail.
4. Jangan mengganti desain menjadi dashboard generik, tema gelap, atau template admin yang tidak berhubungan.
5. Gunakan file HTML sebagai referensi visual dan perilaku yang sudah ada. Jika dipindahkan ke React/Vue/stack lain, port struktur dan CSS-nya, bukan membuat desain baru.
6. Pertahankan responsivitas dan interaksi yang sudah berfungsi.

### 8.2 Design tokens dari prototype

| Token | Nilai |
|---|---|
| Ink | `#302521` |
| Muted | `#84736d` |
| Rose | `#b96f70` |
| Rose dark | `#915455` |
| Rose light | `#f5e7e3` |
| Cream | `#fbf8f4` |
| Paper | `#fffdfa` |
| Line | `#eee4de` |
| Green | `#667c68` |
| Body font | DM Sans |
| Display font | Playfair Display |

### 8.3 Perilaku visual yang wajib dipertahankan

- Navigasi sticky di bagian atas.
- Hero dua kolom di desktop dan satu kolom di ponsel.
- Wizard empat langkah dengan progress bar.
- Pilihan berupa selectable cards dengan state selected yang jelas.
- Tombol kembali/lanjutkan dan validasi sebelum berpindah langkah.
- Ringkasan profil di hasil.
- Kartu produk berisi shade, formula, harga, dan tombol detail.
- Modal detail dapat ditutup melalui tombol close dan klik backdrop.
- Layout responsif pada layar kecil.

### 8.4 Catatan aset dan font

Prototype memuat Google Fonts import untuk DM Sans dan Playfair Display. Pertahankan jika kebijakan proyek mengizinkan akses eksternal; sediakan fallback font. Gambar produk final harus berasal dari katalog yang dapat diverifikasi dan penggunaannya sah. Jangan memakai gambar contoh/placeholder sebagai foto produk asli.

---

## 9. Persyaratan Fungsional (Functional Requirements)

| ID | Persyaratan | Prioritas |
|---|---|---|
| FR-01 | Pengunjung dapat membuka landing page dan memahami fungsi sistem | Must |
| FR-02 | Pengunjung dapat memilih satu skin tone dan satu undertone | Must |
| FR-03 | Pengunjung dapat memilih satu atau lebih preferensi warna | Must |
| FR-04 | Pengunjung dapat memilih satu formula atau tanpa preferensi formula | Must |
| FR-05 | Pengunjung dapat menentukan batas anggaran atau tanpa batas | Must, opsi final pending |
| FR-06 | Wizard memvalidasi langkah sebelum lanjut | Must |
| FR-07 | Pengunjung dapat kembali dan mengubah pilihan | Must |
| FR-08 | Sistem memfilter alternatif berdasarkan formula dan batasan yang disahkan | Must |
| FR-09 | Sistem menghasilkan peringkat menggunakan VIKOR setelah metode final tersedia | Must for production |
| FR-10 | Sistem menampilkan ringkasan pilihan dan hasil rekomendasi | Must |
| FR-11 | Pengunjung dapat membuka detail produk-shade | Must |
| FR-12 | Sistem menampilkan empty state jika tidak ada alternatif | Must |
| FR-13 | Admin dapat login dan logout dengan aman | Must |
| FR-14 | Admin dapat CRUD produk dan shade | Must |
| FR-15 | Admin dapat mengelola kriteria, bobot, dan nilai alternatif sesuai hak akses | Must after method approval |
| FR-16 | Admin dapat melihat detail perhitungan VIKOR | Must for auditability |
| FR-17 | Sistem dapat menyimpan riwayat rekomendasi | Should / pending login decision |

---

## 10. Persyaratan Non-Fungsional

- **Responsif:** usable pada desktop, tablet, dan ponsel.
- **Bahasa:** seluruh antarmuka utama menggunakan Bahasa Indonesia, istilah teknis dapat disertai label Inggris yang umum.
- **Mata uang:** Rupiah (IDR), format lokal Indonesia.
- **Usability:** langkah input ringkas, instruksi jelas, validasi mudah dipahami.
- **Accessibility:** tombol dapat dioperasikan keyboard, label input tersedia, kontras memadai, gambar produk memiliki alt text.
- **Security:** admin route dilindungi; password di-hash; validasi dilakukan di server; rahasia tidak disimpan di frontend; akses database tidak langsung dari browser.
- **Data integrity:** nilai, harga, formula, dan shade tervalidasi; perubahan data penting tercatat.
- **Explainability:** hasil harus dapat ditelusuri ke data dan kriteria yang digunakan.
- **Maintainability:** perhitungan VIKOR terpisah dari komponen UI dan memiliki unit test.

---

## 11. Acceptance Criteria / Definition of Done

### Front-end

- [ ] Tampilan utama secara visual mengikuti `prototype/index.html`.
- [ ] Identitas Blushé, palet warna, tipografi, hero, card, wizard, dan modal tetap konsisten.
- [ ] Empat langkah wizard dapat digunakan dari awal sampai hasil.
- [ ] Tombol kembali, lanjutkan, ubah preferensi, reset, dan detail berfungsi.
- [ ] Validasi input muncul dengan pesan yang jelas.
- [ ] Tidak ada overflow horizontal pada layar ponsel.
- [ ] Data demo diberi label SIMULASI/DEMO.

### Backend/data

- [ ] Admin dapat masuk dan hanya admin berwenang yang dapat mengelola katalog.
- [ ] Produk dapat memiliki lebih dari satu shade.
- [ ] Alternatif yang masuk perhitungan adalah kombinasi produk-shade.
- [ ] Data harga memiliki satuan IDR dan sumber data jika tersedia.
- [ ] Produk nonaktif tidak masuk rekomendasi.
- [ ] Filter formula dan anggaran bekerja sesuai keputusan final.

### Algoritma

- [ ] Implementasi VIKOR mengikuti rumus dan definisi kriteria yang disahkan.
- [ ] Bobot tervalidasi dan total bobot sesuai aturan.
- [ ] Arah benefit/cost jelas.
- [ ] Penanganan denominator nol, nilai kosong, dan nilai seri diuji.
- [ ] Hasil S, R, Q dan urutan ranking dapat direproduksi.
- [ ] Hasil demo tidak diklaim sebagai hasil penelitian final.

---

## 12. Rencana Implementasi Bertahap

### Fase 0 — Reproduksi prototype (prioritas awal)

- Baca `prototype/index.html` seluruhnya.
- Buat salinan kerja dan jaga file referensi asli agar tidak berubah.
- Port halaman ke arsitektur aplikasi yang dipilih sambil mempertahankan desain dan interaksi.
- Pertahankan sample data di satu modul terpisah.
- Tandai semua data dan rekomendasi sebagai DEMO.

### Fase 1 — Struktur aplikasi dan katalog

- Siapkan routing halaman pengguna dan admin.
- Siapkan skema database.
- Implementasikan autentikasi admin.
- Implementasikan CRUD brand, product, product shade.
- Integrasikan katalog produk aktual setelah data diverifikasi.

### Fase 2 — Metode keputusan

- Tunggu definisi kriteria, bobot, arah benefit/cost, skala, dan pemetaan nilai disahkan.
- Implementasikan modul VIKOR yang terisolasi.
- Buat unit test berdasarkan contoh matriks keputusan yang sudah dihitung manual/diverifikasi.
- Sambungkan hasil ranking ke halaman hasil.

### Fase 3 — Pengujian dan evaluasi

- Uji fungsional seluruh alur.
- Uji responsivitas dan aksesibilitas dasar.
- Uji validasi data dan keamanan admin.
- Uji akurasi implementasi perhitungan dengan perhitungan pembanding.
- Lakukan evaluasi pengguna/usability sesuai rancangan penelitian.

---

## 13. Keputusan yang Masih Terbuka

Coding agent wajib menandai poin berikut sebagai `PENDING_DECISION` dan tidak memutuskan secara diam-diam:

1. Stack final frontend, backend, dan database.
2. Apakah pengguna perlu login/registrasi.
3. Apakah fitur riwayat rekomendasi masuk MVP.
4. Definisi operasional skin tone dan undertone serta sumber klasifikasinya.
5. Apakah preferensi warna menggunakan kategori warna, swatch terukur, atau kombinasi keduanya.
6. Bagaimana mengubah kecocokan skin tone menjadi nilai alternatif.
7. Bagaimana mengubah kecocokan undertone menjadi nilai alternatif.
8. Bagaimana mengukur kesesuaian preferensi warna pengguna dengan shade produk.
9. Apakah harga hanya filter, kriteria cost, atau mempunyai dua peran dengan justifikasi yang jelas.
10. Bobot setiap kriteria dan metode penentuannya.
11. Skala penilaian alternatif dan siapa yang memberikan nilai.
12. Parameter VIKOR (termasuk nilai v) dan aturan solusi kompromi yang akan diterapkan.
13. Sumber katalog produk, cakupan merek, jumlah alternatif, dan prosedur validasi harga.
14. Jumlah produk teratas yang ditampilkan kepada pengguna.

---

## 14. Risiko dan Mitigasi

| Risiko | Mitigasi |
|---|---|
| Kriteria belum memiliki dasar ilmiah | Jangan hard-code; tunggu literatur dan validasi |
| Preferensi warna sulit dikuantifikasi | Pisahkan data input dan fungsi pemetaan nilai; dokumentasikan sumber skala |
| Nama shade tidak mewakili warna aktual | Simpan data warna/swatch dengan sumber yang jelas; jangan menebak dari nama |
| Katalog produk tidak lengkap | Sediakan validasi katalog dan empty state |
| Harga berubah | Simpan sumber dan tanggal pemeriksaan harga |
| Rekomendasi demo disangka hasil penelitian | Beri banner DEMO/SIMULASI dan pisahkan seed data |
| Formula/anggaran menyaring semua alternatif | Tampilkan pesan tidak ada alternatif dan opsi mengubah filter |
| VIKOR salah implementasi | Pisahkan service, buat unit test dan contoh hitung terverifikasi |

---

## 15. Referensi Konteks Produk

Referensi berikut menjadi inspirasi struktur dan konteks pengembangan, bukan spesifikasi yang harus disalin mentah:

1. Sausan Trisdiatin (2025), *Sistem Pendukung Keputusan Pemilihan Skincare Berbasis Web Menggunakan Metode Simple Additive Weighting*, Universitas Islam Indonesia. Digunakan sebagai referensi pola halaman pengguna, wizard analisis, hasil, detail produk, dan pengelolaan admin.
2. Lisa Tabah Pratiwi (2021), *Sistem Pendukung Keputusan Pemilihan Makeup Menggunakan Metode Analytical Hierarchy Process (AHP) Berbasis Website*, Politeknik Negeri Jakarta. Digunakan sebagai referensi konsep SPK makeup dan profil pengguna.
3. Novi Yuda Ningtias (2022), *Aplikasi Pemilihan Produk Skincare Wajah Berdasarkan Jenis Kulit Menggunakan Algoritma Simple Additive Weighting (SAW) Berbasis Website*, Universitas Pembangunan Jaya. Digunakan sebagai referensi pemisahan fungsi pengguna dan admin.
4. Utami et al. (2025), *Web-Based Makeup Recommendation System Using Hybrid Filtering*, Journal of Applied Informatics and Computing, 9(3), 683–692. DOI: 10.30871/jaic.v9i3.9339. Digunakan sebagai referensi sistem katalog dan rekomendasi kosmetik.

Referensi akademik di atas tetap perlu diperiksa kembali pada dokumen sumber saat menyusun BAB I/BAB II. PRD ini adalah dokumen kebutuhan perangkat lunak, bukan pengganti kajian literatur skripsi.

---

## 16. Lampiran

- `prototype/index.html` — prototype HTML asli, acuan visual utama.
- `prototype/README.txt` — cara membuka prototype dan batasan demo.
- `AGENT_PROMPT.md` — prompt siap salin ke coding agent.
- `UI_DESIGN_SPEC.md` — design tokens, layout, dan interaksi.
- `DATA_AND_VIKOR_SPEC.md` — model data dan catatan algoritma.
- `DECISIONS_AND_OPEN_QUESTIONS.md` — keputusan sementara dan pertanyaan terbuka.
