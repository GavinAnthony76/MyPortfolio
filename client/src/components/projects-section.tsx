import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExternalLink, Github, ArrowRight, Layers, Eye } from "lucide-react";
import { usePortfolioImages } from "@/hooks/use-portfolio-images";

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
    image: images?.fightingGame || "/api/assets/fighting-game-tournament.png",
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
      <section id="projects" className="py-20 section-darker relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-slate-800">
              Featured <span className="tech-title">Projects</span>
            </h2>
            <p className="text-base text-slate-500 max-w-2xl mx-auto">
              Loading portfolio projects...
            </p>
          </div>
        </div>
      </section>
    );
  }

  const featured = projects[0];
  const rest = projects.slice(1);

  return (
    <>
      <section id="projects" className="py-16 sm:py-20 section-darker relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-14">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 text-xs font-medium px-3 py-1 rounded-full mb-4">
              <Layers className="w-3.5 h-3.5" />
              Portfolio
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-slate-800">
              Featured <span className="tech-title">Projects</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto">
              Real work, real results. Click any project to explore the full case study.
            </p>
          </div>

          <div
            className="group relative rounded-2xl overflow-hidden cursor-pointer mb-6 sm:mb-8 border border-slate-200/60 shadow-sm hover:shadow-lg transition-shadow duration-300"
            onClick={() => setSelectedProject(featured)}
            data-testid={`card-project-${featured.id}`}
          >
            <div className="grid md:grid-cols-2">
              <div className="relative overflow-hidden">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-56 md:h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  data-testid={`img-project-${featured.id}`}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/5" />
              </div>
              <div className="p-6 sm:p-8 flex flex-col justify-center bg-white">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-blue-600 text-white text-[10px] px-2 py-0.5 hover:bg-blue-700">
                    Featured
                  </Badge>
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                    {featured.category === "ecommerce" ? "E-Commerce" : featured.category === "game" ? "Game" : "Web App"}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
                  {featured.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  {featured.shortDescription}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {featured.technologies.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="bg-slate-100 text-slate-600 border-0 text-[11px] px-2.5 py-0.5"
                    >
                      {tech}
                    </Badge>
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
                      className="tech-button text-xs h-8 px-4"
                    >
                      <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                      Live Demo
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs h-8 gap-1.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(featured);
                    }}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Case Study
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {rest.map((project) => (
              <div
                key={project.id}
                className="group relative bg-white rounded-xl overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-lg hover:border-blue-200/60 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedProject(project)}
                data-testid={`card-project-${project.id}`}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105"
                    data-testid={`img-project-${project.id}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 text-[10px] text-white/90 uppercase tracking-wider font-medium bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
                    {project.category === "ecommerce" ? "E-Commerce" : project.category === "game" ? "Game" : "Web App"}
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <span className="inline-flex items-center gap-1 text-xs text-white bg-blue-600/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Eye className="w-3 h-3" />
                      View Case Study
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold text-slate-800 mb-1.5">
                    {project.title}
                  </h3>
                  <p className="text-slate-500 mb-4 text-xs leading-relaxed line-clamp-2">
                    {project.shortDescription}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="bg-slate-50 text-slate-500 border border-slate-100 text-[10px] px-2 py-0"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    {project.liveUrl ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(project.liveUrl, "_blank");
                        }}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs h-7 px-2 -ml-2"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Live Demo
                      </Button>
                    ) : (
                      <span className="text-[10px] text-slate-400 uppercase tracking-wide">
                        Coming Soon
                      </span>
                    )}
                    {project.codeUrl ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(project.codeUrl, "_blank");
                        }}
                        className="text-slate-400 hover:text-slate-600 text-xs h-7 px-2"
                      >
                        <Github className="w-3 h-3 mr-1" />
                        Code
                      </Button>
                    ) : (
                      <span className="text-[10px] text-slate-300 flex items-center gap-1">
                        <Github className="w-3 h-3" />
                        Private
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Dialog
        open={!!selectedProject}
        onOpenChange={() => setSelectedProject(null)}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-white border-slate-200 text-slate-800 p-0">
          {selectedProject && (
            <>
              <div className="relative">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-52 sm:h-60 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-6 right-6">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {selectedProject.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-[10px]"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-slate-800 pr-8">
                    {selectedProject.title}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 mt-5">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
                      The Challenge
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {selectedProject.problem}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
                      The Solution
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {selectedProject.solution}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">
                      Key Features
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedProject.features.map((feature, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-sm text-slate-600 bg-white border border-slate-100 rounded-lg px-3 py-2"
                        >
                          <span className="text-blue-500 mt-0.5 text-xs">&#9679;</span>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-3">
                      Results
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedProject.outcomes.map((outcome, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-sm text-slate-600 bg-emerald-50/50 border border-emerald-100 rounded-lg px-3 py-2"
                        >
                          <span className="text-emerald-500 mt-0.5">&#10003;</span>
                          {outcome}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2 border-t border-slate-100">
                    {selectedProject.liveUrl && (
                      <Button
                        onClick={() =>
                          window.open(selectedProject.liveUrl, "_blank")
                        }
                        className="tech-button"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Live Site
                      </Button>
                    )}
                    <Button
                      onClick={handleScrollToContact}
                      variant="outline"
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
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
