import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import developerImage from "@assets/generated_images/Professional_Black_developer_coding_374d8a1b.png";

const capabilities = [
  "React", "Next.js", "Vue.js", "TypeScript", "Node.js",
  "Python", "PostgreSQL", "MongoDB", "Express", "ASP.NET",
  "Tailwind CSS", "WordPress", "Stripe", "REST APIs",
];

const chapters = [
  {
    id: "intro",
    label: "Intro",
    render: (visible: boolean) => (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 sm:px-10 relative">
        <div
          className={`text-center transition-all ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{
            transitionDuration: "1.4s",
            transitionTimingFunction: "var(--ease-out-expo)",
          }}
        >
          <p className="editorial-label mb-6">About</p>
          <h1
            className="text-white font-light tracking-[0.15em] uppercase leading-[1.1] mb-6"
            style={{ fontSize: "clamp(2.5rem, 8vw, 7rem)" }}
          >
            Gavin
            <br />
            Anthony
          </h1>
          <p className="text-white/80 text-xs tracking-[0.2em] uppercase">
            Full-Stack Developer &middot; Austin, TX
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "portrait",
    label: "Portrait",
    render: (visible: boolean) => (
      <div className="flex items-center justify-center min-h-screen px-6 sm:px-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 max-w-5xl w-full items-center">
          <div
            className={`transition-all ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{
              transitionDuration: "1.4s",
              transitionTimingFunction: "var(--ease-out-expo)",
            }}
          >
            <img
              src={developerImage}
              alt="Gavin Anthony"
              className="w-full max-w-md mx-auto aspect-[3/4] object-cover"
              data-testid="img-developer"
            />
          </div>
          <div
            className={`transition-all ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{
              transitionDuration: "1.4s",
              transitionTimingFunction: "var(--ease-out-expo)",
              transitionDelay: "0.2s",
            }}
          >
            <p className="text-white/90 text-sm sm:text-base leading-[2.2] mb-8">
              Over five years building modern web applications — e-commerce
              platforms, SaaS tools, marketing sites, and everything in between.
            </p>
            <p className="text-white/80 text-sm leading-[2.2]">
              I specialize in creating sophisticated digital experiences that
              combine innovation with reliability. From rapid prototyping to
              full-scale applications, every project is built with attention to
              detail and performance.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "numbers",
    label: "Numbers",
    render: (visible: boolean) => (
      <div className="flex items-center justify-center min-h-screen px-6 sm:px-10">
        <div className="text-center">
          <div
            className={`flex items-center justify-center gap-12 sm:gap-20 lg:gap-32 transition-all ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{
              transitionDuration: "1.4s",
              transitionTimingFunction: "var(--ease-out-expo)",
            }}
          >
            {[
              { value: "5+", label: "Years" },
              { value: "20+", label: "Projects" },
              { value: "100%", label: "Satisfaction" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`transition-all ${
                  visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{
                  transitionDuration: "1.4s",
                  transitionDelay: `${i * 150}ms`,
                }}
              >
                <p
                  className="text-white font-light tracking-wider mb-2"
                  style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
                >
                  {stat.value}
                </p>
                <p className="editorial-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "capabilities",
    label: "Stack",
    render: (visible: boolean) => (
      <div className="flex items-center justify-center min-h-screen px-6 sm:px-10">
        <div className="max-w-3xl w-full">
          <div
            className={`transition-all ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{
              transitionDuration: "1.4s",
              transitionTimingFunction: "var(--ease-out-expo)",
            }}
          >
            <p className="editorial-label mb-12 text-center">Capabilities</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-8">
              {capabilities.map((skill, i) => (
                <div
                  key={skill}
                  className={`transition-all ${
                    visible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{
                    transitionDuration: "1s",
                    transitionDelay: `${200 + i * 60}ms`,
                  }}
                >
                  <span className="text-white/80 text-[11px] tracking-[0.15em] uppercase block py-3 border-b border-white/5">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "contact",
    label: "Contact",
    render: (visible: boolean) => (
      <div className="flex items-center justify-center min-h-screen px-6 sm:px-10">
        <div
          className={`text-center transition-all ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{
            transitionDuration: "1.4s",
            transitionTimingFunction: "var(--ease-out-expo)",
          }}
        >
          <p className="editorial-label mb-8">Get in touch</p>
          <a
            href="mailto:gavin@gavineanthony.com"
            className="text-white/85 hover:text-white transition-colors text-sm sm:text-base tracking-[0.1em] uppercase block mb-12"
            style={{ transitionDuration: "0.3s" }}
          >
            gavin@gavineanthony.com
          </a>
          <div className="flex items-center justify-center gap-8">
            <Link href="/works">
              <span className="editorial-link">View Works</span>
            </Link>
            <Link href="/contact">
              <span className="editorial-link">Start Project</span>
            </Link>
          </div>
        </div>
      </div>
    ),
  },
];

export default function About() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [chaptersVisible, setChaptersVisible] = useState<boolean[]>(
    new Array(chapters.length).fill(false)
  );
  const [loaded, setLoaded] = useState(false);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setLoaded(true);
      setChaptersVisible((prev) => {
        const next = [...prev];
        next[0] = true;
        return next;
      });
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleScroll = useCallback(() => {
    const sections = sectionRefs.current;
    const viewportCenter = window.innerHeight / 2;

    sections.forEach((section, i) => {
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.7 && rect.bottom > window.innerHeight * 0.3) {
        setChaptersVisible((prev) => {
          if (prev[i]) return prev;
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }
    });

    let closest = 0;
    let closestDist = Infinity;
    sections.forEach((section, i) => {
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const dist = Math.abs(center - viewportCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    setActiveChapter(closest);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToChapter = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#141414] relative">
      <Navigation />

      <div
        className={`fixed right-6 sm:right-10 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end gap-4 transition-opacity ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDuration: "1s", transitionDelay: "0.8s" }}
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="editorial-number text-[10px]">
            {String(activeChapter + 1).padStart(2, "0")}
          </span>
          <span className="text-white/10 text-[10px]">——</span>
          <span className="editorial-number text-[10px]">
            {String(chapters.length).padStart(2, "0")}
          </span>
        </div>

        {chapters.map((chapter, i) => (
          <button
            key={chapter.id}
            onClick={() => scrollToChapter(i)}
            className="flex items-center gap-3 group"
          >
            <span
              className={`text-[9px] tracking-[0.15em] uppercase transition-all hidden sm:block ${
                activeChapter === i
                  ? "text-white/85"
                  : "text-white/0 group-hover:text-white/80"
              }`}
              style={{ transitionDuration: "0.3s" }}
            >
              {chapter.label}
            </span>
            <div
              className={`transition-all rounded-full ${
                activeChapter === i
                  ? "w-2 h-2 bg-white/50"
                  : "w-1 h-1 bg-white/15 group-hover:bg-white/30"
              }`}
              style={{ transitionDuration: "0.4s" }}
            />
          </button>
        ))}
      </div>

      {chapters.map((chapter, i) => (
        <section
          key={chapter.id}
          ref={(el) => { sectionRefs.current[i] = el; }}
          className="snap-start"
        >
          {chapter.render(chaptersVisible[i])}
        </section>
      ))}
      <Footer />
    </div>
  );
}
