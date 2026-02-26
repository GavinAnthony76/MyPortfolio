import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExternalLink, Github, ArrowRight, Eye } from "lucide-react";
import { usePortfolioImages } from "@/hooks/use-portfolio-images";
import txsImage from "@assets/image_1772076982979.png";

interface Project {
  id: string;
  title: string;
  shortDescription: string;
  image: string;
  category: "web" | "ecommerce" | "game";
  technologies: string[];
  liveUrl?: string;
  codeUrl?: string;
  problem: string;
  solution: string;
  features: string[];
  outcomes: string[];
}

const getProjects = (images: any): Project[] => [
  {
    id: "1",
    title: "Texas Showdown 2026",
    shortDescription:
      "Official tournament website for one of the largest fighting game events in the US.",
    image: txsImage,
    category: "web",
    technologies: ["React", "Node.js", "ASP.NET"],
    liveUrl: "https://txshowdown.com/",
    problem:
      "The Texas Showdown fighting game tournament needed a modern, high-performance website to handle thousands of registrations, display live event schedules, and provide real-time updates during the tournament.",
    solution:
      "Built a full-stack web application with React frontend and ASP.NET backend, featuring a live countdown timer, registration system, bracket management, and responsive design optimized for mobile users at the venue.",
    features: [
      "Live event countdown and schedule",
      "Online registration system",
      "Bracket management and results",
      "Mobile-optimized for venue use",
      "Real-time event updates",
    ],
    outcomes: [
      "Handled 2,000+ registrations seamlessly",
      "50% increase in online sign-ups vs previous year",
      "Sub-second page load times",
      "Zero downtime during peak event hours",
    ],
  },
  {
    id: "2",
    title: "Jamaica Nyammingz",
    shortDescription:
      "Complete restaurant website with online menu and ordering for authentic Jamaican cuisine.",
    image: images?.jamaicanRestaurant || "/api/assets/jamaica-restaurant.png",
    category: "ecommerce",
    technologies: ["React", "Node.js", "MongoDB"],
    liveUrl: "https://jamaicanyammingz.com/",
    problem:
      "A Jamaican restaurant needed an online presence that captured the vibrant culture of their cuisine while providing practical features like online ordering and menu management.",
    solution:
      "Designed and built a culturally authentic website with a custom CMS for menu management, online ordering integration, and a responsive design that showcases the restaurant's personality.",
    features: [
      "Interactive digital menu with images",
      "Online ordering system",
      "Custom CMS for menu management",
      "Cultural design with authentic imagery",
      "Mobile-first responsive design",
    ],
    outcomes: [
      "30% increase in online orders",
      "Streamlined menu update process",
      "Improved customer engagement",
      "Strong brand identity online",
    ],
  },
  {
    id: "3",
    title: "Power of the Lamb Ministry",
    shortDescription:
      "Biblical prophecy teaching platform with course registration and payment processing.",
    image: images?.powerOfLamb || "/api/assets/power-of-lamb-ministry.png",
    category: "web",
    technologies: ["WordPress", "PHP", "Stripe"],
    liveUrl: "https://powerofthelamb.com/",
    problem:
      "A ministry focused on biblical prophecy teaching needed a professional platform for course registration, live streaming events, and payment processing for educational materials.",
    solution:
      "Built a WordPress-based platform with custom course registration, Stripe payment integration, live event streaming, and educational content delivery optimized for their audience.",
    features: [
      "Course registration system",
      "Stripe payment processing",
      "Live streaming events",
      "Educational content delivery",
      "Ministry resource management",
    ],
    outcomes: [
      "Streamlined course enrollment",
      "Secure payment processing",
      "Professional online presence",
      "Expanded teaching reach globally",
    ],
  },
  {
    id: "4",
    title: "Shape Tap Deluxe",
    shortDescription:
      "Engaging shape-morphing puzzle game with multiple modes, combos, and daily challenges.",
    image: images?.shapeTapDeluxe || "/api/assets/shape-tap-deluxe.png",
    category: "game",
    technologies: ["JavaScript", "HTML5", "CSS3"],
    liveUrl: "https://gavinanthony76.github.io/shape-tap-deluxe/",
    problem:
      "Needed to create an addictive, performance-optimized browser game that works across all devices with engaging mechanics and replayability.",
    solution:
      "Developed a pure JavaScript game with hardware-accelerated animations, multiple game modes, a combo system, daily challenges, and persistent stats tracking using localStorage.",
    features: [
      "Multiple game modes",
      "Combo scoring system",
      "Daily challenges",
      "Stats tracking and leaderboards",
      "In-game shop and customization",
    ],
    outcomes: [
      "Smooth 60fps gameplay on all devices",
      "High player engagement and retention",
      "Zero external dependencies",
      "Instant load times",
    ],
  },
];

const categoryLabel = (cat: string) =>
  cat === "ecommerce" ? "E-Commerce" : cat === "game" ? "Game" : "Web App";

export default function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { data: images, isLoading } = usePortfolioImages();

  const projects = getProjects(images);

  const handleScrollToContact = () => {
    setSelectedProject(null);
    setTimeout(() => {
      const el = document.getElementById("contact");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  if (isLoading) {
    return (
      <section id="projects" className="py-20 bg-slate-900 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Loading projects...
            </h2>
          </div>
        </div>
      </section>
    );
  }

  const featured = projects[0];
  const rest = projects.slice(1);

  return (
    <>
      <section id="projects" className="py-16 sm:py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-blue-400 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] mb-3">
              Portfolio
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              Featured Projects
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mb-4" />
            <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto">
              Real work, real results. Click any project to explore the full case study.
            </p>
          </div>

          <div
            className="group relative rounded-2xl overflow-hidden cursor-pointer mb-8 sm:mb-10"
            onClick={() => setSelectedProject(featured)}
            data-testid={`card-project-${featured.id}`}
          >
            <img
              src={featured.image}
              alt={featured.title}
              className="w-full h-72 sm:h-80 lg:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
              data-testid={`img-project-${featured.id}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10">
              <div className="flex items-center gap-2.5 mb-3">
                <Badge className="bg-blue-500 text-white border-0 text-[10px] sm:text-xs px-2.5 py-0.5 font-semibold uppercase tracking-wider hover:bg-blue-600">
                  Featured
                </Badge>
                <span className="text-[10px] sm:text-xs text-white/60 uppercase tracking-wider font-medium">
                  {categoryLabel(featured.category)}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-2 leading-tight">
                {featured.title}
              </h3>
              <p className="text-white/70 text-sm sm:text-base max-w-xl mb-5 leading-relaxed">
                {featured.shortDescription}
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {featured.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-[10px] sm:text-xs text-white/80 bg-white/10 backdrop-blur-sm border border-white/10 px-2.5 py-1 rounded-md font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3">
                {featured.liveUrl && (
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(featured.liveUrl, "_blank");
                    }}
                    className="bg-blue-500 hover:bg-blue-400 text-white text-xs sm:text-sm h-9 px-5 font-semibold rounded-lg"
                  >
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                    Live Site
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white hover:bg-white/10 text-xs sm:text-sm h-9 px-4 rounded-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProject(featured);
                  }}
                >
                  <Eye className="w-3.5 h-3.5 mr-1.5" />
                  Case Study
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {rest.map((project) => (
              <div
                key={project.id}
                className="group relative rounded-xl overflow-hidden cursor-pointer aspect-[4/5]"
                onClick={() => setSelectedProject(project)}
                data-testid={`card-project-${project.id}`}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  data-testid={`img-project-${project.id}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10 group-hover:via-black/50 transition-all duration-300" />

                <div className="absolute top-4 left-4">
                  <span className="text-[9px] sm:text-[10px] text-white/70 uppercase tracking-[0.15em] font-semibold bg-black/30 backdrop-blur-sm px-2 py-1 rounded-md">
                    {categoryLabel(project.category)}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-extrabold text-white mb-1.5 leading-tight">
                    {project.title}
                  </h3>
                  <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2">
                    {project.shortDescription}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-[9px] sm:text-[10px] text-white/70 bg-white/10 border border-white/10 px-2 py-0.5 rounded font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2.5 sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-300">
                    {project.liveUrl && (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(project.liveUrl, "_blank");
                        }}
                        className="bg-blue-500 hover:bg-blue-400 text-white text-[10px] sm:text-xs h-7 px-3 font-semibold rounded-md"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Live Site
                      </Button>
                    )}
                    {project.codeUrl ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(project.codeUrl, "_blank");
                        }}
                        className="text-white/60 hover:text-white hover:bg-white/10 text-[10px] sm:text-xs h-7 px-2 rounded-md"
                      >
                        <Github className="w-3 h-3 mr-1" />
                        Code
                      </Button>
                    ) : null}
                  </div>
                </div>

                <div className="absolute inset-0 rounded-xl ring-1 ring-white/10 group-hover:ring-blue-400/30 transition-all duration-300 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Dialog
        open={!!selectedProject}
        onOpenChange={() => setSelectedProject(null)}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-slate-900 border-slate-700 text-white p-0">
          {selectedProject && (
            <>
              <div className="relative">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-52 sm:h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                <div className="absolute bottom-5 left-6 right-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] text-blue-400 uppercase tracking-[0.15em] font-semibold">
                      {categoryLabel(selectedProject.category)}
                    </span>
                  </div>
                  <DialogHeader>
                    <DialogTitle className="text-2xl sm:text-3xl font-extrabold text-white pr-8 leading-tight">
                      {selectedProject.title}
                    </DialogTitle>
                  </DialogHeader>
                </div>
              </div>

              <div className="px-6 pb-6 pt-1">
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedProject.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] sm:text-xs text-white/70 bg-white/10 border border-white/10 px-2.5 py-1 rounded-md font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="space-y-6">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-[0.15em] mb-2.5">
                      The Challenge
                    </h4>
                    <p className="text-white/70 text-sm leading-relaxed">
                      {selectedProject.problem}
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-[0.15em] mb-2.5">
                      The Solution
                    </h4>
                    <p className="text-white/70 text-sm leading-relaxed">
                      {selectedProject.solution}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-[0.15em] mb-3">
                      Key Features
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedProject.features.map((feature, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 text-sm text-white/70 bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5"
                        >
                          <span className="text-blue-400 mt-0.5 text-[10px]">&#9670;</span>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-[0.15em] mb-3">
                      Results
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedProject.outcomes.map((outcome, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 text-sm text-white/70 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3.5 py-2.5"
                        >
                          <span className="text-emerald-400 mt-0.5">&#10003;</span>
                          {outcome}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-3 border-t border-white/10">
                    {selectedProject.liveUrl && (
                      <Button
                        onClick={() =>
                          window.open(selectedProject.liveUrl, "_blank")
                        }
                        className="bg-blue-500 hover:bg-blue-400 text-white font-semibold"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Live Site
                      </Button>
                    )}
                    <Button
                      onClick={handleScrollToContact}
                      variant="outline"
                      className="border-white/20 text-white/80 hover:bg-white/10 hover:text-white"
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Start a Similar Project
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
