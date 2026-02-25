import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, Rocket, Search } from "lucide-react";

export default function HeroSection() {
  const handleScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" data-host="hero" className="relative min-h-screen flex items-center hero-gradient overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/8 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-300/5 rounded-full blur-[200px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="glass-hero-card p-8 sm:p-12 md:p-16 mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-slate-800">Full-Stack </span>
              <span className="tech-title">Developer</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              React. Node.js. TypeScript. I build high-performance web applications,
              e-commerce platforms, and custom solutions for businesses ready to grow.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => handleScrollTo('projects')}
                className="tech-button px-8 py-6 text-base group"
                data-testid="button-view-projects"
              >
                <Eye className="mr-2 h-5 w-5" />
                View Projects
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                onClick={() => handleScrollTo('contact')}
                className="glass-button px-8 py-6 text-base"
                data-testid="button-start-project"
              >
                <Rocket className="mr-2 h-5 w-5" />
                Start a Project
              </Button>
              <Button
                size="lg"
                onClick={() => handleScrollTo('project-status')}
                className="glass-button px-8 py-6 text-base"
                data-testid="button-check-status"
              >
                <Search className="mr-2 h-5 w-5" />
                Check Project Status
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
