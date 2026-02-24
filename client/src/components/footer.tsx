import { Github, Linkedin, Twitter } from "lucide-react";
import { SiAmazon } from "react-icons/si";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: '#about', label: 'About' },
    { href: '#projects', label: 'Projects' },
    { href: '#services', label: 'Services' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#contact', label: 'Contact' },
  ];

  const services = [
    { label: 'Basic Websites' },
    { label: 'Premium Package' },
    { label: 'Custom Package' },
    { label: 'Rapid Prototyping' },
  ];

  const handleLinkClick = (href: string) => {
    const elementId = href.substring(1);
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[hsl(220,22%,4%)] text-white py-12 sm:py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="sm:col-span-2 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">GA</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-white">Gavin Anthony</span>
            </div>
            <p className="text-slate-400 mb-4 sm:mb-6 leading-relaxed max-w-md text-sm sm:text-base">
              Professional web development services specializing in full-stack applications, 
              modern web solutions, and rapid prototyping for businesses of all sizes.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10" data-testid="footer-link-github">
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10" data-testid="footer-link-linkedin">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10" data-testid="footer-link-twitter" asChild>
                <a href="https://x.com/gavineanthony" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10" data-testid="footer-link-amazon" asChild>
                <a href="https://amzn.to/49MnhQq" target="_blank" rel="noopener noreferrer">
                  <SiAmazon className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-base sm:text-lg mb-4 sm:mb-6 text-white">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link.href);
                    }}
                    className="text-slate-400 hover:text-cyan-400 transition-colors text-sm"
                    data-testid={`footer-link-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-base sm:text-lg mb-4 sm:mb-6 text-white">Services</h4>
            <ul className="space-y-2 sm:space-y-3">
              {services.map((service) => (
                <li key={service.label}>
                  <span className="text-slate-400 hover:text-cyan-400 transition-colors text-sm cursor-pointer">
                    {service.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="divider-gradient mt-8 sm:mt-12 mb-6 sm:mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm text-center md:text-left" data-testid="footer-copyright">
            &copy; {currentYear} Gavin Anthony. All rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-center md:text-left">
            <a href="/privacy-policy" className="text-slate-500 hover:text-cyan-400 text-xs sm:text-sm transition-colors" data-testid="footer-link-privacy">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="text-slate-500 hover:text-cyan-400 text-xs sm:text-sm transition-colors" data-testid="footer-link-terms">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
