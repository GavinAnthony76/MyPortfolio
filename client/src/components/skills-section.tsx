import { SiReact, SiNodedotjs, SiTypescript, SiPostgresql, SiMongodb, SiPython, SiTailwindcss, SiNextdotjs, SiVuedotjs, SiDocker, SiGit, SiWordpress, SiFigma, SiStripe } from "react-icons/si";

const skills = [
  { name: "React", icon: SiReact, color: "text-cyan-400" },
  { name: "Next.js", icon: SiNextdotjs, color: "text-white" },
  { name: "Vue.js", icon: SiVuedotjs, color: "text-green-400" },
  { name: "TypeScript", icon: SiTypescript, color: "text-blue-400" },
  { name: "Node.js", icon: SiNodedotjs, color: "text-green-500" },
  { name: "Python", icon: SiPython, color: "text-yellow-400" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "text-blue-300" },
  { name: "MongoDB", icon: SiMongodb, color: "text-green-400" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "text-cyan-300" },
  { name: "Docker", icon: SiDocker, color: "text-blue-400" },
  { name: "Git", icon: SiGit, color: "text-orange-400" },
  { name: "WordPress", icon: SiWordpress, color: "text-blue-300" },
  { name: "Figma", icon: SiFigma, color: "text-purple-400" },
  { name: "Stripe", icon: SiStripe, color: "text-purple-300" },
];

export default function SkillsSection() {
  return (
    <section id="skills" className="py-16 sm:py-20 md:py-28 section-accent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">
            Technologies & <span className="tech-title">Tools</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto px-2">
            The modern tech stack I use to build fast, reliable, and scalable applications
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-6">
          {skills.map((skill) => {
            const IconComponent = skill.icon;
            return (
              <div
                key={skill.name}
                className="glass-card p-4 sm:p-6 flex flex-col items-center gap-3 group cursor-default"
                data-testid={`skill-badge-${skill.name.toLowerCase()}`}
              >
                <IconComponent className={`w-8 h-8 sm:w-10 sm:h-10 ${skill.color} transition-transform group-hover:scale-110`} />
                <span className="text-slate-400 text-xs sm:text-sm font-medium text-center">{skill.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
