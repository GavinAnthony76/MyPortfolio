import { Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">About Me</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Passionate developer with 5+ years of experience creating digital solutions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Developer working on code" 
              className="rounded-xl shadow-lg w-full h-auto"
              data-testid="img-developer"
            />
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Hi, I'm Alex Martinez</h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              I'm a passionate full-stack developer who loves turning complex problems into 
              simple, beautiful solutions. When I'm not coding, you'll find me exploring 
              new technologies, contributing to open source projects, or sharing knowledge 
              with the developer community.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="font-semibold text-slate-800 mb-3">Frontend</h4>
                <div className="space-y-2">
                  {skills.frontend.map((skill) => (
                    <div key={skill.name} className="flex items-center text-slate-600" data-testid={`skill-${skill.name.toLowerCase()}`}>
                      <span className="mr-2">{skill.icon}</span>
                      {skill.name}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-slate-800 mb-3">Backend</h4>
                <div className="space-y-2">
                  {skills.backend.map((skill) => (
                    <div key={skill.name} className="flex items-center text-slate-600" data-testid={`skill-${skill.name.toLowerCase()}`}>
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
              <Button variant="ghost" size="sm" data-testid="link-twitter">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
