import { Github, Linkedin, Twitter } from "lucide-react";
import { SiAmazon } from "react-icons/si";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: '#projects', label: 'Projects' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#project-status', label: 'Project Status' },
    { href: '#contact', label: 'Start a Project' },
  ];

  const capabilities = [
    { label: 'E-Commerce Stores' },
    { label: 'SaaS Applications' },
    { label: 'Marketing Sites' },
    { label: 'Custom Web Apps' },
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
    <footer className="bg-slate-800 text-white py-12 sm:py-16 border-t border-slate-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="sm:col-span-2 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">GA</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-white">Gavin Anthony</span>
            </div>
            <p className="text-slate-400 mb-4 sm:mb-6 leading-relaxed max-w-md text-sm sm:text-base">
              Professional web development services specializing in full-stack applications, 
              modern web solutions, and rapid prototyping for businesses of all sizes.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-700" data-testid="footer-link-github">
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-700" data-testid="footer-link-linkedin">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-700" data-testid="footer-link-twitter" asChild>
                <a href="https://x.com/gavineanthony" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-700" data-testid="footer-link-amazon" asChild>
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
                    className="text-slate-400 hover:text-blue-400 transition-colors text-sm"
                    data-testid={`footer-link-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-base sm:text-lg mb-4 sm:mb-6 text-white">Capabilities</h4>
            <ul className="space-y-2 sm:space-y-3">
              {capabilities.map((item) => (
                <li key={item.label}>
                  <span className="text-slate-400 text-sm">
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="h-px bg-slate-700 mt-8 sm:mt-12 mb-6 sm:mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
            <p className="text-slate-500 text-sm text-center md:text-left" data-testid="footer-copyright">
              &copy; {currentYear} Gavin Anthony. All rights reserved.
            </p>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.open('https://www.sitelock.com/verify.php?site=gavineanthony.com', 'SiteLock', 'width=600,height=600,left=160,top=170');
              }}
              title="SiteLock"
            >
              <img
                alt="SiteLock"
                title="SiteLock"
                src="https://shield.sitelock.com/shield/gavineanthony.com"
                className="h-8 w-auto"
              />
            </a>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-center md:text-left">
            <a href="/privacy-policy" className="text-slate-500 hover:text-blue-400 text-xs sm:text-sm transition-colors" data-testid="footer-link-privacy">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="text-slate-500 hover:text-blue-400 text-xs sm:text-sm transition-colors" data-testid="footer-link-terms">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
