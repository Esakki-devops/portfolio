import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Stats } from "@/components/sections/Stats";
import { Projects } from "@/components/sections/Projects";
import { TechOrbit } from "@/components/sections/TechOrbit";
import { Certifications } from "@/components/sections/Certifications";
import { Achievements } from "@/components/sections/Achievements";
import { Contact } from "@/components/sections/Contact";
import { Divider } from "@/components/ui/Section";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Divider />
      <Skills />
      <Stats />
      <Divider />
      <Experience />
      <Projects />
      <Divider />
      <TechOrbit />
      <Certifications />
      <Divider />
      <Achievements />
      <Contact />
    </main>
  );
}
