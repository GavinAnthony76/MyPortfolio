import { useHost } from './host-provider';
import { motion } from 'framer-motion';

export default function HostDock() {
  const { isExpanded, isExperienceActive, toggle } = useHost();

  if (isExperienceActive) return null;

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.4, type: 'spring', stiffness: 200 }}
      onClick={toggle}
      className="fixed bottom-5 right-5 z-[60] w-14 h-14 rounded-full flex items-center justify-center shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-all duration-300 group"
      style={{
        background: 'linear-gradient(135deg, #2563eb 0%, #6366f1 50%, #8b5cf6 100%)',
      }}
      aria-label={isExpanded ? 'Collapse site guide' : 'Expand site guide'}
      aria-expanded={isExpanded}
      data-testid="host-dock"
    >
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 rounded-full bg-white/20 animate-host-breathe" />
        <svg
          viewBox="0 0 32 32"
          className="w-8 h-8 relative z-10"
          aria-hidden="true"
        >
          <circle cx="16" cy="16" r="6" fill="white" opacity="0.9" />
          <circle cx="16" cy="16" r="10" fill="none" stroke="white" strokeWidth="1.5" opacity="0.4" />
          <circle cx="16" cy="16" r="14" fill="none" stroke="white" strokeWidth="0.8" opacity="0.2" />
        </svg>
      </div>
      <span className="sr-only">Site Guide</span>
    </motion.button>
  );
}
