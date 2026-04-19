import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import WorksWith from '@/components/WorksWith';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <WorksWith />
        <Features />
        <HowItWorks />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
