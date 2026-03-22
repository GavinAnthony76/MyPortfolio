import { useState, useEffect } from "react";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import ScrollReveal from "@/components/scroll-reveal";
import developerImage from "@assets/generated_images/Professional_Black_developer_coding_374d8a1b.png";

const capabilities = [
  "React", "Next.js", "Vue.js", "TypeScript", "Node.js",
  "Python", "PostgreSQL", "MongoDB", "Express", "ASP.NET",
  "Tailwind CSS", "WordPress", "Stripe", "REST APIs",
];

export default function About() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <div className="px-6 sm:px-10 pt-28 pb-20">
        <div
          className={`transition-all ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{
            transitionDuration: "var(--duration-reveal)",
            transitionTimingFunction: "var(--ease-out-expo)",
          }}
        >
          <h1 className="project-title text-white text-3xl sm:text-4xl lg:text-5xl mb-16">
            Gavin Anthony
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <div
              className={`transition-all ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
              style={{
                transitionDuration: "1.4s",
                transitionTimingFunction: "var(--ease-out-expo)",
                transitionDelay: "0.3s",
              }}
            >
              <img
                src={developerImage}
                alt="Gavin Anthony"
                className="w-full aspect-[3/4] object-cover"
                data-testid="img-developer"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <ScrollReveal>
              <p className="text-white/60 text-sm sm:text-base leading-[2] mb-8">
                Full-stack developer based in Austin, Texas. Over five years
                building modern web applications — e-commerce platforms, SaaS
                tools, marketing sites, and everything in between.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={1}>
              <p className="text-white/40 text-sm leading-[2] mb-12">
                I specialize in creating sophisticated digital experiences that
                combine innovation with reliability. From rapid prototyping to
                full-scale applications, every project is built with attention
                to detail and performance.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={2}>
              <div className="grid grid-cols-3 gap-8 py-8 border-t border-white/5">
                <div>
                  <p className="text-white text-2xl font-light mb-1">5+</p>
                  <p className="editorial-label">Years</p>
                </div>
                <div>
                  <p className="text-white text-2xl font-light mb-1">20+</p>
                  <p className="editorial-label">Projects</p>
                </div>
                <div>
                  <p className="text-white text-2xl font-light mb-1">100%</p>
                  <p className="editorial-label">Satisfaction</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={3}>
              <div className="pt-8 border-t border-white/5">
                <p className="editorial-label mb-4">Capabilities</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {capabilities.map((skill) => (
                    <span key={skill} className="text-white/30 text-xs tracking-wider uppercase">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={4}>
              <div className="pt-8">
                <p className="editorial-label mb-4">Contact</p>
                <a
                  href="mailto:gavin@gavineanthony.com"
                  className="editorial-link"
                >
                  gavin@gavineanthony.com
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 px-6 sm:px-10 py-16 text-center">
        <ScrollReveal>
          <Link href="/works">
            <span className="editorial-link">View Works</span>
          </Link>
        </ScrollReveal>
      </div>
    </div>
  );
}
