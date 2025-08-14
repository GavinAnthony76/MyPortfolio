import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";
import { usePortfolioImages } from "@/hooks/use-portfolio-images";



interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'all' | 'web' | 'ecommerce';
  technologies: string[];
  liveUrl?: string;
  codeUrl?: string;
}

const getProjects = (images: any): Project[] => [
  {
    id: '1',
    title: 'Texas Showdown 2026',
    description: 'Official tournament website for one of the largest fighting game events in the US, featuring registration system, live countdown, and event management.',
    image: images?.fightingGame || '/api/assets/fighting-game-tournament.png',
    category: 'web',
    technologies: ['React', 'Node.js', 'ASP.NET'],
    liveUrl: 'https://txshowdown.com/',
  },
  {
    id: '2',
    title: 'Jamaica Nyammingz - Jamaican Restaurant',
    description: 'Complete restaurant website featuring authentic Jamaican cuisine, online menu, ordering system, and cultural dining experiences.',
    image: images?.jamaicaRestaurant || '/api/assets/jamaica-restaurant.webp',
    category: 'ecommerce',
    technologies: ['React', 'Node.js', 'MongoDB'],
  },
  {
    id: '3',
    title: 'Faith and Ministry Website',
    description: 'Spiritual community platform featuring live streaming services, ministry resources, community engagement, and faith-based content delivery.',
    image: images?.faithMinistry || '/api/assets/faith-ministry-website.png',
    category: 'web',
    technologies: ['React', 'Node.js', 'MongoDB'],
  },
  {
    id: '4',
    title: 'Power of the Lamb Ministry',
    description: 'Biblical prophecy teaching platform featuring course registration, live streaming events, educational content delivery, and ministry resources with integrated payment processing.',
    image: images?.powerOfLamb || '/api/assets/power-of-lamb-ministry.png',
    category: 'web',
    technologies: ['WordPress', 'PHP', 'Stripe'],
    liveUrl: 'https://powerofthelamb.com/',
  },
  {
    id: '5',
    title: 'Brain Discord Bot - Fighting Game Assistant',
    description: 'Comprehensive Discord bot for fighting game communities featuring frame data lookup with SuperCombo API, combo database with rating system, interactive quiz system, personal collections with practice mode, and automated SuperCombo wiki import.',
    image: images?.brainBot || '/api/assets/brain-discord-bot.png',
    category: 'web',
    technologies: ['Discord.js', 'Node.js', 'MongoDB'],
    liveUrl: 'https://replit.com/t/phototheology/repls/DiscordBot',
  },

];

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'web', label: 'Web Apps' },
  { value: 'ecommerce', label: 'E-commerce' },
];

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'web' | 'ecommerce'>('all');
  const { data: images, isLoading } = usePortfolioImages();

  const projects = getProjects(images);
  
  const filteredProjects = projects.filter(
    project => activeFilter === 'all' || project.category === activeFilter
  );

  if (isLoading) {
    return (
      <section id="projects" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Featured <span className="tech-title">Projects</span>
            </h2>
            <p className="text-lg text-slate-700 max-w-2xl mx-auto">
              Loading portfolio projects...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured <span className="tech-title">Projects</span>
          </h2>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto">
            Showcasing professional development solutions and cutting-edge web applications
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex justify-center mb-12">
          <div className="glass-card p-2">
            {filterOptions.map((option) => (
              <Button
                key={option.value}
                variant={activeFilter === option.value ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveFilter(option.value as typeof activeFilter)}
                className={activeFilter === option.value ? "tech-button" : "text-slate-700 hover:text-cyan-600"}
                data-testid={`filter-${option.value}`}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div key={project.id} className="glass-card overflow-hidden" data-testid={`card-project-${project.id}`}>
              <div className="relative overflow-hidden rounded-t-xl">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-48 object-cover"
                  data-testid={`img-project-${project.id}`}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2" data-testid={`text-title-${project.id}`}>
                  {project.title}
                </h3>
                <p className="text-slate-600 mb-4" data-testid={`text-description-${project.id}`}>
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <Badge 
                      key={tech} 
                      variant="secondary" 
                      className="bg-blue-100 text-blue-700"
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
                      onClick={() => window.open(project.liveUrl, '_blank')}
                      data-testid={`button-demo-${project.id}`}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Live Demo
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" disabled data-testid={`button-demo-${project.id}`}>
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Demo Coming Soon
                    </Button>
                  )}
                  {project.codeUrl ? (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => window.open(project.codeUrl, '_blank')}
                      data-testid={`button-code-${project.id}`}
                    >
                      <Github className="w-4 h-4 mr-1" />
                      Code
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" disabled data-testid={`button-code-${project.id}`}>
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
