import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import { projects } from "@/lib/projects-data";

const AUTO_ADVANCE_DURATION = 6000;

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const startTimeRef = useRef(Date.now());
  const total = projects.length;
  const project = projects[currentIndex];

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const goTo = useCallback(
    (dir: number) => {
      if (isTransitioning) return;
      const nextIdx = ((currentIndex + dir) % total + total) % total;
      if (nextIdx === currentIndex) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(nextIdx);
        setProgress(0);
        progressRef.current = 0;
        startTimeRef.current = Date.now();
        setTimeout(() => setIsTransitioning(false), 60);
      }, 450);
    },
    [isTransitioning, currentIndex, total]
  );

  const goPrev = useCallback(() => goTo(-1), [goTo]);
  const goNext = useCallback(() => goTo(1), [goTo]);

  useEffect(() => {
    startTimeRef.current = Date.now();
    progressRef.current = 0;

    const tick = () => {
      if (isTransitioning) {
        animFrameRef.current = requestAnimationFrame(tick);
        return;
      }
      const elapsed = Date.now() - startTimeRef.current;
      const p = Math.min(elapsed / AUTO_ADVANCE_DURATION, 1);
      progressRef.current = p;
      setProgress(p);

      if (p >= 1) {
        goNext();
      } else {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [currentIndex, isTransitioning, goNext]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goPrev, goNext]);

  useEffect(() => {
    let touchStartX = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goNext();
        else goPrev();
      }
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [goPrev, goNext]);

  const yearFirst = project.year.slice(0, 2);
  const yearLast = project.year.slice(2);

  return (
    <div className="h-screen w-screen overflow-hidden bg-black relative select-none">
      <Navigation />

      {projects.map((p, i) => (
        <div
          key={p.id}
          className="absolute inset-0 transition-opacity"
          style={{
            transitionDuration: "1.2s",
            transitionTimingFunction: "var(--ease-in-out-cubic)",
            opacity: i === currentIndex ? 1 : 0,
          }}
        >
          <img
            src={p.image}
            alt={p.title}
            className="w-full h-full object-cover"
            style={{ opacity: 0.55 }}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute h-px bg-white/[0.06] left-0 right-0" style={{ top: "50%" }} />
      </div>

      <div
        className={`absolute inset-0 flex items-center justify-center z-10 transition-opacity ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDuration: "1.2s", transitionDelay: "0.3s" }}
      >
        <Link href={`/works/${project.id}`}>
          <div className="flex flex-col items-center justify-center cursor-pointer group">
            <h2
              className={`project-title group-glow text-white text-center text-xl sm:text-2xl lg:text-3xl tracking-[0.15em] mb-1 transition-all ${
                isTransitioning ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"
              }`}
              style={{
                transitionDuration: "0.45s",
                transitionTimingFunction: "var(--ease-out-expo)",
                transitionDelay: isTransitioning ? "0s" : "0.25s",
              }}
            >
              {project.title}
            </h2>
            {project.subtitle && (
              <p
                className={`project-title text-white/70 text-center text-xs sm:text-sm tracking-[0.12em] transition-all ${
                  isTransitioning ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"
                }`}
                style={{
                  transitionDuration: "0.45s",
                  transitionTimingFunction: "var(--ease-out-expo)",
                  transitionDelay: isTransitioning ? "0s" : "0.32s",
                }}
              >
                {project.subtitle}
              </p>
            )}
          </div>
        </Link>
      </div>

      <button
        onClick={goPrev}
        className={`glow-hover absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 flex items-center gap-4 text-white/70 z-20 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: loaded ? "0.5s" : "0s" }}
      >
        <span className="text-[10px] tracking-[0.25em] uppercase">Prev</span>
        <div className="w-12 sm:w-20 h-px bg-current" />
      </button>

      <button
        onClick={goNext}
        className={`glow-hover absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 flex items-center gap-4 text-white/70 z-20 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: loaded ? "0.5s" : "0s" }}
      >
        <div className="w-12 sm:w-20 h-px bg-current" />
        <span className="text-[10px] tracking-[0.25em] uppercase">Next</span>
      </button>

      <div
        className={`absolute bottom-8 left-6 sm:left-10 flex items-center gap-3 z-20 transition-opacity ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDuration: "1s", transitionDelay: "0.6s" }}
      >
        <span className="text-white/75 text-xs font-light tracking-[0.1em]">{yearFirst}</span>
        <span className="text-white/30 text-[10px]">——</span>
        <span className="text-white/75 text-xs font-light tracking-[0.1em]">{yearLast}</span>
      </div>

      <div
        className={`absolute bottom-8 right-6 sm:right-10 flex items-center gap-3 z-20 transition-opacity ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDuration: "1s", transitionDelay: "0.6s" }}
      >
        <span className="text-white/75 text-xs font-light tracking-[0.1em]">
          {String(currentIndex + 1).padStart(2, "0")}
        </span>
        <span className="text-white/30 text-[10px]">——</span>
        <span className="text-white/75 text-xs font-light tracking-[0.1em]">
          {String(total).padStart(2, "0")}
        </span>
      </div>

      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-20 transition-opacity ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDuration: "1s", transitionDelay: "0.7s" }}
      >
        <div className="w-16 h-px bg-white/10 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-white/30"
            style={{ width: `${progress * 100}%`, transition: "width 0.1s linear" }}
          />
        </div>
      </div>
    </div>
  );
}
