import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { projects } from "@/lib/projects-data";

function ProjectRow({ project, index, isEven }: { project: (typeof projects)[0]; index: number; isEven: boolean }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Link href={`/works/${project.id}`}>
      <div
        ref={rowRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        data-testid={`works-item-${project.id}`}
        className="relative cursor-pointer"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div
          className={`flex flex-col ${isEven ? "lg:flex-row-reverse" : "lg:flex-row"} transition-all`}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(40px)",
            transitionDuration: "1s",
            transitionTimingFunction: "var(--ease-out-expo)",
            transitionDelay: `${index * 80}ms`,
          }}
        >
          <div
            className="relative overflow-hidden w-full lg:w-[55%] aspect-[16/9] lg:aspect-auto"
            style={{ minHeight: "clamp(220px, 30vw, 420px)" }}
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              style={{
                transform: hovered ? "scale(1.04)" : "scale(1)",
                filter: hovered ? "brightness(0.85)" : "brightness(0.65)",
                transition: "transform 0.8s var(--ease-out-expo), filter 0.6s ease",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
          </div>

          <div
            className={`flex-1 flex flex-col justify-between p-8 sm:p-10 lg:p-12 xl:p-16 ${
              isEven ? "lg:pr-0" : "lg:pl-0"
            }`}
          >
            <div>
              <div className="flex items-center gap-4 mb-6 lg:mb-10">
                <span
                  className="font-light tracking-[0.15em] transition-colors"
                  style={{
                    fontSize: "11px",
                    color: hovered ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.2)",
                    transitionDuration: "0.4s",
                  }}
                >
                  {project.number}
                </span>
                <div
                  className="h-px flex-1 transition-colors"
                  style={{
                    background: hovered ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)",
                    transitionDuration: "0.4s",
                  }}
                />
                <span
                  className="font-light tracking-[0.18em] uppercase transition-colors"
                  style={{
                    fontSize: "10px",
                    color: hovered ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.18)",
                    transitionDuration: "0.4s",
                  }}
                >
                  {project.category}
                </span>
              </div>

              <h2
                className="font-light uppercase leading-none mb-4 transition-colors"
                style={{
                  fontSize: "clamp(28px, 4vw, 60px)",
                  letterSpacing: "0.04em",
                  color: hovered ? "#fff" : "rgba(255,255,255,0.82)",
                  transitionDuration: "0.4s",
                }}
              >
                {project.title}
              </h2>

              {project.subtitle && (
                <p
                  className="font-light uppercase tracking-[0.1em] mb-6 transition-colors"
                  style={{
                    fontSize: "clamp(13px, 1.4vw, 18px)",
                    color: hovered ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.18)",
                    transitionDuration: "0.4s",
                  }}
                >
                  {project.subtitle}
                </p>
              )}

              <p
                className="font-light leading-relaxed mb-8 lg:mb-12 max-w-sm transition-colors"
                style={{
                  fontSize: "13px",
                  letterSpacing: "0.04em",
                  color: hovered ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.28)",
                  transitionDuration: "0.4s",
                }}
              >
                {project.shortDescription}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <span
                className="font-light tracking-[0.12em] transition-colors"
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.2)",
                  transitionDuration: "0.4s",
                }}
              >
                {project.year}
              </span>

              <div
                className="flex items-center gap-3 transition-all"
                style={{
                  opacity: hovered ? 1 : 0,
                  transform: hovered ? "translateX(0)" : "translateX(-8px)",
                  transitionDuration: "0.4s",
                  transitionTimingFunction: "var(--ease-out-expo)",
                }}
              >
                <span
                  className="uppercase tracking-[0.2em] font-light"
                  style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)" }}
                >
                  View Project
                </span>
                <div className="w-8 h-px bg-white/30" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Works() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <div className="pt-24">
        <div
          className="px-8 sm:px-16 lg:px-24 xl:px-32 pb-8"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s var(--ease-out-expo), transform 0.8s var(--ease-out-expo)",
          }}
        >
          <div className="flex items-end justify-between mb-2">
            <span
              className="uppercase font-light tracking-[0.3em]"
              style={{ fontSize: "10px", color: "rgba(255,255,255,0.22)" }}
            >
              Selected Works
            </span>
            <span
              className="font-light tracking-[0.1em]"
              style={{ fontSize: "11px", color: "rgba(255,255,255,0.18)" }}
            >
              {String(projects.length).padStart(2, "0")}
            </span>
          </div>
          <div className="h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
        </div>

        <div>
          {projects.map((project, i) => (
            <ProjectRow
              key={project.id}
              project={project}
              index={i}
              isEven={i % 2 === 1}
            />
          ))}
        </div>

        <div
          className="h-px"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />

        <div className="px-8 sm:px-16 lg:px-24 xl:px-32 py-16 flex items-center justify-between">
          <span
            className="uppercase font-light tracking-[0.25em]"
            style={{ fontSize: "10px", color: "rgba(255,255,255,0.18)" }}
          >
            End of Works
          </span>
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            <span
              className="uppercase font-light tracking-[0.2em] group-hover:text-white/60 transition-colors"
              style={{ fontSize: "10px", color: "rgba(255,255,255,0.22)", transitionDuration: "0.3s" }}
            >
              Focus Mode
            </span>
            <div className="w-8 h-px bg-white/15 group-hover:bg-white/40 transition-colors" style={{ transitionDuration: "0.3s" }} />
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
