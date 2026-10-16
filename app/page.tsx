import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import EditorDemo from '@/components/EditorDemo';
import HeroShader from '@/components/HeroShader';
import ParticleMark from '@/components/ParticleMark';
import WorksWith from '@/components/WorksWith';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import Toolkit from '@/components/Toolkit';
import Privacy from '@/components/Privacy';
import PetSection from '@/components/PetSection';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero demo={<EditorDemo />} backdrop={<HeroShader />} />
        <WorksWith />
        <HowItWorks />
        <Features />
        <Toolkit />
        <Privacy />
        <PetSection />
        <FinalCTA mark={<ParticleMark />} />
      </main>
      <Footer />
    </>
  );
}
