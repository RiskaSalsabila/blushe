'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/admin');
      } else {
        setError(data.message || 'Login gagal');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--cream)', padding: '24px' }}>
      <div style={{ maxWidth: '420px', width: '100%', background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: '20px', padding: '36px', boxShadow: 'var(--shadow)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span className="brand-mark"></span>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', margin: '14px 0 6px' }}>Portal Admin</h2>
          <p style={{ fontSize: '13px', color: 'var(--muted)', margin: 0 }}>Pengelolaan data katalog & audit metode VIKOR</p>
        </div>

        {error && (
          <div style={{ background: '#fdf2f2', border: '1px solid #f8b4b4', color: '#9b1c1c', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', marginBottom: '18px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: '100%', padding: '11px 14px', border: '1px solid var(--line)', borderRadius: '10px', background: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '11px 14px', border: '1px solid var(--line)', borderRadius: '10px', background: '#fff' }}
            />
          </div>

          <button
            type="submit"
            className="primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
          >
            {loading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
          </button>
        </form>

        <div className="inline-note" style={{ marginTop: '22px' }}>
          <strong>Info Demo:</strong> Akun admin default: <code>admin</code> / <code>admin123</code>.
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a href="/" style={{ fontSize: '12px', color: 'var(--muted)', textDecoration: 'none' }}>
            ← Kembali ke Halaman Utama
          </a>
        </div>
      </div>
    </div>
  );
}
