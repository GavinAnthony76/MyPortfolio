import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";

// Import generated tech images
import aiDashboardImage from "@assets/generated_images/AI_Dashboard_Interface_dc1310fc.png";
import ecommerceImage from "@assets/generated_images/E-commerce_Analytics_Interface_a340d8f8.png";
import webArchImage from "@assets/generated_images/Web_Architecture_Visualization_1e476c99.png";
import cryptoImage from "@assets/generated_images/Crypto_Trading_Platform_e3e8b01c.png";
import realEstateImage from "@assets/generated_images/Real_Estate_Management_64385fdb.png";
import taskMgmtImage from "@assets/generated_images/Task_Management_System_15136412.png";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'all' | 'web' | 'landing' | 'ecommerce';
  technologies: string[];
  liveUrl?: string;
  codeUrl?: string;
}

const projects: Project[] = [
  {
    id: '1',
    title: 'ShopFlow - E-commerce Platform',
    description: 'A complete e-commerce solution with payment integration, inventory management, and admin dashboard.',
    image: ecommerceImage,
    category: 'ecommerce',
    technologies: ['React', 'Node.js', 'Stripe'],
  },
  {
    id: '2',
    title: 'CryptoTrader - Digital Asset Platform',
    description: 'Advanced cryptocurrency trading platform with real-time market data, portfolio tracking, and secure wallet integration.',
    image: cryptoImage,
    category: 'web',
    technologies: ['Vue.js', 'Express.js', 'WebSocket'],
  },
  {
    id: '3',
    title: 'DataViz - Analytics Dashboard',
    description: 'Real-time analytics dashboard with interactive charts and customizable reports powered by AI insights.',
    image: aiDashboardImage,
    category: 'web',
    technologies: ['React', 'D3.js', 'Python'],
  },
  {
    id: '4',
    title: 'PropertyFlow - Real Estate Management',
    description: 'Comprehensive property management system with virtual tours, tenant portals, and automated workflows.',
    image: realEstateImage,
    category: 'web',
    technologies: ['Next.js', 'MongoDB', 'Socket.io'],
  },
  {
    id: '5',
    title: 'TaskMaster - Project Management',
    description: 'Collaborative project management tool with kanban boards, team communication, and AI-powered insights.',
    image: taskMgmtImage,
    category: 'web',
    technologies: ['React', 'GraphQL', 'PostgreSQL'],
  },
  {
    id: '6',
    title: 'TechArch - System Architecture Visualizer',
    description: 'Interactive web application for visualizing and designing complex system architectures with real-time collaboration.',
    image: webArchImage,
    category: 'web',
    technologies: ['Next.js', 'Tailwind CSS', 'Framer Motion'],
  },
];

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'web', label: 'Web Apps' },
  { value: 'landing', label: 'Landing Pages' },
  { value: 'ecommerce', label: 'E-commerce' },
];

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'web' | 'landing' | 'ecommerce'>('all');

  const filteredProjects = projects.filter(
    project => activeFilter === 'all' || project.category === activeFilter
  );

  return (
    <section id="projects" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured <span className="tech-title">Projects</span>
          </h2>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto">
            Showcasing AI-powered development solutions and cutting-edge web applications
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
                  <Button variant="outline" size="sm" data-testid={`button-demo-${project.id}`}>
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Live Demo
                  </Button>
                  <Button variant="ghost" size="sm" data-testid={`button-code-${project.id}`}>
                    <Github className="w-4 h-4 mr-1" />
                    Code
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
