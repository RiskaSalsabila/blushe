import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Wizard from '@/components/Wizard';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Wizard />
      </main>
      <footer className="footer">
        <strong>blushé</strong> · Prototype rancangan sistem rekomendasi blush on
        <br />
        Digunakan untuk diskusi awal dan konsultasi penelitian. Bukan aplikasi final atau rekomendasi kecantikan tervalidasi.
      </footer>
    </>
  );
}
