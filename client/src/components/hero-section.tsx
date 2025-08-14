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
    <section id="home" className="relative min-h-screen py-20 flex items-center">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto rounded-full glass flex items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-500">
              <Code className="text-white text-4xl" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="tech-title">Full-Stack</span>{' '}
            <span className="gradient-text">Developer</span>
          </h1>
          
          <p className="text-xl text-slate-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            I create cutting-edge web applications using modern development practices. 
            From rapid prototyping to full-stack solutions, I deliver high-quality code 
            that transforms your ideas into reality.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => handleScrollTo('projects')}
              className="tech-button"
              data-testid="button-view-work"
            >
              <FolderOpen className="mr-2 h-5 w-5" />
              View My Work
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => handleScrollTo('contact')}
              className="glass-card border-2 border-cyan-400 text-slate-700 hover:bg-cyan-50"
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
