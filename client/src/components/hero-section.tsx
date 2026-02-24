import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Layers, Zap } from "lucide-react";

export default function HeroSection() {
  const handleScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center hero-gradient overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full blur-[128px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600 rounded-full blur-[128px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            Available for new projects
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white">Building </span>
            <span className="tech-title">Digital</span>
            <br />
            <span className="text-white">Experiences</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Full-stack developer crafting high-performance web applications, 
            modern landing pages, and scalable solutions for businesses in Austin, TX and beyond.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              onClick={() => handleScrollTo('projects')}
              className="tech-button px-8 py-6 text-base"
              data-testid="button-view-work"
            >
              View My Work
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => handleScrollTo('contact')}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white px-8 py-6 text-base"
              data-testid="button-start-project"
            >
              Start a Project
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex flex-col items-center gap-3 p-6 glass-card">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Code2 className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="text-center">
                <p className="text-white font-semibold">Full-Stack</p>
                <p className="text-slate-500 text-sm">React, Node.js, TypeScript</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 glass-card">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Layers className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-center">
                <p className="text-white font-semibold">Modern Stack</p>
                <p className="text-slate-500 text-sm">PostgreSQL, APIs, Cloud</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 glass-card">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-center">
                <p className="text-white font-semibold">Fast Delivery</p>
                <p className="text-slate-500 text-sm">Rapid prototyping</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
