import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useHost } from '@/components/host/host-provider';

const SECTION_IDS = ['home', 'projects', 'testimonials', 'blog', 'project-status', 'contact'];

const ID_TO_HOST_KEY: Record<string, string> = {
  home: 'hero',
  projects: 'projects',
  testimonials: 'testimonials',
  blog: 'blog',
  'project-status': 'project-status',
  contact: 'contact',
};

export function useSectionObserver() {
  const { setCurrentSection } = useHost();
  const [location] = useLocation();

  useEffect(() => {
    if (location !== '/') return;

    const observer = new IntersectionObserver(
      (entries) => {
        let bestEntry: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
              bestEntry = entry;
            }
          }
        }
        if (bestEntry) {
          const id = bestEntry.target.id;
          const hostKey = ID_TO_HOST_KEY[id] || id;
          setCurrentSection(hostKey);
        }
      },
      {
        threshold: [0.1, 0.3, 0.5],
        rootMargin: '-10% 0px -10% 0px',
      }
    );

    const elements: Element[] = [];
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        elements.push(el);
      }
    }

    return () => {
      for (const el of elements) {
        observer.unobserve(el);
      }
    };
  }, [setCurrentSection, location]);
}
