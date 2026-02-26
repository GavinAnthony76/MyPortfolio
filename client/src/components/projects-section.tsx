import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExternalLink, Github, ArrowRight } from "lucide-react";
import { usePortfolioImages } from "@/hooks/use-portfolio-images";

interface Project {
  id: string;
  title: string;
  shortDescription: string;
  image: string;
  category: "all" | "web" | "ecommerce";
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
    problem: "The Texas Showdown fighting game tournament needed a modern, high-performance website to handle thousands of registrations, display live event schedules, and provide real-time updates during the tournament.",
    solution: "Built a full-stack web application with React frontend and ASP.NET backend, featuring a live countdown timer, registration system, bracket management, and responsive design optimized for mobile users at the venue.",
    features: [
      "Live event countdown and schedule",
      "Online registration system",
      "Bracket management and results",
      "Mobile-optimized for venue use",
      "Real-time event updates"
    ],
    outcomes: [
      "Handled 2,000+ registrations seamlessly",
      "50% increase in online sign-ups vs previous year",
      "Sub-second page load times",
      "Zero downtime during peak event hours"
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
    problem: "A Jamaican restaurant needed an online presence that captured the vibrant culture of their cuisine while providing practical features like online ordering and menu management.",
    solution: "Designed and built a culturally authentic website with a custom CMS for menu management, online ordering integration, and a responsive design that showcases the restaurant's personality.",
    features: [
      "Interactive digital menu with images",
      "Online ordering system",
      "Custom CMS for menu management",
      "Cultural design with authentic imagery",
      "Mobile-first responsive design"
    ],
    outcomes: [
      "30% increase in online orders",
      "Streamlined menu update process",
      "Improved customer engagement",
      "Strong brand identity online"
    ],
  },
  {
    id: "3",
    title: "Faith and Ministry Platform",
    shortDescription:
      "Spiritual community platform with live streaming, ministry resources, and content delivery.",
    image: images?.faithMinistry || "/api/assets/faith-ministry-website.png",
    category: "web",
    technologies: ["React", "Node.js", "MongoDB"],
    problem: "A faith-based organization needed a platform to deliver sermons, resources, and community engagement tools to their congregation both in-person and online.",
    solution: "Created a full-featured ministry platform with live streaming integration, resource library, community engagement tools, and content management capabilities.",
    features: [
      "Live streaming service integration",
      "Sermon archive and resource library",
      "Community engagement features",
      "Event calendar and registration",
      "Content management system"
    ],
    outcomes: [
      "Expanded reach beyond local congregation",
      "Centralized resource management",
      "Improved community engagement",
      "Accessible ministry content 24/7"
    ],
  },
  {
    id: "4",
    title: "Power of the Lamb Ministry",
    shortDescription:
      "Biblical prophecy teaching platform with course registration and payment processing.",
    image: images?.powerOfLamb || "/api/assets/power-of-lamb-ministry.png",
    category: "web",
    technologies: ["WordPress", "PHP", "Stripe"],
    liveUrl: "https://powerofthelamb.com/",
    problem: "A ministry focused on biblical prophecy teaching needed a professional platform for course registration, live streaming events, and payment processing for educational materials.",
    solution: "Built a WordPress-based platform with custom course registration, Stripe payment integration, live event streaming, and educational content delivery optimized for their audience.",
    features: [
      "Course registration system",
      "Stripe payment processing",
      "Live streaming events",
      "Educational content delivery",
      "Ministry resource management"
    ],
    outcomes: [
      "Streamlined course enrollment",
      "Secure payment processing",
      "Professional online presence",
      "Expanded teaching reach globally"
    ],
  },
  {
    id: "5",
    title: "Shape Tap Deluxe",
    shortDescription:
      "Engaging shape-morphing puzzle game with multiple modes, combos, and daily challenges.",
    image: images?.shapeTapDeluxe || "/api/assets/shape-tap-deluxe.png",
    category: "web",
    technologies: ["JavaScript", "HTML5", "CSS3"],
    liveUrl: "https://gavinanthony76.github.io/shape-tap-deluxe/",
    problem: "Needed to create an addictive, performance-optimized browser game that works across all devices with engaging mechanics and replayability.",
    solution: "Developed a pure JavaScript game with hardware-accelerated animations, multiple game modes, a combo system, daily challenges, and persistent stats tracking using localStorage.",
    features: [
      "Multiple game modes",
      "Combo scoring system",
      "Daily challenges",
      "Stats tracking and leaderboards",
      "In-game shop and customization"
    ],
    outcomes: [
      "Smooth 60fps gameplay on all devices",
      "High player engagement and retention",
      "Zero external dependencies",
      "Instant load times"
    ],
  },
];

const filterOptions = [
  { value: "all", label: "All Projects" },
  { value: "web", label: "Web Apps" },
  { value: "ecommerce", label: "E-commerce" },
];

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<"all" | "web" | "ecommerce">("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { data: images, isLoading } = usePortfolioImages();

  const projects = getProjects(images);
  const filteredProjects = projects.filter(
    (project) => activeFilter === "all" || project.category === activeFilter,
  );

  const handleScrollToContact = () => {
    setSelectedProject(null);
    setTimeout(() => {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  if (isLoading) {
    return (
      <section id="projects" className="py-16 section-darker relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-slate-800">
              Featured <span className="tech-title">Projects</span>
            </h2>
            <p className="text-base text-slate-500 max-w-2xl mx-auto">Loading portfolio projects...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="projects" className="py-12 sm:py-16 section-darker relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-slate-800">
              Featured <span className="tech-title">Projects</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto px-2">
              Real projects, real results. Click any project to see the full case study.
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="inline-flex gap-1 p-1 rounded-lg bg-white/60 border border-slate-200">
              {filterOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={activeFilter === option.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveFilter(option.value as typeof activeFilter)}
                  className={`${activeFilter === option.value ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"} text-xs sm:text-sm px-3 sm:px-4`}
                  data-testid={`filter-${option.value}`}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="glass-card overflow-hidden group cursor-pointer"
                onClick={() => setSelectedProject(project)}
                data-testid={`card-project-${project.id}`}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-36 sm:h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                    data-testid={`img-project-${project.id}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-white bg-blue-600/90 px-2.5 py-1 rounded-full backdrop-blur-sm">
                      View Case Study
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-base font-bold text-slate-800 mb-1.5">{project.title}</h3>
                  <p className="text-slate-500 mb-3 text-xs leading-relaxed line-clamp-2">{project.shortDescription}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="bg-blue-50 text-blue-600 border border-blue-100 text-[10px] px-2 py-0"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    {project.liveUrl ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); window.open(project.liveUrl, "_blank"); }}
                        className="border-blue-200 text-blue-600 hover:bg-blue-50 text-xs h-7 px-2.5"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Live Demo
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" disabled className="border-slate-200 text-slate-400 text-xs h-7 px-2.5">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Coming Soon
                      </Button>
                    )}
                    {project.codeUrl ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); window.open(project.codeUrl, "_blank"); }}
                        className="text-slate-400 hover:text-slate-700 text-xs h-7"
                      >
                        <Github className="w-3 h-3 mr-1" />
                        Code
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" disabled className="text-slate-300 text-xs h-7">
                        <Github className="w-3 h-3 mr-1" />
                        Private
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-white border-slate-200 text-slate-800">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-slate-800 pr-8">{selectedProject.title}</DialogTitle>
              </DialogHeader>

              <div className="space-y-5 mt-4">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-48 object-cover rounded-lg"
                />

                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="bg-blue-50 text-blue-600 border border-blue-100 text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">The Challenge</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{selectedProject.problem}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">The Solution</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{selectedProject.solution}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">Key Features</h4>
                  <ul className="space-y-1">
                    {selectedProject.features.map((feature, i) => (
                      <li key={i} className="text-slate-600 text-sm flex items-start gap-2">
                        <span className="text-blue-500 mt-1">&#8226;</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-2">Results</h4>
                  <ul className="space-y-1">
                    {selectedProject.outcomes.map((outcome, i) => (
                      <li key={i} className="text-slate-600 text-sm flex items-start gap-2">
                        <span className="text-emerald-500 mt-1">&#10003;</span>
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3 pt-2">
                  {selectedProject.liveUrl && (
                    <Button
                      onClick={() => window.open(selectedProject.liveUrl, "_blank")}
                      className="tech-button"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Live Site
                    </Button>
                  )}
                  <Button onClick={handleScrollToContact} variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Start a Similar Project
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
