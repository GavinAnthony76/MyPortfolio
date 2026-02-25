import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useLocation } from 'wouter';
import {
  routePlaybook,
  sectionPlaybook,
  defaultContext,
  type RouteContext,
  type SectionContext,
  type ActionChip,
} from '@/lib/host-playbook';
import {
  isCollapsed as getIsCollapsed,
  setCollapsed as persistCollapsed,
  isExperienceCompleted as getIsExperienceCompleted,
  setExperienceCompleted as persistExperienceCompleted,
  scrollToSection,
} from '@/lib/host-utils';

interface HostState {
  isExpanded: boolean;
  isExperienceActive: boolean;
  experienceStep: number;
  experienceCompleted: boolean;
  currentSection: string;
  routeContext: RouteContext;
  sectionContext: SectionContext | null;
  showFirstVisitPrompt: boolean;
}

interface HostActions {
  expand: () => void;
  collapse: () => void;
  toggle: () => void;
  startExperience: () => void;
  stopExperience: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipExperience: () => void;
  setCurrentSection: (section: string) => void;
  handleChipAction: (chip: ActionChip) => void;
  dismissFirstVisitPrompt: () => void;
}

type HostContextValue = HostState & HostActions;

const HostContext = createContext<HostContextValue | null>(null);

export function useHost(): HostContextValue {
  const ctx = useContext(HostContext);
  if (!ctx) throw new Error('useHost must be used within HostProvider');
  return ctx;
}

export function HostProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isExperienceActive, setIsExperienceActive] = useState(false);
  const [experienceStep, setExperienceStep] = useState(0);
  const [experienceCompleted, setExperienceCompleted] = useState(() => getIsExperienceCompleted());
  const [currentSection, setCurrentSection] = useState('hero');
  const [showFirstVisitPrompt, setShowFirstVisitPrompt] = useState(false);

  const routeContext = routePlaybook[location] || defaultContext;
  const sectionContext = location === '/' ? (sectionPlaybook[currentSection] || null) : null;

  useEffect(() => {
    const wasCollapsed = getIsCollapsed();
    if (!wasCollapsed) {
      const timer = setTimeout(() => {
        setIsExpanded(true);
        if (!experienceCompleted) {
          setShowFirstVisitPrompt(true);
        }
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const expand = useCallback(() => {
    setIsExpanded(true);
    persistCollapsed(false);
  }, []);

  const collapse = useCallback(() => {
    setIsExpanded(false);
    persistCollapsed(true);
  }, []);

  const toggle = useCallback(() => {
    setIsExpanded(prev => {
      const next = !prev;
      persistCollapsed(!next);
      return next;
    });
  }, []);

  const startExperience = useCallback(() => {
    setIsExperienceActive(true);
    setExperienceStep(0);
    setIsExpanded(false);
    setShowFirstVisitPrompt(false);
  }, []);

  const stopExperience = useCallback(() => {
    setIsExperienceActive(false);
    setExperienceStep(0);
    setExperienceCompleted(true);
    persistExperienceCompleted(true);
  }, []);

  const nextStep = useCallback(() => {
    setExperienceStep(prev => prev + 1);
  }, []);

  const prevStep = useCallback(() => {
    setExperienceStep(prev => Math.max(0, prev - 1));
  }, []);

  const skipExperience = useCallback(() => {
    setIsExperienceActive(false);
    setExperienceStep(0);
    setExperienceCompleted(true);
    persistExperienceCompleted(true);
    setIsExpanded(true);
  }, []);

  const dismissFirstVisitPrompt = useCallback(() => {
    setShowFirstVisitPrompt(false);
  }, []);

  const handleChipAction = useCallback((chip: ActionChip) => {
    switch (chip.action) {
      case 'scroll':
        if (chip.target) {
          if (location !== '/') {
            setLocation('/');
            setTimeout(() => scrollToSection(chip.target!), 300);
          } else {
            scrollToSection(chip.target);
          }
        }
        collapse();
        break;
      case 'navigate':
        if (chip.target) {
          if (chip.target.includes('#')) {
            const [path, hash] = chip.target.split('#');
            setLocation(path || '/');
            setTimeout(() => scrollToSection(hash), 300);
          } else {
            setLocation(chip.target);
          }
        }
        collapse();
        break;
      case 'experience':
        startExperience();
        break;
      case 'dismiss':
        collapse();
        break;
    }
  }, [location, setLocation, collapse, startExperience]);

  const value: HostContextValue = {
    isExpanded,
    isExperienceActive,
    experienceStep,
    experienceCompleted,
    currentSection,
    routeContext,
    sectionContext,
    showFirstVisitPrompt,
    expand,
    collapse,
    toggle,
    startExperience,
    stopExperience,
    nextStep,
    prevStep,
    skipExperience,
    setCurrentSection,
    handleChipAction,
    dismissFirstVisitPrompt,
  };

  return <HostContext.Provider value={value}>{children}</HostContext.Provider>;
}
