import { useState, useEffect, useCallback } from 'react';
import { useHost } from './host-provider';
import { experienceSteps } from '@/lib/host-playbook';
import { safeQuerySelector, scrollToSection } from '@/lib/host-utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export default function ExperienceOverlay() {
  const {
    isExperienceActive,
    experienceStep,
    nextStep,
    prevStep,
    skipExperience,
    stopExperience,
  } = useHost();

  const [spotlightRect, setSpotlightRect] = useState<SpotlightRect | null>(null);
  const [tooltipStyle, setTooltipStyle] = useState<Record<string, string | number>>({});

  const totalSteps = experienceSteps.length;
  const step = experienceSteps[experienceStep];
  const isLastStep = experienceStep >= totalSteps - 1;
  const isBeyondSteps = experienceStep >= totalSteps;

  const updateSpotlight = useCallback(() => {
    if (!step) return;
    const el = safeQuerySelector(step.target);
    if (!el) {
      setSpotlightRect(null);
      return;
    }
    const rect = el.getBoundingClientRect();
    const padding = 12;
    setSpotlightRect({
      top: rect.top - padding + window.scrollY,
      left: rect.left - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2,
    });

    const vw = window.innerWidth;
    const tooltipWidth = Math.min(320, vw - 40);

    let style: Record<string, string | number> = {};
    if (step.position === 'bottom' || step.position === 'top') {
      const centerX = rect.left + rect.width / 2;
      let left = centerX - tooltipWidth / 2;
      left = Math.max(20, Math.min(left, vw - tooltipWidth - 20));
      style.left = left;
      style.width = tooltipWidth;
    }

    if (step.position === 'bottom') {
      style.top = rect.bottom + window.scrollY + 20;
    } else if (step.position === 'top') {
      style.top = rect.top + window.scrollY - 180;
    } else if (step.position === 'left') {
      style.top = rect.top + window.scrollY + rect.height / 2 - 60;
      style.right = vw - rect.left + 20;
      style.width = tooltipWidth;
    } else {
      style.top = rect.top + window.scrollY + rect.height / 2 - 60;
      style.left = rect.right + 20;
      style.width = tooltipWidth;
    }

    setTooltipStyle(style);
  }, [step]);

  useEffect(() => {
    if (!isExperienceActive || !step) return;

    const sectionId = step.target.replace('[data-host="', '').replace('"]', '');
    const el = safeQuerySelector(step.target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      scrollToSection(sectionId);
    }

    const timer = setTimeout(updateSpotlight, 500);
    const handleResize = () => updateSpotlight();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', updateSpotlight);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', updateSpotlight);
    };
  }, [isExperienceActive, experienceStep, step, updateSpotlight]);

  useEffect(() => {
    if (!isExperienceActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          skipExperience();
          break;
        case 'ArrowRight':
        case 'Enter':
          if (isBeyondSteps) return;
          nextStep();
          break;
        case 'ArrowLeft':
          if (experienceStep > 0) prevStep();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExperienceActive, experienceStep, isBeyondSteps, nextStep, prevStep, skipExperience]);

  if (!isExperienceActive) return null;

  if (isBeyondSteps) {
    return (
      <div className="fixed inset-0 z-[100]">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center space-y-4"
          >
            <div className="w-12 h-12 mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-7 h-7" aria-hidden="true">
                <circle cx="12" cy="8.5" r="4.2" fill="white" opacity="0.95" />
                <ellipse cx="12" cy="18" rx="6" ry="4.2" fill="white" opacity="0.85" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800">Tour Complete</h3>
            <p className="text-sm text-slate-500">You've seen the highlights. Ready to take the next step?</p>
            <div className="space-y-2">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  stopExperience();
                  const el = document.getElementById('contact');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                data-testid="experience-cta-contact"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Start a Project
              </Button>
              <Button
                variant="outline"
                className="w-full border-slate-200"
                onClick={() => {
                  stopExperience();
                  const el = document.getElementById('projects');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                data-testid="experience-cta-portfolio"
              >
                Browse Portfolio
              </Button>
              <Button
                variant="ghost"
                className="w-full text-slate-500"
                onClick={stopExperience}
                data-testid="experience-cta-close"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <svg className="fixed inset-0 w-full h-full pointer-events-auto" style={{ height: document.documentElement.scrollHeight }}>
        <defs>
          <mask id="spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {spotlightRect && (
              <rect
                x={spotlightRect.left}
                y={spotlightRect.top}
                width={spotlightRect.width}
                height={spotlightRect.height}
                rx="12"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0" y="0" width="100%" height="100%"
          fill="rgba(0,0,0,0.6)"
          mask="url(#spotlight-mask)"
          onClick={skipExperience}
        />
      </svg>

      <AnimatePresence mode="wait">
        <motion.div
          key={experienceStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="fixed pointer-events-auto"
          style={tooltipStyle}
          role="dialog"
          aria-modal="true"
          aria-label={step?.title}
        >
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-indigo-500 uppercase tracking-wider">
                  Step {experienceStep + 1} of {totalSteps}
                </p>
                <h4 className="text-base font-bold text-slate-800 mt-0.5">{step?.title}</h4>
              </div>
              <button
                onClick={skipExperience}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                aria-label="Skip tour"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{step?.message}</p>
            <div className="flex items-center justify-between pt-1">
              <div className="flex gap-1">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === experienceStep ? 'bg-indigo-500' : i < experienceStep ? 'bg-indigo-300' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                {experienceStep > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevStep}
                    className="h-8 px-3 text-xs text-slate-600"
                    data-testid="experience-prev"
                  >
                    <ChevronLeft className="w-3 h-3 mr-1" />
                    Back
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={isLastStep ? nextStep : nextStep}
                  className="h-8 px-3 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                  data-testid="experience-next"
                >
                  {isLastStep ? 'Finish' : 'Next'}
                  <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
