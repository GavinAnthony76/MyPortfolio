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
    <section id="home" className="bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center">
              <Code className="text-white text-4xl" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6">
            Full Stack <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Developer</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            I craft beautiful, functional web applications that bring your ideas to life. 
            With expertise in modern technologies and a passion for clean code, 
            I deliver solutions that exceed expectations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => handleScrollTo('projects')}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
              data-testid="button-view-work"
            >
              <FolderOpen className="mr-2 h-5 w-5" />
              View My Work
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => handleScrollTo('contact')}
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
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
