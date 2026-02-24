import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ProjectsSection from "@/components/projects-section";
import TestimonialsSection from "@/components/testimonials-section";
import BlogSection from "@/components/blog-section";
import ProjectStatusSection from "@/components/project-status-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <ProjectsSection />
        <TestimonialsSection />
        <BlogSection />
        <ProjectStatusSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
