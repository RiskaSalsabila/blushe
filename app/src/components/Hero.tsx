'use client';

export default function Hero() {
  const scrollToApp = () => {
    const el = document.getElementById('prototype');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero">
      <div>
        <div className="eyebrow">A little color, a lot of you</div>
        <h1>
          Temukan shade yang <em>terasa milikmu.</em>
        </h1>
        <p>
          Eksplorasi rekomendasi blush on dengan mempertimbangkan karakteristik warna kulit, warna yang kamu sukai, dan pilihan produkmu.
        </p>
        <div className="hero-actions">
          <button className="primary" onClick={scrollToApp}>
            Mulai eksplorasi <span aria-hidden="true">→</span>
          </button>
          <a className="secondary" href="#cara-kerja">
            Lihat cara kerja
          </a>
        </div>
      </div>
      <div className="hero-art" aria-label="Ilustrasi compact blush dan swatch warna">
        <div className="compact"></div>
        <span className="floating-swatch sw1"></span>
        <span className="floating-swatch sw2"></span>
        <span className="floating-swatch sw3"></span>
      </div>
    </section>
  );
}
