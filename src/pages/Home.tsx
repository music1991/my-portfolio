import React from 'react';
import { SkillsSection } from '../sections/Skills';
import Presentation from '../sections/Presentation';
import PortfolioGrid from '../sections/Projects';
import { DATA } from '../entities/lib/projects';
import HeroSlider from '../components/HeroSlider';

const HomePage: React.FC = () => {
  return (
    <main className="min-h-screen bg-background w-full overflow-x-hidden">
      
      <div className="w-full">
        <section id="hero" className="w-full">
          <HeroSlider />
        </section>

        <section id="about" className="scroll-mt-24 md:scroll-mt-28 w-full">
          <Presentation />
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