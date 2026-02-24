import { Github, Linkedin, Twitter } from "lucide-react";
import { SiAmazon } from "react-icons/si";
import { Button } from "@/components/ui/button";
import developerImage from "@assets/generated_images/Professional_Black_developer_coding_374d8a1b.png";

export default function AboutSection() {
  const stats = [
    { value: "5+", label: "Years Experience" },
    { value: "20+", label: "Projects Delivered" },
    { value: "100%", label: "Client Satisfaction" },
  ];

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
    <section id="about" className="py-16 sm:py-20 md:py-28 section-accent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">
            About <span className="tech-title">Me</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto px-2">
            Full-stack developer with expertise in cutting-edge web technologies and modern development solutions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="glass-card p-2 order-2 lg:order-1">
            <img 
              src={developerImage} 
              alt="Developer working on code" 
              className="rounded-lg w-full h-auto"
              data-testid="img-developer"
            />
          </div>
          
          <div className="order-1 lg:order-2">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-white">
              Hi, I'm <span className="gradient-text">Gavin</span>
            </h3>
            <p className="text-slate-400 mb-6 leading-relaxed text-sm sm:text-base">
              I specialize in modern web development, creating sophisticated web applications 
              that leverage modern technologies and best practices. From rapid prototyping 
              to full-scale applications, I deliver solutions that combine innovation with reliability.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center p-4 glass-card">
                  <p className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</p>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
              <div className="glass-card p-4 sm:p-6">
                <h4 className="font-semibold text-white mb-3 text-sm sm:text-base">Frontend</h4>
                <div className="space-y-2">
                  {skills.frontend.map((skill) => (
                    <div key={skill.name} className="flex items-center text-slate-400 text-xs sm:text-sm" data-testid={`skill-${skill.name.toLowerCase()}`}>
                      <span className="mr-2">{skill.icon}</span>
                      {skill.name}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="glass-card p-4 sm:p-6">
                <h4 className="font-semibold text-white mb-3 text-sm sm:text-base">Backend</h4>
                <div className="space-y-2">
                  {skills.backend.map((skill) => (
                    <div key={skill.name} className="flex items-center text-slate-400 text-xs sm:text-sm" data-testid={`skill-${skill.name.toLowerCase()}`}>
                      <span className="mr-2">{skill.icon}</span>
                      {skill.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-cyan-400" data-testid="link-github">
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-cyan-400" data-testid="link-linkedin">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-cyan-400" data-testid="link-twitter" asChild>
                <a href="https://x.com/gavineanthony" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-cyan-400" data-testid="link-amazon" asChild>
                <a href="https://amzn.to/49MnhQq" target="_blank" rel="noopener noreferrer">
                  <SiAmazon className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
