import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";
import { usePortfolioImages } from "@/hooks/use-portfolio-images";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: "all" | "web" | "ecommerce";
  technologies: string[];
  liveUrl?: string;
  codeUrl?: string;
}

const getProjects = (images: any): Project[] => [
  {
    id: "1",
    title: "Texas Showdown 2026",
    description:
      "Official tournament website for one of the largest fighting game events in the US, featuring registration system, live countdown, and event management.",
    image: images?.fightingGame || "/api/assets/fighting-game-tournament.png",
    category: "web",
    technologies: ["React", "Node.js", "ASP.NET"],
    liveUrl: "https://txshowdown.com/",
  },
  {
    id: "2",
    title: "Jamaica Nyammingz - Jamaican Restaurant",
    description:
      "Complete restaurant website featuring authentic Jamaican cuisine, online menu, ordering system, and cultural dining experiences.",
    image: images?.jamaicanRestaurant || "/api/assets/jamaica-restaurant.png",
    category: "ecommerce",
    technologies: ["React", "Node.js", "MongoDB"],
    liveUrl: "https://jamaicanyammingz.com/",
  },
  {
    id: "3",
    title: "Faith and Ministry Website",
    description:
      "Spiritual community platform featuring live streaming services, ministry resources, community engagement, and faith-based content delivery.",
    image: images?.faithMinistry || "/api/assets/faith-ministry-website.png",
    category: "web",
    technologies: ["React", "Node.js", "MongoDB"],
  },
  {
    id: "4",
    title: "Power of the Lamb Ministry",
    description:
      "Biblical prophecy teaching platform featuring course registration, live streaming events, educational content delivery, and ministry resources with integrated payment processing.",
    image: images?.powerOfLamb || "/api/assets/power-of-lamb-ministry.png",
    category: "web",
    technologies: ["WordPress", "PHP", "Stripe"],
    liveUrl: "https://powerofthelamb.com/",
  },
  {
    id: "5",
    title: "Shape Tap Deluxe",
    description:
      "Engaging shape-morphing puzzle game featuring multiple game modes, difficulty levels, combo system, daily challenges, stats tracking, and in-game shop.",
    image: images?.shapeTapDeluxe || "/api/assets/shape-tap-deluxe.png",
    category: "web",
    technologies: ["JavaScript", "HTML5", "CSS3"],
    liveUrl: "https://gavinanthony76.github.io/shape-tap-deluxe/",
  },
];

const filterOptions = [
  { value: "all", label: "All Projects" },
  { value: "web", label: "Web Apps" },
  { value: "ecommerce", label: "E-commerce" },
];

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<"all" | "web" | "ecommerce">(
    "all",
  );
  const { data: images, isLoading } = usePortfolioImages();

  const projects = getProjects(images);

  const filteredProjects = projects.filter(
    (project) => activeFilter === "all" || project.category === activeFilter,
  );

  if (isLoading) {
    return (
      <section id="projects" className="py-20 section-darker relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Featured <span className="tech-title">Projects</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Loading portfolio projects...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-16 sm:py-20 md:py-28 section-darker relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">
            Featured <span className="tech-title">Projects</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto px-2">
            Showcasing professional development solutions and cutting-edge web applications
          </p>
        </div>

        <div className="flex justify-center mb-10 sm:mb-14">
          <div className="inline-flex gap-1 p-1 rounded-lg bg-slate-800/60 border border-slate-700/50">
            {filterOptions.map((option) => (
              <Button
                key={option.value}
                variant={activeFilter === option.value ? "default" : "ghost"}
                size="sm"
                onClick={() =>
                  setActiveFilter(option.value as typeof activeFilter)
                }
                className={`${activeFilter === option.value ? "bg-cyan-600 hover:bg-cyan-700 text-white" : "text-slate-400 hover:text-white hover:bg-slate-700/50"} text-xs sm:text-sm px-3 sm:px-4`}
                data-testid={`filter-${option.value}`}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="glass-card overflow-hidden group"
              data-testid={`card-project-${project.id}`}
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                  data-testid={`img-project-${project.id}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              </div>
              <div className="p-6">
                <h3
                  className="text-xl font-bold text-white mb-2"
                  data-testid={`text-title-${project.id}`}
                >
                  {project.title}
                </h3>
                <p
                  className="text-slate-400 mb-4 text-sm leading-relaxed"
                  data-testid={`text-description-${project.id}`}
                >
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.technologies.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs"
                      data-testid={`badge-tech-${project.id}-${tech.toLowerCase()}`}
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
                      onClick={() => window.open(project.liveUrl, "_blank")}
                      className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 text-xs"
                      data-testid={`button-demo-${project.id}`}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Live Demo
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="border-slate-700 text-slate-500 text-xs"
                      data-testid={`button-demo-${project.id}`}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Coming Soon
                    </Button>
                  )}
                  {project.codeUrl ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(project.codeUrl, "_blank")}
                      className="text-slate-400 hover:text-white text-xs"
                      data-testid={`button-code-${project.id}`}
                    >
                      <Github className="w-4 h-4 mr-1" />
                      Code
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled
                      className="text-slate-600 text-xs"
                      data-testid={`button-code-${project.id}`}
                    >
                      <Github className="w-4 h-4 mr-1" />
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
  );
}
