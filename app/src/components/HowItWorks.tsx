export default function HowItWorks() {
  return (
    <section className="section" id="cara-kerja">
      <div className="section-inner">
        <div className="section-head">
          <div className="eyebrow">A simple little journey</div>
          <h2>Mulai dari dirimu.</h2>
          <p>
            Isi beberapa preferensi sederhana. Prototype ini memperlihatkan alur awal bagaimana sistem nantinya mengolah profil pengguna menjadi rekomendasi produk dan shade.
          </p>
        </div>
        <div className="steps-preview">
          <article className="preview-card">
            <span className="preview-num">01</span>
            <h3>Kenali kulitmu</h3>
            <p>Pilih skin tone dan undertone sebagai informasi karakteristik pengguna.</p>
          </article>
          <article className="preview-card">
            <span className="preview-num">02</span>
            <h3>Pilih favoritmu</h3>
            <p>Tentukan kelompok warna dan formula blush yang ingin digunakan.</p>
          </article>
          <article className="preview-card">
            <span className="preview-num">03</span>
            <h3>Tentukan anggaran</h3>
            <p>Atur batas harga agar alternatif produk sesuai kebutuhan.</p>
          </article>
          <article className="preview-card">
            <span className="preview-num">04</span>
            <h3>Lihat rekomendasi</h3>
            <p>Temukan contoh urutan produk dan shade yang dapat dipertimbangkan.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
