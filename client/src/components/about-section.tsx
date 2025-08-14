import { Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import developerImage from "@assets/generated_images/Developer_coding_at_desk_b7dd3426.png";

export default function AboutSection() {
  const skills = {
    frontend: [
      { name: "React & Next.js", icon: "⚛️" },
      { name: "Vue.js", icon: "🟢" },
      { name: "TypeScript", icon: "📘" },
    ],
    backend: [
      { name: "Node.js", icon: "🟢" },
      { name: "Python", icon: "🐍" },
      { name: "PostgreSQL", icon: "🗄️" },
    ]
  };

  return (
    <section id="about" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="tech-title">Me</span>
          </h2>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto">
            Full-stack developer with expertise in cutting-edge web technologies and modern development solutions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="glass-card p-2">
            <img 
              src={developerImage} 
              alt="Developer working on code" 
              className="rounded-xl w-full h-auto"
              data-testid="img-developer"
            />
          </div>
          
          <div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6">
              Hi, I'm <span className="gradient-text">Gavin Anthony</span>
            </h3>
            <p className="text-slate-700 mb-6 leading-relaxed">
              I specialize in modern web development, creating sophisticated web applications 
              that leverage modern technologies and best practices. From rapid prototyping 
              to full-scale applications, I deliver solutions that combine innovation with reliability.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="glass-card p-6">
                <h4 className="font-semibold text-slate-800 mb-3 gradient-text">Frontend</h4>
                <div className="space-y-2">
                  {skills.frontend.map((skill) => (
                    <div key={skill.name} className="flex items-center text-slate-700" data-testid={`skill-${skill.name.toLowerCase()}`}>
                      <span className="mr-2">{skill.icon}</span>
                      {skill.name}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="glass-card p-6">
                <h4 className="font-semibold text-slate-800 mb-3 gradient-text">Backend</h4>
                <div className="space-y-2">
                  {skills.backend.map((skill) => (
                    <div key={skill.name} className="flex items-center text-slate-700" data-testid={`skill-${skill.name.toLowerCase()}`}>
                      <span className="mr-2">{skill.icon}</span>
                      {skill.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" data-testid="link-github">
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" data-testid="link-linkedin">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" data-testid="link-twitter" asChild>
                <a href="https://x.com/gavineanthony" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
