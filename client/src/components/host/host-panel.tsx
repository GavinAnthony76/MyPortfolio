import { useState } from 'react';
import { useHost } from './host-provider';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Sparkles, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HostPanel() {
  const {
    isExpanded,
    collapse,
    routeContext,
    sectionContext,
    experienceCompleted,
    startExperience,
    handleChipAction,
    showFirstVisitPrompt,
    dismissFirstVisitPrompt,
  } = useHost();

  const [askInput, setAskInput] = useState('');
  const [askResponse, setAskResponse] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  const context = sectionContext || routeContext;
  const displayMessage = sectionContext?.message || routeContext.message;
  const chips = sectionContext?.chips || routeContext.chips;

  const handleAsk = async () => {
    if (!askInput.trim() || isAsking) return;
    setIsAsking(true);
    try {
      const res = await fetch('/api/host/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: askInput }),
      });
      if (res.ok) {
        const data = await res.json();
        setAskResponse(data.answer);
      } else {
        setAskResponse('I can help you navigate the site. Try the action buttons below.');
      }
    } catch {
      setAskResponse('I can help you navigate the site. Try the action buttons below.');
    }
    setAskInput('');
    setIsAsking(false);
  };

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-24 right-5 z-[60] w-80 max-w-[calc(100vw-40px)]"
          role="complementary"
          aria-label="Site guide panel"
          data-testid="host-panel"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                  <svg viewBox="0 0 20 20" className="w-5 h-5" aria-hidden="true">
                    <circle cx="10" cy="7" r="3.5" fill="white" opacity="0.95" />
                    <ellipse cx="10" cy="15.5" rx="5" ry="3.5" fill="white" opacity="0.85" />
                  </svg>
                </div>
                <span className="text-white font-semibold text-sm">Site Guide</span>
              </div>
              <button
                onClick={collapse}
                className="text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                aria-label="Close guide"
                data-testid="host-panel-close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {showFirstVisitPrompt && !experienceCompleted && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm font-medium text-indigo-700">First time here?</span>
                  </div>
                  <p className="text-xs text-indigo-600">Take a 60-second guided tour of the site.</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white h-7 px-3"
                      onClick={startExperience}
                      data-testid="host-start-experience"
                    >
                      Start Experience
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-indigo-500 hover:text-indigo-700 h-7 px-3"
                      onClick={dismissFirstVisitPrompt}
                    >
                      Skip
                    </Button>
                  </div>
                </div>
              )}

              <p className="text-sm text-slate-600 leading-relaxed">{displayMessage}</p>

              {askResponse && (
                <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700 leading-relaxed border border-slate-100">
                  {askResponse}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {chips.map((chip, i) => (
                  <button
                    key={i}
                    onClick={() => handleChipAction(chip)}
                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors border border-slate-200 hover:border-blue-200"
                    data-testid={`host-chip-${i}`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {experienceCompleted && (
                <button
                  onClick={startExperience}
                  className="flex items-center gap-1.5 text-xs text-indigo-500 hover:text-indigo-700 transition-colors mt-1"
                  data-testid="host-replay-experience"
                >
                  <RotateCcw className="w-3 h-3" />
                  Replay Experience
                </button>
              )}

              <div className="pt-1 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={askInput}
                    onChange={(e) => setAskInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                    placeholder="Ask about this page..."
                    className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-slate-700 placeholder:text-slate-400"
                    disabled={isAsking}
                    data-testid="host-ask-input"
                  />
                  <button
                    onClick={handleAsk}
                    disabled={!askInput.trim() || isAsking}
                    className="w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Ask"
                    data-testid="host-ask-submit"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
