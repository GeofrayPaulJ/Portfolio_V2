import HeroSection from "@/components/hero-section";
import ProjectsSection from "@/components/projects-section";
import ExpertiseSection from "@/components/expertise-section";
import AiAgentSection from "@/components/ai-agent-section";
import TechnicalNotesSection from "@/components/technical-notes-section";
import ContactSection from "@/components/contact-section";
import ParticlesBackground from "@/components/particles-background";

export default function Home() {
  return (
    <>
      {/* Fixed constellation field behind the whole page */}
      <ParticlesBackground />

      <div className="relative z-10">
        <HeroSection />
        <ExpertiseSection />
        <ProjectsSection />
        <TechnicalNotesSection />
        <AiAgentSection />
        <ContactSection />
      </div>
    </>
  );
}

