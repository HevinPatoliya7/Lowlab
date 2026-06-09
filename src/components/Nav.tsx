import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Scale, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { to: '/tutor', label: 'AI Tutor' },
  { to: '/summarizer', label: 'Case Summarizer' },
  { to: '/practice', label: 'Practice' },
  { to: '/library', label: 'Library' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
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

        <Link to="/tutor" className="hidden md:inline-block btn-primary text-sm">
          Start learning
        </Link>

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
            <Link to="/tutor" className="mt-2 btn-primary text-sm text-center">
              Start learning
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
