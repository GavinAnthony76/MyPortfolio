import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';
import {
  type Whisper,
  type WhisperAction,
  type FlyoverStep,
  flyoverSteps,
  sections,
} from './siteMap';
import {
  getFirstVisitWhisper,
  getSummonWhisper,
  getSectionWhisper,
  getCtaHoverWhisper,
  markFlyoverCompleted,
} from './brain';

function safeQuery(selector: string): Element | null {
  try { return document.querySelector(selector); } catch { return null; }
}

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

interface WhisperPosition {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

function getAnchorPosition(anchor?: string): WhisperPosition | null {
  if (!anchor) return null;
  const el = safeQuery(anchor);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  const vw = window.innerWidth;

  if (vw < 640) return null;

  return {
    top: Math.max(80, rect.top + window.scrollY + 40),
    right: Math.max(20, vw - rect.right + 20),
  };
}

export default function WhisperConcierge() {
  const [location, setLocation] = useLocation();
  const [activeWhisper, setActiveWhisper] = useState<Whisper | null>(null);
  const [whisperPosition, setWhisperPosition] = useState<WhisperPosition | null>(null);
  const [isFlyoverActive, setIsFlyoverActive] = useState(false);
  const [flyoverStep, setFlyoverStep] = useState(0);
  const [showAskInput, setShowAskInput] = useState(false);
  const [askValue, setAskValue] = useState('');
  const [askResponse, setAskResponse] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [suppressScrollWhisper, setSuppressScrollWhisper] = useState(false);
  const [lastWhisperedSection, setLastWhisperedSection] = useState('');

  const ttlTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollPauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interactedRef = useRef(false);
  const mountedRef = useRef(false);

  const clearTtl = useCallback(() => {
    if (ttlTimerRef.current) {
      clearTimeout(ttlTimerRef.current);
      ttlTimerRef.current = null;
    }
  }, []);

  const dismissWhisper = useCallback(() => {
    clearTtl();
    setActiveWhisper(null);
    setWhisperPosition(null);
    setShowAskInput(false);
    setAskResponse('');
    interactedRef.current = false;
  }, [clearTtl]);

  const showWhisper = useCallback((whisper: Whisper, position?: WhisperPosition | null) => {
    clearTtl();
    interactedRef.current = false;
    setActiveWhisper(whisper);
    setWhisperPosition(position || null);
    setShowAskInput(false);
    setAskResponse('');

    ttlTimerRef.current = setTimeout(() => {
      if (!interactedRef.current) {
        dismissWhisper();
      }
    }, whisper.ttlMs);
  }, [clearTtl, dismissWhisper]);

  const handleAction = useCallback((action: WhisperAction) => {
    interactedRef.current = true;
    clearTtl();

    switch (action.type) {
      case 'scroll':
        if (action.target) {
          if (location !== '/') {
            setLocation('/');
            setTimeout(() => scrollTo(action.target!), 400);
          } else {
            scrollTo(action.target);
          }
        }
        dismissWhisper();
        setSuppressScrollWhisper(true);
        setTimeout(() => setSuppressScrollWhisper(false), 3000);
        break;
      case 'navigate':
        if (action.target) {
          if (action.target.includes('#')) {
            const [path, hash] = action.target.split('#');
            setLocation(path || '/');
            setTimeout(() => scrollTo(hash), 400);
          } else {
            setLocation(action.target);
          }
        }
        dismissWhisper();
        break;
      case 'flyover':
        dismissWhisper();
        setIsFlyoverActive(true);
        setFlyoverStep(0);
        break;
      case 'dismiss':
        dismissWhisper();
        break;
    }
  }, [location, setLocation, clearTtl, dismissWhisper]);

  const handleSummon = useCallback(() => {
    if (activeWhisper) {
      dismissWhisper();
      return;
    }
    const whisper = getSummonWhisper(location);
    showWhisper(whisper);
  }, [activeWhisper, location, showWhisper, dismissWhisper]);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    const timer = setTimeout(() => {
      const intro = getFirstVisitWhisper();
      if (intro && location === '/') {
        showWhisper(intro);
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (location !== '/' || isFlyoverActive || suppressScrollWhisper) return;

    let visibleSection = '';

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            const attr = (entry.target as HTMLElement).dataset.whisper;
            if (attr) visibleSection = attr;
          }
        }
      },
      { threshold: [0.3], rootMargin: '-10% 0px -10% 0px' }
    );

    const els: Element[] = [];
    for (const s of sections) {
      const el = safeQuery(`[data-whisper="${s.whisperAttr}"]`);
      if (el) { observer.observe(el); els.push(el); }
    }

    const onScroll = () => {
      if (scrollPauseTimerRef.current) clearTimeout(scrollPauseTimerRef.current);
      scrollPauseTimerRef.current = setTimeout(() => {
        if (
          visibleSection &&
          visibleSection !== 'hero' &&
          visibleSection !== lastWhisperedSection &&
          !activeWhisper &&
          !isFlyoverActive
        ) {
          const w = getSectionWhisper(visibleSection);
          if (w) {
            setLastWhisperedSection(visibleSection);
            const pos = getAnchorPosition(w.anchor);
            showWhisper(w, pos);
          }
        }
      }, 1200);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (scrollPauseTimerRef.current) clearTimeout(scrollPauseTimerRef.current);
    };
  }, [location, isFlyoverActive, suppressScrollWhisper, activeWhisper, lastWhisperedSection, showWhisper]);

  useEffect(() => {
    if (location !== '/') return;

    const ctaIds = ['button-view-projects', 'button-start-project', 'button-check-status'];
    const handlers: Array<{ el: Element; handler: () => void }> = [];

    for (const id of ctaIds) {
      const el = safeQuery(`[data-testid="${id}"]`);
      if (!el) continue;
      const handler = () => {
        if (activeWhisper || isFlyoverActive) return;
        const w = getCtaHoverWhisper(id);
        if (w) {
          const rect = el.getBoundingClientRect();
          const pos: WhisperPosition = {
            top: rect.bottom + window.scrollY + 8,
            left: Math.max(20, rect.left),
          };
          showWhisper(w, pos);
        }
      };
      el.addEventListener('mouseenter', handler);
      el.addEventListener('focusin', handler);
      handlers.push({ el, handler });
    }

    return () => {
      for (const { el, handler } of handlers) {
        el.removeEventListener('mouseenter', handler);
        el.removeEventListener('focusin', handler);
      }
    };
  }, [location, activeWhisper, isFlyoverActive, showWhisper]);

  const handleAsk = async () => {
    if (!askValue.trim() || isAsking) return;
    interactedRef.current = true;
    clearTtl();
    setIsAsking(true);
    try {
      const res = await fetch('/api/whisper/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: askValue }),
      });
      if (res.ok) {
        const data = await res.json();
        setAskResponse(data.text || data.answer || 'Try the action buttons for quick navigation.');
      } else {
        setAskResponse('Try the action buttons for quick navigation.');
      }
    } catch {
      setAskResponse('Try the action buttons for quick navigation.');
    }
    setAskValue('');
    setIsAsking(false);
  };

  const currentFlyoverStep: FlyoverStep | null = isFlyoverActive ? flyoverSteps[flyoverStep] || null : null;

  useEffect(() => {
    if (!isFlyoverActive || !currentFlyoverStep) return;
    const el = safeQuery(currentFlyoverStep.target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      scrollTo(currentFlyoverStep.sectionId);
    }
  }, [isFlyoverActive, flyoverStep, currentFlyoverStep]);

  useEffect(() => {
    if (!isFlyoverActive) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFlyoverActive(false);
        markFlyoverCompleted();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (flyoverStep < flyoverSteps.length - 1) setFlyoverStep(s => s + 1);
        else { setIsFlyoverActive(false); markFlyoverCompleted(); }
      } else if (e.key === 'ArrowLeft') {
        if (flyoverStep > 0) setFlyoverStep(s => s - 1);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isFlyoverActive, flyoverStep]);

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5, type: 'spring', stiffness: 180 }}
        onClick={handleSummon}
        className="fixed bottom-5 right-5 z-[70] w-12 h-12 rounded-full flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 transition-transform duration-300 hover:scale-110"
        style={{
          background: 'radial-gradient(circle at 40% 35%, rgba(99,102,241,0.9) 0%, rgba(37,99,235,0.85) 60%, rgba(79,70,229,0.8) 100%)',
          boxShadow: '0 0 20px rgba(99,102,241,0.3), 0 4px 12px rgba(0,0,0,0.15)',
        }}
        aria-label="Summon site guide"
        data-testid="whisper-sigil"
      >
        <div className="relative w-7 h-7">
          <div className="absolute inset-0 rounded-full bg-white/20 animate-whisper-pulse" />
          <svg viewBox="0 0 28 28" className="w-7 h-7 relative z-10" aria-hidden="true">
            <circle cx="14" cy="10" r="5" fill="white" opacity="0.95" />
            <ellipse cx="14" cy="21" rx="7" ry="5" fill="white" opacity="0.8" />
          </svg>
        </div>
      </motion.button>

      <AnimatePresence>
        {activeWhisper && !isFlyoverActive && (
          <motion.div
            key="whisper-card"
            initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -6, filter: 'blur(12px)' }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="fixed z-[70] max-w-xs w-72 sm:w-80"
            style={
              whisperPosition
                ? {
                    top: whisperPosition.top != null ? whisperPosition.top - (window.scrollY || 0) : undefined,
                    bottom: whisperPosition.bottom,
                    left: whisperPosition.left,
                    right: whisperPosition.right,
                  }
                : { bottom: 76, right: 20 }
            }
            onMouseEnter={() => { interactedRef.current = true; clearTtl(); }}
            role="status"
            aria-live="polite"
            data-testid="whisper-card"
          >
            <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/60 p-4 space-y-3">
              <button
                onClick={dismissWhisper}
                className="absolute top-2 right-2 w-6 h-6 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center text-xs transition-colors"
                aria-label="Dismiss"
                data-testid="whisper-dismiss"
              >
                ✕
              </button>

              <p className="text-sm text-slate-700 leading-relaxed pr-5">{activeWhisper.text}</p>

              {askResponse && (
                <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-2 leading-relaxed border border-slate-100">{askResponse}</p>
              )}

              {activeWhisper.actions.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {activeWhisper.actions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => handleAction(action)}
                      className="text-xs font-medium px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors border border-indigo-100"
                      data-testid={`whisper-action-${i}`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}

              {!showAskInput ? (
                <button
                  onClick={() => { setShowAskInput(true); interactedRef.current = true; clearTtl(); }}
                  className="text-xs text-slate-400 hover:text-indigo-500 transition-colors"
                  data-testid="whisper-ask-toggle"
                >
                  Ask a quick question
                </button>
              ) : (
                <div className="flex items-center gap-1.5 pt-1">
                  <input
                    type="text"
                    value={askValue}
                    onChange={e => setAskValue(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAsk()}
                    placeholder="What would you like to know?"
                    className="flex-1 text-xs bg-white border border-slate-200 rounded-full px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-400 text-slate-700 placeholder:text-slate-400"
                    disabled={isAsking}
                    autoFocus
                    data-testid="whisper-ask-input"
                  />
                  <button
                    onClick={handleAsk}
                    disabled={!askValue.trim() || isAsking}
                    className="w-6 h-6 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center disabled:opacity-40 transition-colors"
                    aria-label="Send"
                    data-testid="whisper-ask-submit"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFlyoverActive && currentFlyoverStep && (
          <motion.div
            key={`flyover-${flyoverStep}`}
            initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(12px)' }}
            transition={{ duration: 0.35 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] w-80 max-w-[calc(100vw-40px)]"
            role="dialog"
            aria-modal="true"
            aria-label={currentFlyoverStep.title}
            data-testid="flyover-card"
          >
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 p-5 space-y-3">
              <div>
                <p className="text-xs font-medium text-indigo-500 uppercase tracking-wider">
                  {flyoverStep + 1} / {flyoverSteps.length}
                </p>
                <h4 className="text-base font-bold text-slate-800 mt-0.5">{currentFlyoverStep.title}</h4>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{currentFlyoverStep.text}</p>
              <div className="flex items-center justify-between pt-1">
                <div className="flex gap-1">
                  {flyoverSteps.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i === flyoverStep ? 'bg-indigo-500' : i < flyoverStep ? 'bg-indigo-300' : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  {flyoverStep > 0 && (
                    <button
                      onClick={() => setFlyoverStep(s => s - 1)}
                      className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1 rounded transition-colors"
                      data-testid="flyover-prev"
                    >
                      ← Back
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (flyoverStep < flyoverSteps.length - 1) {
                        setFlyoverStep(s => s + 1);
                      } else {
                        setIsFlyoverActive(false);
                        markFlyoverCompleted();
                      }
                    }}
                    className="text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-full transition-colors"
                    data-testid="flyover-next"
                  >
                    {flyoverStep < flyoverSteps.length - 1 ? 'Next →' : 'Finish ✓'}
                  </button>
                  <button
                    onClick={() => { setIsFlyoverActive(false); markFlyoverCompleted(); }}
                    className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded transition-colors"
                    data-testid="flyover-skip"
                  >
                    Skip
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
