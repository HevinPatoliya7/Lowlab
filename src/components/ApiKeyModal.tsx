import { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, X, ExternalLink, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApiKeyModal({ isOpen, onClose }: ApiKeyModalProps) {
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setKey(localStorage.getItem('GEMINI_API_KEY') || '');
      setStatusMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = key.trim();
    if (trimmed && !trimmed.startsWith('AIzaSy') && !trimmed.startsWith('AQ.')) {
      setStatusMsg('Warning: API keys from Google AI Studio usually start with "AIzaSy" or "AQ.". Please double-check.');
      return;
    }

    if (trimmed) {
      localStorage.setItem('GEMINI_API_KEY', trimmed);
      setStatusMsg('Key saved successfully! Reconnecting...');
    } else {
      localStorage.removeItem('GEMINI_API_KEY');
      setStatusMsg('Key removed. Using server configuration.');
    }

    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    localStorage.removeItem('GEMINI_API_KEY');
    setKey('');
    setStatusMsg('Key cleared. Using server configuration.');
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="bg-white rounded-3xl border border-ink-900/5 shadow-2xl max-w-md w-full p-6 relative overflow-hidden z-10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-ink-900/5 text-ink-900/40 hover:text-ink-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-grad flex items-center justify-center">
              <Key className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink-900">API Key Configuration</h3>
              <p className="text-xs text-ink-900/40">Local storage client override</p>
            </div>
          </div>

          {/* Body */}
          <div className="space-y-4">
            <p className="text-sm text-ink-900/70 leading-relaxed">
              If the LawLab deployment has no backend key configured, or you want to use your personal quota, paste your Google Gemini API key below.
            </p>

            <div className="bg-brand-grad-soft/30 rounded-2xl p-4 border border-brand-violet/10">
              <p className="text-xs text-brand-violet font-medium leading-relaxed flex items-start gap-1.5">
                <span>🔒</span>
                <span>Your API key is only saved locally in your browser's memory (`localStorage`) and sent directly to Google's API servers. It is never stored or processed by our server.</span>
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-900/50">Gemini API Key</label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="Paste AIzaSy... API key"
                  className="w-full pl-4 pr-10 py-3 rounded-2xl bg-ink-900/[0.02] border border-ink-900/5 outline-none focus:ring-2 focus:ring-brand-violet/30 text-ink-900 placeholder:text-ink-900/40 font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-900/30 hover:text-ink-900 transition-colors"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-violet hover:underline"
            >
              Get a free API key from Google AI Studio
              <ExternalLink className="w-3 h-3" />
            </a>

            {statusMsg && (
              <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                statusMsg.includes('Warning') 
                  ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {statusMsg.includes('successfully') || statusMsg.includes('cleared') || statusMsg.includes('removed') ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : null}
                <span>{statusMsg}</span>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex gap-3 pt-2">
              {localStorage.getItem('GEMINI_API_KEY') && (
                <button
                  onClick={handleClear}
                  className="flex-1 btn-ghost text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 py-2.5 text-sm"
                >
                  Clear Key
                </button>
              )}
              <button
                onClick={handleSave}
                className="flex-1 btn-primary py-2.5 text-sm shadow-none"
              >
                Save & Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
