'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Frontend validations
    if (!displayName.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Seluruh kolom wajib diisi.');
      return;
    }

    if (password.length < 8) {
      setError('Password minimal 8 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak sesuai.');
      return;
    }

    if (!privacyConsent) {
      setError('Persetujuan privasi wajib dicentang sebelum mendaftar.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: displayName.trim(),
          email: email.trim(),
          password,
          confirmPassword,
          privacyConsent,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || 'Terjadi kesalahan saat registrasi.');
        return;
      }

      // Registrasi berhasil -> langsung arahkan ke beranda atau wizard
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
          maxWidth: '480px',
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
            Akun Pengguna
          </div>
          <h2
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '28px',
              margin: '8px 0 6px',
              fontWeight: 500,
            }}
          >
            Daftar ke Blushé
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>
            Buat akun untuk menyimpan preferensi kulit dan sesi rekomendasi shade blush on milikmu.
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
              Nama Pengguna
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="misal: Riska Salsabila"
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
              placeholder="Minimal 8 karakter"
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
              Konfirmasi Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password di atas"
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

          {/* Kotak Informasi dan Persetujuan Privasi */}
          <div
            style={{
              background: '#faf5f1',
              border: '1px solid var(--line)',
              borderRadius: '14px',
              padding: '14px 16px',
              marginTop: '4px',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--rose-dark)',
                fontWeight: 700,
                marginBottom: '6px',
              }}
            >
              Informasi Persetujuan Privasi (v1.0)
            </div>
            <p
              style={{
                fontSize: '12px',
                color: '#6e5d57',
                lineHeight: 1.6,
                margin: '0 0 10px',
              }}
            >
              Data akun yang kamu berikan digunakan untuk keperluan autentikasi dan
              pengelolaan sesi rekomendasi pada aplikasi Blushé. Data tidak digunakan untuk
              tujuan lain di luar fungsi aplikasi dan kegiatan penelitian yang telah dijelaskan.
            </p>
            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                cursor: 'pointer',
                fontSize: '12px',
                color: 'var(--ink)',
                fontWeight: 500,
                userSelect: 'none',
              }}
            >
              <input
                type="checkbox"
                checked={privacyConsent}
                onChange={(e) => setPrivacyConsent(e.target.checked)}
                style={{
                  marginTop: '2px',
                  width: '16px',
                  height: '16px',
                  accentColor: 'var(--rose-dark)',
                  cursor: 'pointer',
                }}
              />
              <span>Saya telah membaca dan menyetujui informasi privasi di atas.</span>
            </label>
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
            {loading ? 'Mendaftarkan akun...' : 'Daftar Sekarang →'}
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
          Sudah memiliki akun?{' '}
          <Link
            href="/login"
            style={{ color: 'var(--rose-dark)', fontWeight: 600, textDecoration: 'none' }}
          >
            Masuk di sini
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
