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
  const pausedRef = useRef(false);
  const total = projects.length;
  const project = projects[currentIndex];

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      const nextIdx = ((index % total) + total) % total;
      if (nextIdx === currentIndex) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(nextIdx);
        setProgress(0);
        progressRef.current = 0;
        startTimeRef.current = Date.now();
        setTimeout(() => setIsTransitioning(false), 100);
      }, 500);
    },
    [isTransitioning, currentIndex, total]
  );

  const goPrev = useCallback(() => {
    goTo(currentIndex - 1);
  }, [currentIndex, goTo]);

  const goNext = useCallback(() => {
    goTo(currentIndex + 1);
  }, [currentIndex, goTo]);

  useEffect(() => {
    startTimeRef.current = Date.now();
    progressRef.current = 0;

    const tick = () => {
      if (pausedRef.current || isTransitioning) {
        startTimeRef.current = Date.now() - progressRef.current * AUTO_ADVANCE_DURATION;
        animFrameRef.current = requestAnimationFrame(tick);
        return;
      }
      const elapsed = Date.now() - startTimeRef.current;
      const p = Math.min(elapsed / AUTO_ADVANCE_DURATION, 1);
      progressRef.current = p;
      setProgress(p);

      if (p >= 1) {
        const nextIdx = (currentIndex + 1) % total;
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex(nextIdx);
          setProgress(0);
          progressRef.current = 0;
          startTimeRef.current = Date.now();
          setTimeout(() => setIsTransitioning(false), 100);
        }, 500);
      } else {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [currentIndex, total, isTransitioning]);

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
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const diffX = touchStartX - e.changedTouches[0].clientX;
      const diffY = Math.abs(touchStartY - e.changedTouches[0].clientY);
      if (Math.abs(diffX) > 50 && Math.abs(diffX) > diffY) {
        if (diffX > 0) goNext();
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

  const yearStr = project.year;
  const yearFirst = yearStr.slice(0, 2);
  const yearLast = yearStr.slice(2);

  const circleSize = "min(55vh, 55vw)";
  const circumference = Math.PI * 2 * 48;
  const strokeOffset = circumference * (1 - progress);

  return (
    <div className="h-screen w-screen overflow-hidden bg-black relative select-none">
      <Navigation />

      <div
        className="absolute inset-0 transition-opacity"
        style={{
          transitionDuration: "0.7s",
          transitionTimingFunction: "var(--ease-in-out-cubic)",
          opacity: isTransitioning ? 0 : 1,
        }}
      >
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
          style={{ opacity: 0.5 }}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="absolute h-px bg-white/[0.07] left-0 right-0"
          style={{ top: "50%" }}
        />
      </div>

      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transitionDuration: "1.5s",
          transitionDelay: "0.3s",
        }}
      >
        <div
          className="relative"
          style={{ width: circleSize, height: circleSize }}
        >
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            style={{
              transform: `rotate(${-90 + progress * 360}deg)`,
              transition: "transform 0.1s linear",
            }}
          >
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.3"
            />
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="0.3"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
            />
          </svg>

          <Link href={`/works/${project.id}`}>
            <div className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer pointer-events-auto group">
              <h2
                className={`project-title text-white text-center text-lg sm:text-xl lg:text-2xl tracking-[0.12em] mb-1 group-hover:opacity-70 transition-opacity ${
                  isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
                }`}
                style={{
                  transitionDuration: "0.5s",
                  transitionTimingFunction: "var(--ease-out-expo)",
                  transitionDelay: isTransitioning ? "0s" : "0.3s",
                }}
              >
                {project.title}
              </h2>
              {project.subtitle && (
                <p
                  className={`project-title text-white/40 text-center text-xs sm:text-sm tracking-[0.1em] transition-all ${
                    isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
                  }`}
                  style={{
                    transitionDuration: "0.5s",
                    transitionTimingFunction: "var(--ease-out-expo)",
                    transitionDelay: isTransitioning ? "0s" : "0.4s",
                  }}
                >
                  {project.subtitle}
                </p>
              )}
            </div>
          </Link>
        </div>
      </div>

      <button
        onClick={goPrev}
        className={`absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 text-white/30 hover:text-white text-[10px] tracking-[0.25em] uppercase transition-all pointer-events-auto ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transitionDuration: "var(--duration-fast)",
          transitionDelay: loaded ? "0.5s" : "0s",
        }}
      >
        Prev
      </button>

      <button
        onClick={goNext}
        className={`absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 text-white/30 hover:text-white text-[10px] tracking-[0.25em] uppercase transition-all pointer-events-auto ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transitionDuration: "var(--duration-fast)",
          transitionDelay: loaded ? "0.5s" : "0s",
        }}
      >
        Next
      </button>

      <div
        className={`absolute bottom-8 left-6 sm:left-10 flex items-center gap-4 transition-all ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transitionDuration: "var(--duration-reveal)",
          transitionDelay: "0.6s",
        }}
      >
        <span
          className={`text-white/30 text-[10px] tracking-[0.15em] uppercase transition-opacity ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
          style={{ transitionDuration: "0.3s" }}
        >
          {project.category}
        </span>
      </div>

      <div
        className={`absolute bottom-8 right-6 sm:right-10 flex items-center gap-3 transition-all ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transitionDuration: "var(--duration-reveal)",
          transitionDelay: "0.6s",
        }}
      >
        <span
          className={`text-white/50 text-xs sm:text-sm font-light tracking-[0.1em] transition-opacity ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
          style={{ transitionDuration: "0.3s" }}
        >
          {yearFirst}
        </span>
        <span className="text-white/15 text-[10px]">——</span>
        <span
          className={`text-white/50 text-xs sm:text-sm font-light tracking-[0.1em] transition-opacity ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
          style={{ transitionDuration: "0.3s" }}
        >
          {yearLast}
        </span>
      </div>

      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 transition-all ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transitionDuration: "var(--duration-reveal)",
          transitionDelay: "0.7s",
        }}
      >
        <span className="editorial-number text-[10px]">
          {String(currentIndex + 1).padStart(2, "0")}
        </span>
        <div className="w-8 h-px bg-white/10 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-white/40"
            style={{
              width: `${progress * 100}%`,
              transition: "width 0.1s linear",
            }}
          />
        </div>
        <span className="editorial-number text-[10px]">
          {String(total).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
