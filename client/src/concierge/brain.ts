import {
  type Whisper,
  routes,
  sections,
  firstVisitWhisper,
  ctaHoverWhispers,
} from './siteMap';

const STORAGE_KEYS = {
  seen: 'ga_whisper_seen_v1',
  flyoverCompleted: 'ga_flyover_completed_v1',
};

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function hasSeenIntro(): boolean {
  if (!isBrowser()) return true;
  try { return localStorage.getItem(STORAGE_KEYS.seen) === 'true'; } catch { return true; }
}

export function markIntroSeen(): void {
  if (!isBrowser()) return;
  try { localStorage.setItem(STORAGE_KEYS.seen, 'true'); } catch {}
}

export function hasFlyoverCompleted(): boolean {
  if (!isBrowser()) return true;
  try { return localStorage.getItem(STORAGE_KEYS.flyoverCompleted) === 'true'; } catch { return true; }
}

export function markFlyoverCompleted(): void {
  if (!isBrowser()) return;
  try { localStorage.setItem(STORAGE_KEYS.flyoverCompleted, 'true'); } catch {}
}

export function getFirstVisitWhisper(): Whisper | null {
  if (hasSeenIntro()) return null;
  markIntroSeen();
  return firstVisitWhisper;
}

export function getSummonWhisper(pathname: string): Whisper {
  const route = routes.find(r => r.path === pathname);
  if (route) return route.summonWhisper;
  return {
    text: 'Need help navigating? I can point you in the right direction.',
    actions: [{ label: 'Go Home', type: 'navigate', target: '/' }],
    ttlMs: 8000,
    priority: 1,
  };
}

export function getSectionWhisper(sectionId: string): Whisper | null {
  const section = sections.find(s => s.whisperAttr === sectionId || s.id === sectionId);
  return section?.contextWhisper || null;
}

export function getCtaHoverWhisper(testId: string): Whisper | null {
  return ctaHoverWhispers[testId] || null;
}
