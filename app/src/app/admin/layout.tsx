'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Jika di halaman login, tampilkan langsung tanpa shell admin nav
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/products', label: 'Produk & Shade' },
    { href: '/admin/criteria', label: 'Kriteria & Bobot' },
    { href: '/admin/vikor', label: 'Audit VIKOR' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      {/* Admin Topbar */}
      <header
        style={{
          minHeight: '68px',
          height: 'auto',
          borderBottom: '1px solid var(--line)',
          background: 'rgba(255, 253, 250, 0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px max(4vw, 24px)',
          position: 'sticky',
          top: 0,
          zIndex: 30,
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <Link href="/" className="brand" style={{ fontSize: '20px', textDecoration: 'none', color: 'inherit' }}>
            <span className="brand-mark" style={{ width: '26px', height: '26px' }}></span> blushé admin
          </Link>

          <nav style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: active ? 600 : 500,
                    color: active ? 'var(--rose-dark)' : 'var(--muted)',
                    background: active ? 'var(--rose-light)' : 'transparent',
                    textDecoration: 'none',
                    transition: '0.15s ease',
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '12px',
              color: 'var(--muted)',
              textDecoration: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid var(--line)',
            }}
          >
            ↗ Buka Web Pengguna
          </Link>
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '12px',
              color: 'var(--rose-dark)',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Keluar
          </button>
        </div>
      </header>

      {/* Main Admin Content */}
      <main style={{ maxWidth: '1140px', margin: '0 auto', padding: '36px 24px 60px' }}>
        {children}
      </main>
    </div>
  );
}
