import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import { projects } from "@/lib/projects-data";

export default function Works() {
  const [loaded, setLoaded] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const hoveredProject = hoveredId
    ? projects.find((p) => p.id === hoveredId)
    : null;

  return (
    <div className="min-h-screen bg-black relative">
      <Navigation />

      {hoveredProject && (
        <div
          className="fixed pointer-events-none z-30"
          style={{
            left: mousePos.x + 24,
            top: mousePos.y - 100,
            width: 320,
            height: 200,
            transition: "opacity 0.4s ease",
            opacity: 1,
          }}
        >
          <img
            src={hoveredProject.image}
            alt=""
            className="w-full h-full object-cover"
            style={{
              clipPath: "inset(0 0 0 0 round 2px)",
            }}
          />
          <div className="absolute inset-0 border border-white/10 rounded-sm" />
        </div>
      )}

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative z-10 flex flex-col justify-center min-h-screen px-8 sm:px-16 lg:px-24 xl:px-32 pt-24 pb-16"
      >
        <div
          className={`mb-16 transition-all ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{
            transitionDuration: "0.8s",
            transitionTimingFunction: "var(--ease-out-expo)",
            transitionDelay: "100ms",
          }}
        >
          <span className="editorial-number text-xs tracking-[0.3em] text-white/25 block mb-3">
            SELECTED WORKS
          </span>
          <div className="w-12 h-px bg-white/10" />
        </div>

        <div>
          {projects.map((project, i) => (
            <Link key={project.id} href={`/works/${project.id}`}>
              <div
                className={`group cursor-pointer transition-all ${
                  loaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{
                  transitionDuration: "0.8s",
                  transitionTimingFunction: "var(--ease-out-expo)",
                  transitionDelay: `${250 + i * 120}ms`,
                }}
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
                data-testid={`works-item-${project.id}`}
              >
                <div className="border-t border-white/[0.07] group-hover:border-white/20 transition-colors" style={{ transitionDuration: "0.4s" }} />

                <div className="py-8 sm:py-10 lg:py-12 flex items-start sm:items-center gap-6 sm:gap-10">
                  <span
                    className="text-white/15 group-hover:text-white/40 text-xs sm:text-sm font-light tracking-[0.2em] transition-colors mt-1 sm:mt-0 min-w-[28px]"
                    style={{ transitionDuration: "0.4s" }}
                  >
                    {project.number}
                  </span>

                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-8">
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                      <h2 className="text-white/80 group-hover:text-white text-xl sm:text-2xl lg:text-4xl xl:text-5xl font-light tracking-[0.04em] uppercase transition-colors" style={{ transitionDuration: "0.4s" }}>
                        {project.title}
                      </h2>
                      {project.subtitle && (
                        <span className="text-white/20 group-hover:text-white/35 text-sm sm:text-base lg:text-lg font-light tracking-[0.08em] uppercase transition-colors" style={{ transitionDuration: "0.4s" }}>
                          {project.subtitle}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-6 sm:gap-8 shrink-0">
                      <span className="text-white/15 group-hover:text-white/30 text-[10px] sm:text-xs tracking-[0.2em] uppercase transition-colors" style={{ transitionDuration: "0.4s" }}>
                        {project.category}
                      </span>
                      <span className="text-white/15 group-hover:text-white/30 text-[10px] sm:text-xs tracking-[0.15em] font-light transition-colors" style={{ transitionDuration: "0.4s" }}>
                        {project.year}
                      </span>
                    </div>
                  </div>

                  <div className="hidden lg:block">
                    <svg
                      className="w-5 h-5 text-white/0 group-hover:text-white/30 transition-all group-hover:translate-x-1"
                      style={{ transitionDuration: "0.4s" }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          <div
            className={`border-t border-white/[0.07] transition-all ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            style={{
              transitionDuration: "0.8s",
              transitionDelay: `${250 + projects.length * 120}ms`,
            }}
          />
        </div>

        <div
          className={`mt-16 flex items-center justify-between transition-all ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{
            transitionDuration: "0.8s",
            transitionTimingFunction: "var(--ease-out-expo)",
            transitionDelay: `${250 + projects.length * 120 + 200}ms`,
          }}
        >
          <span className="text-white/15 text-[10px] tracking-[0.3em] uppercase">
            {String(projects.length).padStart(2, "0")} Projects
          </span>
          <Link href="/" className="text-white/20 hover:text-white/50 text-[10px] tracking-[0.25em] uppercase transition-colors flex items-center gap-3">
            <span>Focus Mode</span>
            <div className="w-8 h-px bg-current" />
          </Link>
        </div>
      </div>
    </div>
  );
}
