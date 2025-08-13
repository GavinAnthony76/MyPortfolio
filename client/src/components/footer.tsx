import { Github, Linkedin, Twitter, Dribbble } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: '#about', label: 'About' },
    { href: '#projects', label: 'Projects' },
    { href: '#services', label: 'Services' },
    { href: '#contact', label: 'Contact' },
  ];

  const services = [
    { label: 'Full-Stack Development' },
    { label: 'Rapid Prototyping' },
    { label: 'Code Generation' },
    { label: 'AI Debugging' },
    { label: 'Tech Consulting' },
  ];

  const handleLinkClick = (href: string) => {
    const elementId = href.substring(1);
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">GA</span>
              </div>
              <span className="text-xl font-bold">Gavin Anthony</span>
            </div>
            <p className="text-slate-300 mb-6 leading-relaxed max-w-md">
              AI-powered development services for rapid prototyping, intelligent code generation, 
              and modern web solutions that bring your ideas to life quickly.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" data-testid="footer-link-github">
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" data-testid="footer-link-linkedin">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" data-testid="footer-link-twitter">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" data-testid="footer-link-dribbble">
                <Dribbble className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link.href);
                    }}
                    className="text-slate-300 hover:text-white transition-colors"
                    data-testid={`footer-link-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.label}>
                  <span className="text-slate-300 hover:text-white transition-colors">
                    {service.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm" data-testid="footer-copyright">
              © {currentYear} Gavin Anthony. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors" data-testid="footer-link-privacy">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors" data-testid="footer-link-terms">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
