import React from 'react';
import { SkillsSection } from '../sections/Skills';
import PortfolioGrid from '../sections/Projects';
import { DATA } from '../entities/lib/projects';
import Hero3D from '../components/Hero3D';

const HomePage: React.FC = () => {
  return (
    <main className="min-h-screen bg-background w-full overflow-x-hidden">

      <div className="w-full">
        <section id="hero" className="w-full">
          <Hero3D />
        </section>

        <section id="skills" className="w-full">
          <SkillsSection />
        </section>

        <section id="projects" className="scroll-mt-24 md:scroll-mt-28 w-full">
          <PortfolioGrid items={DATA} />
        </section>
      </div>
    </main>
  );
};

export default HomePage;