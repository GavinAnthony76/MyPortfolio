import { Github, Linkedin, Twitter, Dribbble } from "lucide-react";
import { SiAmazon } from "react-icons/si";
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
    { label: 'Progressive Web Applications' },
    { label: 'Landing Pages' },
    { label: 'Static Web Page Development' },
  ];

  const handleLinkClick = (href: string) => {
    const elementId = href.substring(1);
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-800 text-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="sm:col-span-2 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-lg">GA</span>
              </div>
              <span className="text-lg sm:text-xl font-bold">Gavin Anthony</span>
            </div>
            <p className="text-slate-300 mb-4 sm:mb-6 leading-relaxed max-w-md text-sm sm:text-base">
              Professional web development services specializing in full-stack applications, 
              progressive web apps, and modern web solutions that bring your ideas to life.
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" data-testid="footer-link-github">
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" data-testid="footer-link-linkedin">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" data-testid="footer-link-twitter" asChild>
                <a href="https://x.com/gavineanthony" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" data-testid="footer-link-dribbble">
                <Dribbble className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" data-testid="footer-link-amazon" asChild>
                <a href="https://amzn.to/49MnhQq" target="_blank" rel="noopener noreferrer">
                  <SiAmazon className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-base sm:text-lg mb-4 sm:mb-6">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link.href);
                    }}
                    className="text-slate-300 hover:text-white transition-colors text-sm sm:text-base"
                    data-testid={`footer-link-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-base sm:text-lg mb-4 sm:mb-6">Services</h4>
            <ul className="space-y-2 sm:space-y-3">
              {services.map((service) => (
                <li key={service.label}>
                  <span className="text-slate-300 hover:text-white transition-colors text-sm sm:text-base">
                    {service.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm sm:text-base text-center md:text-left" data-testid="footer-copyright">
              © {currentYear} Gavin Anthony. All rights reserved.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-center md:text-left">
              <a href="/privacy-policy" className="text-slate-400 hover:text-white text-xs sm:text-sm transition-colors" data-testid="footer-link-privacy">
                Privacy Policy
              </a>
              <a href="/terms-of-service" className="text-slate-400 hover:text-white text-xs sm:text-sm transition-colors" data-testid="footer-link-terms">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
