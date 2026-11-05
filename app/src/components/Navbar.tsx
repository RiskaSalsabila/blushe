'use client';

export default function Navbar() {
  const scrollToApp = () => {
    const el = document.getElementById('prototype');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="topbar">
      <a href="#" className="brand">
        <span className="brand-mark"></span> blushé
      </a>
      <nav className="navlinks">
        <a href="#cara-kerja">Cara kerja</a>
        <a href="#prototype">Coba prototype</a>
        <a href="#catatan">Tentang rancangan</a>
        <a href="/admin" style={{ opacity: 0.8, fontSize: '11px' }}>Portal Admin ↗</a>
      </nav>
      <button className="nav-cta" onClick={scrollToApp}>
        Mulai rekomendasi ↗
      </button>
    </header>
  );
}
