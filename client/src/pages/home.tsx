import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import { projects } from "@/lib/projects-data";

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const total = projects.length;
  const project = projects[currentIndex];

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentIndex) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(index);
        setTimeout(() => setIsTransitioning(false), 100);
      }, 600);
    },
    [isTransitioning, currentIndex]
  );

  const goPrev = useCallback(() => {
    goTo(currentIndex === 0 ? total - 1 : currentIndex - 1);
  }, [currentIndex, total, goTo]);

  const goNext = useCallback(() => {
    goTo(currentIndex === total - 1 ? 0 : currentIndex + 1);
  }, [currentIndex, total, goTo]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") goPrev();
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goPrev, goNext]);

  useEffect(() => {
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const diff = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goNext();
        else goPrev();
      }
    };
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [goPrev, goNext]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 30) {
        if (e.deltaY > 0) goNext();
        else goPrev();
      }
    };
    let throttled = false;
    const throttleWheel = (e: WheelEvent) => {
      if (throttled) return;
      throttled = true;
      handleWheel(e);
      setTimeout(() => { throttled = false; }, 1000);
    };
    window.addEventListener("wheel", throttleWheel, { passive: true });
    return () => window.removeEventListener("wheel", throttleWheel);
  }, [goPrev, goNext]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-black relative">
      <Navigation />

      <div
        className="absolute inset-0 transition-opacity"
        style={{
          transitionDuration: "0.8s",
          transitionTimingFunction: "var(--ease-in-out-cubic)",
          opacity: isTransitioning ? 0 : 1,
        }}
      >
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
          style={{ opacity: 0.55 }}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

      <div
        className={`absolute bottom-0 left-0 right-0 px-6 sm:px-10 pb-10 transition-all ${
          loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{
          transitionDuration: "var(--duration-reveal)",
          transitionTimingFunction: "var(--ease-out-expo)",
          transitionDelay: "0.3s",
        }}
      >
        <div className="flex items-end justify-between">
          <div>
            <Link href={`/works/${project.id}`}>
              <h2
                className={`project-title text-white text-2xl sm:text-3xl lg:text-4xl mb-1 cursor-pointer hover:opacity-70 transition-opacity ${
                  isTransitioning ? "opacity-0" : "opacity-100"
                }`}
                style={{
                  transitionDuration: "0.5s",
                  transitionDelay: isTransitioning ? "0s" : "0.4s",
                }}
              >
                {project.title}
              </h2>
            </Link>
            {project.subtitle && (
              <p
                className={`project-title text-white/50 text-base sm:text-lg transition-opacity ${
                  isTransitioning ? "opacity-0" : "opacity-100"
                }`}
                style={{
                  transitionDuration: "0.5s",
                  transitionDelay: isTransitioning ? "0s" : "0.5s",
                }}
              >
                {project.subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <span
                className={`text-white text-2xl sm:text-3xl font-light tracking-wider transition-opacity ${
                  isTransitioning ? "opacity-0" : "opacity-100"
                }`}
                style={{
                  transitionDuration: "0.4s",
                  transitionDelay: isTransitioning ? "0s" : "0.3s",
                }}
              >
                {String(currentIndex + 1).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`absolute bottom-10 right-6 sm:right-10 flex items-center gap-8 transition-all ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transitionDuration: "var(--duration-reveal)",
          transitionDelay: "0.5s",
        }}
      >
        <button
          onClick={goPrev}
          className="text-white/40 hover:text-white text-[10px] tracking-[0.2em] uppercase transition-colors"
          style={{ transitionDuration: "var(--duration-fast)" }}
        >
          Prev
        </button>
        <button
          onClick={goNext}
          className="text-white/40 hover:text-white text-[10px] tracking-[0.2em] uppercase transition-colors"
          style={{ transitionDuration: "var(--duration-fast)" }}
        >
          Next
        </button>
      </div>

      <div
        className={`absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 transition-all ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transitionDuration: "var(--duration-reveal)",
          transitionDelay: "0.6s",
        }}
      >
        <span className="editorial-number text-xs">{String(currentIndex + 1).padStart(2, "0")}</span>
        <div className="w-px h-8 bg-white/20 my-1 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full bg-white/60 transition-all"
            style={{
              height: `${((currentIndex + 1) / total) * 100}%`,
              transitionDuration: "0.8s",
              transitionTimingFunction: "var(--ease-out-expo)",
            }}
          />
        </div>
        <span className="editorial-number text-xs">{String(total).padStart(2, "0")}</span>
      </div>

      <div
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 transition-all ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transitionDuration: "var(--duration-reveal)",
          transitionDelay: "0.7s",
        }}
      >
        <span className="text-white/20 text-[9px] tracking-[0.3em] uppercase">
          Next
        </span>
      </div>
    </div>
  );
}
