'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || 'Email atau password tidak sesuai.');
        return;
      }

      // Login berhasil -> arahkan ke halaman utama atau wizard
      router.push('/#prototype');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Koneksi gagal. Silakan coba beberapa saat lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'var(--cream)',
        padding: '36px 20px',
      }}
    >
      <div
        style={{
          maxWidth: '440px',
          width: '100%',
          background: 'var(--paper)',
          border: '1px solid var(--line)',
          borderRadius: '24px',
          padding: '36px 32px',
          boxShadow: 'var(--shadow)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Link
            href="/"
            className="brand"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <span className="brand-mark"></span> blushé
          </Link>
          <div className="eyebrow" style={{ marginTop: '14px' }}>
            Masuk Pengguna
          </div>
          <h2
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '28px',
              margin: '8px 0 6px',
              fontWeight: 500,
            }}
          >
            Selamat Datang Kembali
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>
            Masuk untuk mengakses rekomendasi shade yang sesuai dengan profil kulitmu.
          </p>
        </div>

        {error && (
          <div
            style={{
              background: '#fdf2f2',
              border: '1px solid #f8b4b4',
              color: '#9b1c1c',
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '13px',
              marginBottom: '20px',
              lineHeight: 1.5,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--ink)',
                marginBottom: '6px',
              }}
            >
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid var(--line)',
                background: '#fff',
                fontSize: '14px',
                color: 'var(--ink)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--ink)',
                marginBottom: '6px',
              }}
            >
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password akunmu"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid var(--line)',
                background: '#fff',
                fontSize: '14px',
                color: 'var(--ink)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="primary"
            style={{
              width: '100%',
              padding: '13px',
              marginTop: '6px',
              fontSize: '14px',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Memproses...' : 'Masuk ke Blushé →'}
          </button>
        </form>

        <div
          style={{
            textAlign: 'center',
            marginTop: '22px',
            paddingTop: '18px',
            borderTop: '1px solid var(--line)',
            fontSize: '13px',
            color: 'var(--muted)',
          }}
        >
          Belum memiliki akun?{' '}
          <Link
            href="/register"
            style={{ color: 'var(--rose-dark)', fontWeight: 600, textDecoration: 'none' }}
          >
            Daftar sekarang
          </Link>
          <div style={{ marginTop: '12px' }}>
            <Link
              href="/"
              style={{ color: 'var(--muted)', fontSize: '12px', textDecoration: 'none' }}
            >
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
