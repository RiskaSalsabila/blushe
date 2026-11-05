# UI DESIGN SPEC — BLUSHÉ

## Sumber desain wajib

`prototype/index.html` adalah sumber kebenaran visual. HTML ini adalah prototype yang disukai pemilik proyek. Desain harus dipertahankan saat dipindahkan ke framework atau component architecture.

## Identitas visual

- Brand sementara: **Blushé**
- Gaya: warm, feminine, soft, elegant, minimalist, editorial beauty.
- Hindari: dark mode, dashboard template generik, warna neon, visual terlalu ramai, komponen berkesan admin pada halaman pengguna.

## Design tokens

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
  --shadow: 0 18px 55px rgba(86,57,45,.08);
}
```

Typography:
- Display/headings: Playfair Display, fallback Georgia/serif.
- Body/UI: DM Sans, fallback Arial/sans-serif.

## Pola komponen

1. Sticky top navigation: brand kiri, anchor links tengah/kanan, CTA pill.
2. Hero: copy dua kolom dan compact illustration bergaya blush compact dengan floating color swatches.
3. Cara kerja: empat preview cards.
4. Wizard: satu panel putih rounded, header langkah, progress bar, content, action area.
5. Choice cards: state normal, hover, selected. Swatch warna tampil jelas dan label tetap terbaca.
6. Budget options: card selectable, bukan select dropdown.
7. Results: summary pills, product cards, label peringkat, harga, CTA detail.
8. Product detail: modal dengan tombol close dan backdrop close.
9. Admin: boleh memakai struktur data table/form yang lebih fungsional, tetapi warna, font, radius, dan token tetap konsisten.

## Responsive behavior

- Desktop: hero dua kolom; preview cards empat kolom; choice cards mengikuti grid prototype.
- Tablet: hero satu kolom ketika lebar tidak cukup; grid cards berkurang.
- Mobile: nav disederhanakan; hero satu kolom; wizard padding mengecil; budget satu kolom; product card menumpuk dengan harga/CTA yang tetap mudah dijangkau.
- Tidak boleh ada horizontal overflow.

## Interaksi yang sudah ada di prototype

- CTA landing page scroll ke wizard.
- Wizard 4 langkah.
- Pilih skin tone tunggal.
- Pilih undertone tunggal.
- Pilih satu atau beberapa kelompok warna.
- Pilih formula tunggal, termasuk opsi tanpa preferensi.
- Pilih anggaran.
- Validasi sebelum berpindah langkah.
- Back/next.
- Result summary.
- Demo filter berdasarkan formula dan anggaran.
- Product detail modal.
- Ubah preferensi dan reset.

Ketika logika rekomendasi final belum tersedia, interaksi UI boleh memakai data demo yang diberi label simulasi. Jangan menghilangkan label tersebut.

## Konten dan tone

Gunakan Bahasa Indonesia yang hangat, sederhana, dan jelas. Label berbahasa Inggris yang umum dalam industri makeup boleh dipertahankan (Skin tone, Undertone, Powder, Liquid, Cream, Stick), tetapi penjelasannya harus mudah dipahami.

## Jangan lakukan

- Jangan mengganti logo/wordmark Blushé tanpa persetujuan.
- Jangan mengganti warna rose/cream dengan warna lain.
- Jangan membangun landing page seperti marketplace.
- Jangan menampilkan angka Q/S/R hasil VIKOR fiktif.
- Jangan memakai foto produk dummy sebagai produk asli.
