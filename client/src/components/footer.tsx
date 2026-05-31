import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 py-10 px-6 sm:px-10 bg-black">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <p className="text-white/20 text-[10px] tracking-[0.15em] uppercase" data-testid="footer-copyright">
            &copy; {currentYear} Gavin Anthony
          </p>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.open('https://www.sitelock.com/verify.php?site=gavineanthony.com', 'SiteLock', 'width=600,height=600,left=160,top=170');
            }}
            title="SiteLock"
            className="opacity-50 hover:opacity-80 transition-opacity"
          >
            <img
              alt="SiteLock"
              title="SiteLock"
              src="https://shield.sitelock.com/shield/gavineanthony.com"
              className="h-7 w-auto"
            />
          </a>
        </div>

        <div className="flex items-center flex-wrap gap-x-6 gap-y-2">
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
