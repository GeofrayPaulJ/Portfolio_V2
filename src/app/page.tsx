import HeroSection from "@/components/hero-section";
import SkillsSection from "@/components/skills-section";
import ChallengesSection from "@/components/challenges-section";
import PublicationsSection from "@/components/publications-section";
import TechnicalNotesSection from "@/components/technical-notes-section";
import ProjectsSection from "@/components/projects-section";
import AiAgentSection from "@/components/ai-agent-section";
import ContactSection from "@/components/contact-section";
import ParticlesBackground from "@/components/particles-background";

export default function Home() {
  return (
    <>
      {/* Fixed constellation field behind the whole page */}
      <ParticlesBackground />

      <div className="relative z-10">
        <HeroSection />
        <SkillsSection />
        <ChallengesSection />
        <PublicationsSection />
        <TechnicalNotesSection />
        <ProjectsSection />
        <AiAgentSection />
        <ContactSection />
      </div>
    </>
  );
}
