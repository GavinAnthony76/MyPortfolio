import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'all' | 'web' | 'mobile' | 'ecommerce';
  technologies: string[];
  liveUrl?: string;
  codeUrl?: string;
}

const projects: Project[] = [
  {
    id: '1',
    title: 'ShopFlow - E-commerce Platform',
    description: 'A complete e-commerce solution with payment integration, inventory management, and admin dashboard.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400',
    category: 'ecommerce',
    technologies: ['React', 'Node.js', 'Stripe'],
  },
  {
    id: '2',
    title: 'FitTracker - Fitness Mobile App',
    description: 'Cross-platform mobile app for fitness tracking with social features and workout plans.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400',
    category: 'mobile',
    technologies: ['React Native', 'Firebase', 'Redux'],
  },
  {
    id: '3',
    title: 'DataViz - Analytics Dashboard',
    description: 'Real-time analytics dashboard with interactive charts and customizable reports.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400',
    category: 'web',
    technologies: ['Vue.js', 'D3.js', 'Python'],
  },
  {
    id: '4',
    title: 'FoodHub - Restaurant Ordering',
    description: 'Multi-restaurant food ordering platform with real-time tracking and payment processing.',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400',
    category: 'ecommerce',
    technologies: ['Next.js', 'MongoDB', 'Socket.io'],
  },
  {
    id: '5',
    title: 'TaskMaster - Project Management',
    description: 'Collaborative project management tool with kanban boards and team communication features.',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400',
    category: 'web',
    technologies: ['React', 'GraphQL', 'PostgreSQL'],
  },
  {
    id: '6',
    title: 'ConnectHub - Social Platform',
    description: 'Professional networking platform with messaging, job postings, and skill endorsements.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400',
    category: 'web',
    technologies: ['Vue.js', 'Redis', 'AWS'],
  },
];

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'web', label: 'Web Apps' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'ecommerce', label: 'E-commerce' },
];

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'web' | 'mobile' | 'ecommerce'>('all');

  const filteredProjects = projects.filter(
    project => activeFilter === 'all' || project.category === activeFilter
  );

  return (
    <section id="projects" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">Featured Projects</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A showcase of my recent work and the technologies I've mastered
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg p-2 shadow-sm">
            {filterOptions.map((option) => (
              <Button
                key={option.value}
                variant={activeFilter === option.value ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveFilter(option.value as typeof activeFilter)}
                className={activeFilter === option.value ? "bg-blue-600 text-white" : "text-slate-600"}
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
            <Card key={project.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow" data-testid={`card-project-${project.id}`}>
              <div className="relative overflow-hidden rounded-t-xl">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-48 object-cover"
                  data-testid={`img-project-${project.id}`}
                />
              </div>
              <CardContent className="p-6">
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
                  <Button variant="outline" size="sm" data-testid={`button-demo-${project.id}`}>
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Live Demo
                  </Button>
                  <Button variant="ghost" size="sm" data-testid={`button-code-${project.id}`}>
                    <Github className="w-4 h-4 mr-1" />
                    Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
