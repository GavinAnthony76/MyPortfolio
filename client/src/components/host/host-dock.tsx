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
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full bg-white/15 animate-host-breathe" />
        <svg
          viewBox="0 0 40 40"
          className="w-10 h-10 relative z-10"
          aria-hidden="true"
        >
          <circle cx="20" cy="14" r="7" fill="white" opacity="0.95" />
          <ellipse cx="20" cy="30" rx="10" ry="7" fill="white" opacity="0.85" />
        </svg>
      </div>
      <span className="sr-only">Site Guide</span>
    </motion.button>
  );
}
