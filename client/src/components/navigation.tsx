import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const navLinks = [
    { href: "/#home", label: "Home" },
    { href: "/#projects", label: "Projects" },
    { href: "/#testimonials", label: "Testimonials" },
    { href: "/#project-status", label: "Status" },
    { href: "/#contact", label: "Start a Project" },
  ];

  const handleLinkClick = (href: string) => {
    setIsMobileMenuOpen(false);
    
    if (href.startsWith('/#')) {
      const elementId = href.substring(2);
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-3" data-testid="link-home">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">GA</span>
            </div>
            <span className="text-xl font-bold text-white">Gavin Anthony</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="text-slate-400 hover:text-cyan-400 transition-colors font-medium text-sm uppercase tracking-wider"
                data-testid={`link-${link.label.toLowerCase()}`}
              >
                {link.label}
              </a>
            ))}
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300" data-testid="link-dashboard">
                Dashboard
              </Button>
            </Link>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white hover:text-cyan-400"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900/95 border-t border-cyan-500/10" data-testid="mobile-menu">
          <div className="px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="block text-slate-400 hover:text-cyan-400 transition-colors font-medium text-sm uppercase tracking-wider"
                data-testid={`mobile-link-${link.label.toLowerCase()}`}
              >
                {link.label}
              </a>
            ))}
            <Link href="/dashboard" className="block">
              <Button variant="outline" size="sm" className="w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10" data-testid="mobile-link-dashboard">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
