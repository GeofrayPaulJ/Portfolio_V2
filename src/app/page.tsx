import HeroSection from "@/components/hero-section";
import SkillsSection from "@/components/skills-section";
import ChallengesSection from "@/components/challenges-section";
import PublicationsSection from "@/components/publications-section";
import TechnicalNotesSection from "@/components/technical-notes-section";
import ProjectsSection from "@/components/projects-section";
import AiAgentSection from "@/components/ai-agent-section";
import ContactSection from "@/components/contact-section";
import ParticlesBackground from "@/components/particles-background";
import { SITE_URL, SITE_DESCRIPTION } from "@/lib/site";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Geofray Paul J",
  url: SITE_URL,
  jobTitle: "AI Engineer",
  description: SITE_DESCRIPTION,
  email: "mailto:geofraypaul1223@gmail.com",
  address: { "@type": "PostalAddress", addressLocality: "Chennai", addressCountry: "IN" },
  sameAs: ["https://www.linkedin.com/in/geofraypaulj1212", "https://github.com/GeofrayPaulJ"],
  knowsAbout: [
    "Medical image segmentation",
    "Computational pathology",
    "Computational radiology",
    "Neuroimaging",
    "nnU-Net",
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
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
