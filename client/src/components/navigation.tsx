import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Zap } from "lucide-react";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const [visible, setVisible] = useState(false);
  const [liteMode, setLiteMode] = useState(() => {
    if (typeof window !== "undefined") {
      return document.body.classList.contains("lite-mode");
    }
    return false;
  });

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (liteMode) {
      document.body.classList.add("lite-mode");
    } else {
      document.body.classList.remove("lite-mode");
    }
  }, [liteMode]);

  const isWorksPage = location === "/works" || location.startsWith("/works/");
  const isFocusPage = location === "/";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-opacity ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{ transitionDuration: "var(--duration-slow)" }}
    >
      <div className="px-6 sm:px-10 py-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/works"
            className={`editorial-link ${isWorksPage ? "active" : ""}`}
          >
            All
          </Link>
          <Link
            href="/"
            className={`editorial-link ${isFocusPage ? "active" : ""}`}
          >
            Focus
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/about" className={`editorial-link ${location === "/about" ? "active" : ""}`}>
            About
          </Link>
          <Link href="/contact" className={`editorial-link ${location === "/contact" ? "active" : ""}`}>
            Contact
          </Link>
          <button
            onClick={() => setLiteMode(!liteMode)}
            className="editorial-link flex items-center gap-1"
            title={liteMode ? "Disable lite mode" : "Enable lite mode"}
          >
            <Zap className="w-3 h-3" />
          </button>
          <Link href="/dashboard" className="editorial-link">
            Dashboard
          </Link>
        </div>

        <button
          className="md:hidden text-white/85 hover:text-white transition-colors p-1"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-sm border-t border-white/5">
          <div className="px-6 py-8 flex flex-col gap-5">
            <Link href="/works" onClick={() => setIsMobileMenuOpen(false)} className={`editorial-link ${isWorksPage ? "active" : ""}`}>All</Link>
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={`editorial-link ${isFocusPage ? "active" : ""}`}>Focus</Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className={`editorial-link ${location === "/about" ? "active" : ""}`}>About</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className={`editorial-link ${location === "/contact" ? "active" : ""}`}>Contact</Link>
            <div className="h-px bg-white/10 my-1" />
            <button onClick={() => setLiteMode(!liteMode)} className="editorial-link flex items-center gap-2 text-left">
              <Zap className="w-3 h-3" />
              <span>{liteMode ? "Lite On" : "Lite Off"}</span>
            </button>
            <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="editorial-link">Dashboard</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
