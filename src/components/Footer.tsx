import { Link } from 'react-router-dom';
import { Scale, Mail } from 'lucide-react';

function Github(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .297a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.8 1.31 3.49 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.58A12 12 0 0 0 12 .297z"/>
    </svg>
  );
}

function Linkedin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19 0h-14C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zM8 19H5V8h3v11zM6.5 6.73c-.97 0-1.75-.79-1.75-1.76s.78-1.76 1.75-1.76 1.75.79 1.75 1.76-.78 1.76-1.75 1.76zM20 19h-3v-5.6c0-3.37-4-3.11-4 0V19h-3V8h3v1.77c1.4-2.59 7-2.78 7 2.48V19z"/>
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="mt-32 border-t border-ink-900/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-brand-grad flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold tracking-tight text-ink-900">LawLab</span>
            </Link>
            <p className="text-ink-900/60 max-w-md leading-relaxed">
              An AI-powered learning platform for law students. Built for LLB students and CLAT aspirants who want to actually understand the law, not just memorize it.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-ink-900 mb-4">Tools</h4>
            <ul className="space-y-2 text-ink-900/60">
              <li><Link to="/tutor" className="hover:text-ink-900">AI Tutor</Link></li>
              <li><Link to="/summarizer" className="hover:text-ink-900">Case Summarizer</Link></li>
              <li><Link to="/practice" className="hover:text-ink-900">Practice Engine</Link></li>
              <li><Link to="/library" className="hover:text-ink-900">Law Library</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-ink-900 mb-4">Connect</h4>
            <div className="flex gap-3">
              <a href="https://github.com/HevinPatoliya7" target="_blank" rel="noreferrer"
                className="w-10 h-10 rounded-full bg-ink-900/5 hover:bg-brand-grad-soft flex items-center justify-center transition">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://www.linkedin.com/in/hevinpatoliya" target="_blank" rel="noreferrer"
                className="w-10 h-10 rounded-full bg-ink-900/5 hover:bg-brand-grad-soft flex items-center justify-center transition">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="mailto:hevinpatoliya@gmail.com"
                className="w-10 h-10 rounded-full bg-ink-900/5 hover:bg-brand-grad-soft flex items-center justify-center transition">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-ink-900/10 flex flex-col md:flex-row justify-between gap-4 text-sm text-ink-900/50">
          <p>© 2026 LawLab. Dev by Hevin Patoliya.</p>
          <p>
            <strong>Disclaimer:</strong> Educational content only. Not legal advice. Consult a qualified lawyer for specific matters.
          </p>
        </div>
      </div>
    </footer>
  );
}
