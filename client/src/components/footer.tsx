import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 py-10 px-6 sm:px-10 bg-black">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-white/20 text-[10px] tracking-[0.15em] uppercase" data-testid="footer-copyright">
          &copy; {currentYear} Gavin Anthony
        </p>

        <div className="flex items-center gap-6">
          <Link href="/privacy-policy" className="editorial-link text-white/20 hover:text-white/50" data-testid="footer-link-privacy">
            Privacy
          </Link>
          <Link href="/terms-of-service" className="editorial-link text-white/20 hover:text-white/50" data-testid="footer-link-terms">
            Terms
          </Link>
          <a href="https://x.com/gavineanthony" target="_blank" rel="noopener noreferrer" className="editorial-link text-white/20 hover:text-white/50" data-testid="footer-link-twitter">
            Twitter
          </a>
          <a href="https://amzn.to/49MnhQq" target="_blank" rel="noopener noreferrer" className="editorial-link text-white/20 hover:text-white/50" data-testid="footer-link-amazon">
            Amazon
          </a>
        </div>
      </div>
    </footer>
  );
}
