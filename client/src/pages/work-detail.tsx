import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { projects } from "@/lib/projects-data";

export default function WorkDetail() {
  const [, params] = useRoute("/works/:id");
  const [loaded, setLoaded] = useState(false);
  const project = projects.find((p) => p.id === params?.id);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(timer);
  }, [params?.id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="pt-40 text-center px-6">
          <h1 className="project-title text-white text-xl mb-8">Project not found</h1>
          <Link href="/works">
            <span className="editorial-link">Back to Works</span>
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = projects.findIndex((p) => p.id === project.id);
  const nextProject =
    currentIndex < projects.length - 1 ? projects[currentIndex + 1] : projects[0];
  const prevProject =
    currentIndex > 0 ? projects[currentIndex - 1] : projects[projects.length - 1];
  const totalImages = project.features.length;

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <div className="px-6 sm:px-10 pt-28 pb-12">
        <div
          className={`transition-all ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{
            transitionDuration: "var(--duration-reveal)",
            transitionTimingFunction: "var(--ease-out-expo)",
          }}
        >
          <h1 className="project-title text-white text-3xl sm:text-4xl lg:text-5xl mb-2">
            {project.title}
          </h1>
          {project.subtitle && (
            <p className="project-title text-white/30 text-lg sm:text-xl mb-6">
              {project.subtitle}
            </p>
          )}
        </div>

        <div
          className={`flex items-center gap-8 mb-16 transition-all ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{
            transitionDuration: "var(--duration-reveal)",
            transitionTimingFunction: "var(--ease-out-expo)",
            transitionDelay: "0.15s",
          }}
        >
          <span className="editorial-number text-sm">{project.number}</span>
          <span className="editorial-label">{project.year}</span>
          <span className="editorial-label">{project.category}</span>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-link"
            >
              Visit Site
            </a>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <div
          className={`w-full transition-all ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          style={{
            transitionDuration: "1.4s",
            transitionTimingFunction: "var(--ease-out-expo)",
            transitionDelay: "0.3s",
          }}
        >
          <img
            src={project.image}
            alt={project.title}
            className="w-full aspect-[16/9] object-cover"
          />
        </div>
      </div>

      <div className="px-6 sm:px-10 py-20">
        <div className="max-w-2xl">
          <p
            className={`text-white/60 text-sm sm:text-base leading-[2] mb-12 transition-all ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{
              transitionDuration: "var(--duration-reveal)",
              transitionDelay: "0.5s",
            }}
          >
            {project.problem}
          </p>
          <p
            className={`text-white/40 text-sm leading-[2] transition-all ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{
              transitionDuration: "var(--duration-reveal)",
              transitionDelay: "0.6s",
            }}
          >
            {project.solution}
          </p>
        </div>
      </div>

      <div className="px-6 sm:px-10 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
          {project.technologies.map((tech, i) => (
            <span key={i} className="editorial-label">{tech}</span>
          ))}
        </div>
      </div>

      <div className="px-6 sm:px-10 pb-10">
        <div className="flex items-center gap-4 mb-6">
          <span className="editorial-number text-xs">
            {String(totalImages).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="px-6 sm:px-10 py-16 flex items-center justify-between">
          <Link href={`/works/${prevProject.id}`}>
            <span className="group cursor-pointer">
              <span className="editorial-label block mb-2">Prev</span>
              <span className="project-title text-white/60 text-sm sm:text-base group-hover:text-white transition-colors">
                {prevProject.title}
              </span>
            </span>
          </Link>

          <Link href={`/works/${nextProject.id}`}>
            <span className="group cursor-pointer text-right">
              <span className="editorial-label block mb-2">Next</span>
              <span className="project-title text-white/60 text-sm sm:text-base group-hover:text-white transition-colors">
                {nextProject.title}
              </span>
            </span>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
