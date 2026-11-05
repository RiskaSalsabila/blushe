'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface UserInfo {
  id: number;
  displayName: string;
  email: string;
}

export default function Navbar() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/user')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      window.location.reload();
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const scrollToApp = () => {
    const el = document.getElementById('prototype');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="topbar">
      <Link href="/" className="brand">
        <span className="brand-mark"></span> blushé
      </Link>
      <nav className="navlinks">
        <a href="#cara-kerja">Cara kerja</a>
        <a href="#prototype">Coba prototype</a>
        <a href="#catatan">Tentang rancangan</a>
        <a href="/admin" style={{ opacity: 0.8, fontSize: '11px' }}>
          Portal Admin ↗
        </a>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {!loading && (
          user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  fontSize: '12px',
                  color: 'var(--rose-dark)',
                  fontWeight: 600,
                  maxWidth: '120px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={user.displayName}
              >
                {user.displayName}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  border: '1px solid #dfc9c1',
                  background: 'transparent',
                  color: 'var(--muted)',
                  borderRadius: '999px',
                  padding: '5px 12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Keluar
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px' }}>
              <Link
                href="/login"
                style={{
                  color: 'var(--rose-dark)',
                  fontWeight: 600,
                  textDecoration: 'none',
                  padding: '4px 6px',
                }}
              >
                Masuk
              </Link>
              <Link
                href="/register"
                style={{
                  color: 'var(--muted)',
                  textDecoration: 'none',
                  padding: '4px 6px',
                }}
              >
                Daftar
              </Link>
            </div>
          )
        )}

        <button className="nav-cta" onClick={scrollToApp}>
          Mulai rekomendasi ↗
        </button>
      </div>
    </header>
  );
}
