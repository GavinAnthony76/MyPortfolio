import { Button } from "@/components/ui/button";
import { Code, FolderOpen, Send } from "lucide-react";

export default function HeroSection() {
  const handleScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen py-12 sm:py-16 md:py-20 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <div className="mb-6 sm:mb-8">
            <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full glass flex items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-500">
              <Code className="text-white text-2xl sm:text-4xl" />
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6">
            <span className="tech-title block sm:inline">Full-Stack</span>{' '}
            <span className="gradient-text block sm:inline">Developer</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-slate-700 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-2">
            I create cutting-edge web applications using modern development practices. 
            From rapid prototyping to full-stack solutions, I deliver high-quality code 
            that transforms your ideas into reality.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <Button 
              size="lg" 
              onClick={() => handleScrollTo('projects')}
              className="tech-button w-full sm:w-auto"
              data-testid="button-view-work"
            >
              <FolderOpen className="mr-2 h-5 w-5" />
              View My Work
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => handleScrollTo('contact')}
              className="glass-card border-2 border-cyan-400 text-slate-700 hover:bg-cyan-50 w-full sm:w-auto"
              data-testid="button-start-project"
            >
              <Send className="mr-2 h-5 w-5" />
              Start a Project
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
