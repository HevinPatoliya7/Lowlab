import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Scale, Menu, X, Key } from 'lucide-react';
import { ApiKeyModal } from './ApiKeyModal';

const NAV_LINKS = [
  { to: '/tutor', label: 'AI Tutor' },
  { to: '/summarizer', label: 'Case Summarizer' },
  { to: '/practice', label: 'Practice' },
  { to: '/library', label: 'Library' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isKeyConfigured, setIsKeyConfigured] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    setIsKeyConfigured(!!localStorage.getItem('GEMINI_API_KEY'));
  }, [apiKeyModalOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/80 backdrop-blur-lg border-b border-ink-900/5 py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-brand-grad flex items-center justify-center shadow-lg shadow-brand-violet/30 group-hover:scale-110 transition-transform">
              <Scale className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight text-ink-900">LawLab</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'bg-ink-900/5 text-ink-900'
                    : 'text-ink-900/70 hover:text-ink-900 hover:bg-ink-900/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setApiKeyModalOpen(true)}
              className={`p-2 rounded-full hover:bg-ink-900/5 transition-colors relative flex items-center justify-center ${
                isKeyConfigured ? 'text-brand-violet bg-brand-grad-soft/20 hover:bg-brand-grad-soft/40' : 'text-ink-900/40 hover:text-ink-900'
              }`}
              title="Configure API Key"
            >
              <Key className="w-5 h-5" />
              {isKeyConfigured && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-brand-violet rounded-full ring-2 ring-white" />
              )}
            </button>
            <Link to="/tutor" className="btn-primary text-sm">
              Start learning
            </Link>
          </div>

          <button
            className="md:hidden w-10 h-10 rounded-full bg-ink-900/5 flex items-center justify-center"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden mt-4 mx-6 p-4 rounded-2xl glass">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-3 rounded-xl text-sm font-medium ${
                    location.pathname === link.to ? 'bg-brand-grad-soft text-ink-900' : 'text-ink-900/70'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setOpen(false);
                  setApiKeyModalOpen(true);
                }}
                className="mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border border-ink-900/10 text-ink-900/70 hover:bg-ink-900/5 transition-colors"
              >
                <Key className="w-4 h-4" />
                API Key Settings
                {isKeyConfigured && (
                  <span className="w-2 h-2 bg-brand-violet rounded-full" />
                )}
              </button>
              <Link to="/tutor" className="mt-2 btn-primary text-sm text-center">
                Start learning
              </Link>
            </div>
          </div>
        )}
      </nav>
      <ApiKeyModal isOpen={apiKeyModalOpen} onClose={() => setApiKeyModalOpen(false)} />
    </>
  );
}

