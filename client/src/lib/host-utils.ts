const STORAGE_KEYS = {
  collapsed: 'ga_host_collapsed_v1',
  experienceCompleted: 'ga_experience_completed_v1',
} as const;

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export function getStorageValue(key: keyof typeof STORAGE_KEYS): string | null {
  if (!isBrowser()) return null;
  try {
    return localStorage.getItem(STORAGE_KEYS[key]);
  } catch {
    return null;
  }
}

export function setStorageValue(key: keyof typeof STORAGE_KEYS, value: string): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEYS[key], value);
  } catch {}
}

export function isCollapsed(): boolean {
  return getStorageValue('collapsed') === 'true';
}

export function setCollapsed(value: boolean): void {
  setStorageValue('collapsed', String(value));
}

export function isExperienceCompleted(): boolean {
  return getStorageValue('experienceCompleted') === 'true';
}

export function setExperienceCompleted(value: boolean): void {
  setStorageValue('experienceCompleted', String(value));
}

export function safeQuerySelector(selector: string): Element | null {
  if (!isBrowser()) return null;
  try {
    return document.querySelector(selector);
  } catch {
    return null;
  }
}

export function safeGetElementById(id: string): HTMLElement | null {
  if (!isBrowser()) return null;
  try {
    return document.getElementById(id);
  } catch {
    return null;
  }
}

export function getElementRect(selector: string): DOMRect | null {
  const el = safeQuerySelector(selector);
  if (!el) return null;
  return el.getBoundingClientRect();
}

export function scrollToSection(sectionId: string): void {
  const el = safeGetElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}
