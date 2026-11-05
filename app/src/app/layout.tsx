import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Blushé',
  description: 'Sistem Pendukung Keputusan Rekomendasi Produk dan Shade Blush On',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
