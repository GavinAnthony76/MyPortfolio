import { useState, useEffect } from "react";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import { projects } from "@/lib/projects-data";

export default function Works() {
  const [loaded, setLoaded] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const hoveredProject = hoveredId
    ? projects.find((p) => p.id === hoveredId)
    : null;

  return (
    <div className="min-h-screen bg-black relative">
      <Navigation />

      {hoveredProject && (
        <div
          className="fixed inset-0 z-0 pointer-events-none transition-opacity"
          style={{
            transitionDuration: "0.6s",
            transitionTimingFunction: "var(--ease-in-out-cubic)",
          }}
        >
          <img
            src={hoveredProject.image}
            alt=""
            className="w-full h-full object-cover opacity-15"
          />
        </div>
      )}

      <div className="relative z-10 px-6 sm:px-10 pt-28 pb-20">
        <ul className="max-w-4xl">
          {projects.map((project, i) => (
            <li
              key={project.id}
              className={`transition-all ${
                loaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{
                transitionDuration: "var(--duration-reveal)",
                transitionTimingFunction: "var(--ease-out-expo)",
                transitionDelay: `${200 + i * 100}ms`,
              }}
            >
              <Link href={`/works/${project.id}`}>
                <div
                  className="group py-4 sm:py-5 border-b border-white/5 cursor-pointer flex items-baseline gap-4 sm:gap-8"
                  onMouseEnter={() => setHoveredId(project.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  data-testid={`works-item-${project.id}`}
                >
                  <span className="editorial-number text-xs sm:text-sm min-w-[24px]">
                    {project.number}
                  </span>

                  <div className="flex-1">
                    <span className="project-title text-white/80 text-sm sm:text-base lg:text-lg group-hover:text-white transition-colors">
                      {project.title}
                    </span>
                    {project.subtitle && (
                      <span className="project-title text-white/30 text-sm sm:text-base lg:text-lg ml-3">
                        {project.subtitle}
                      </span>
                    )}
                  </div>

                  <span className="editorial-label hidden sm:block">
                    {project.year}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div
          className={`mt-16 flex items-center gap-4 transition-all ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          style={{
            transitionDuration: "var(--duration-reveal)",
            transitionDelay: `${200 + projects.length * 100 + 200}ms`,
          }}
        >
          <span className="editorial-number text-xs">
            {String(projects.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}
