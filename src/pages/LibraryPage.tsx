import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, Scale, X, Sparkles } from 'lucide-react';
import { CASES, type Case } from '../data/cases';
import { SECTIONS, type Section } from '../data/sections';

type Tab = 'cases' | 'sections';

const CASE_CATS = ['All', 'Constitutional', 'Criminal', 'Civil', 'Contract', 'Tort'] as const;
const SECTION_CATS = ['All', 'Constitution', 'IPC', 'CrPC', 'Contract', 'Evidence'] as const;

export function LibraryPage() {
  const [tab, setTab] = useState<Tab>('cases');
  const [query, setQuery] = useState('');
  const [caseCat, setCaseCat] = useState<string>('All');
  const [secCat, setSecCat] = useState<string>('All');
  const [openCase, setOpenCase] = useState<Case | null>(null);
  const [openSection, setOpenSection] = useState<Section | null>(null);

  const filteredCases = useMemo(() => {
    const q = query.toLowerCase().trim();
    return CASES.filter((c) => {
      const matchCat = caseCat === 'All' || c.category === caseCat;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.citation.toLowerCase().includes(q) ||
        c.significance.toLowerCase().includes(q) ||
        c.keywords.some((k) => k.includes(q))
      );
    });
  }, [query, caseCat]);

  const filteredSections = useMemo(() => {
    const q = query.toLowerCase().trim();
    return SECTIONS.filter((s) => {
      const matchCat = secCat === 'All' || s.category === secCat;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        s.number.toLowerCase().includes(q) ||
        s.title.toLowerCase().includes(q) ||
        s.explanation.toLowerCase().includes(q) ||
        s.keywords.some((k) => k.includes(q))
      );
    });
  }, [query, secCat]);

  return (
    <div className="pt-24 pb-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-grad-soft mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-violet" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-violet">Library</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-ink-900 tracking-tight">
            Landmark cases &<br />
            <span className="text-gradient">key statutory sections.</span>
          </h1>
          <p className="mt-3 text-ink-900/60">
            Curated essentials every Indian law student must know — searchable, summarized, and structured for revision.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('cases')}
            className={`px-5 py-3 rounded-full font-semibold transition inline-flex items-center gap-2 ${
              tab === 'cases' ? 'bg-brand-grad text-white shadow-lg' : 'bg-ink-900/5 text-ink-900/70 hover:bg-ink-900/10'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Cases ({CASES.length})
          </button>
          <button
            onClick={() => setTab('sections')}
            className={`px-5 py-3 rounded-full font-semibold transition inline-flex items-center gap-2 ${
              tab === 'sections' ? 'bg-brand-grad text-white shadow-lg' : 'bg-ink-900/5 text-ink-900/70 hover:bg-ink-900/10'
            }`}
          >
            <Scale className="w-4 h-4" />
            Sections ({SECTIONS.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-900/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tab === 'cases' ? 'Search by case name, citation, or keyword...' : 'Search by section number, title, or keyword...'}
            className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white border border-ink-900/5 shadow-sm outline-none focus:ring-2 focus:ring-brand-violet/30 text-ink-900 placeholder:text-ink-900/40"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-ink-900/5 flex items-center justify-center">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(tab === 'cases' ? CASE_CATS : SECTION_CATS).map((c) => (
            <button
              key={c}
              onClick={() => (tab === 'cases' ? setCaseCat(c) : setSecCat(c))}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                (tab === 'cases' ? caseCat : secCat) === c
                  ? 'bg-ink-900 text-white'
                  : 'bg-ink-900/5 text-ink-900/70 hover:bg-ink-900/10'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        {tab === 'cases' ? (
          <>
            <p className="text-sm text-ink-900/50 mb-4">{filteredCases.length} cases</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCases.map((c, i) => (
                <motion.button
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setOpenCase(c)}
                  className="p-6 rounded-2xl bg-white border border-ink-900/5 text-left card-pop"
                >
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-grad-soft text-brand-violet">
                    {c.category}
                  </span>
                  <h3 className="mt-3 font-bold text-ink-900 leading-tight">{c.name}</h3>
                  <p className="mt-1 text-xs text-ink-900/50">{c.citation} · {c.year}</p>
                  <p className="mt-3 text-sm text-ink-900/60 line-clamp-3 leading-relaxed">{c.significance}</p>
                </motion.button>
              ))}
            </div>
            {filteredCases.length === 0 && <p className="text-center py-12 text-ink-900/50">No cases match your search.</p>}
          </>
        ) : (
          <>
            <p className="text-sm text-ink-900/50 mb-4">{filteredSections.length} sections</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSections.map((s, i) => (
                <motion.button
                  key={s.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setOpenSection(s)}
                  className="p-6 rounded-2xl bg-white border border-ink-900/5 text-left card-pop"
                >
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-grad-soft text-brand-violet">
                    {s.category}
                  </span>
                  <h3 className="mt-3 font-bold text-ink-900">{s.number}</h3>
                  <p className="text-sm text-ink-900/70 font-medium">{s.title}</p>
                  <p className="mt-2 text-xs text-ink-900/50">{s.act}</p>
                  <p className="mt-3 text-sm text-ink-900/60 line-clamp-2 leading-relaxed">{s.explanation}</p>
                </motion.button>
              ))}
            </div>
            {filteredSections.length === 0 && <p className="text-center py-12 text-ink-900/50">No sections match your search.</p>}
          </>
        )}
      </div>

      {/* Case modal */}
      <AnimatePresence>
        {openCase && (
          <Modal onClose={() => setOpenCase(null)}>
            <CaseDetail caseObj={openCase} />
          </Modal>
        )}
        {openSection && (
          <Modal onClose={() => setOpenSection(null)}>
            <SectionDetail section={openSection} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-ink-900/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        className="w-full max-w-3xl my-8 bg-white rounded-3xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-ink-900/5 hover:bg-ink-900/10 flex items-center justify-center">
          <X className="w-5 h-5" />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}

function CaseDetail({ caseObj: c }: { caseObj: Case }) {
  return (
    <div>
      <div className="p-8 bg-brand-grad text-white">
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20">
          {c.category}
        </span>
        <h2 className="mt-3 text-2xl md:text-3xl font-bold leading-tight">{c.name}</h2>
        <p className="mt-2 text-sm text-white/80">{c.citation} · {c.court} · {c.year}</p>
        <p className="text-sm text-white/80">{c.bench}</p>
      </div>
      <div className="p-8 space-y-6">
        <Block title="Parties">
          <p><strong>Petitioner:</strong> {c.parties.petitioner}</p>
          <p><strong>Respondent:</strong> {c.parties.respondent}</p>
        </Block>
        <Block title="Facts">
          <p>{c.facts}</p>
        </Block>
        <Block title="Issues">
          <ol className="list-decimal ml-5 space-y-1">
            {c.issues.map((i, idx) => <li key={idx}>{i}</li>)}
          </ol>
        </Block>
        <Block title="Holding">
          <p className="font-medium">{c.holding}</p>
        </Block>
        <Block title="Ratio Decidendi">
          <p>{c.ratio}</p>
        </Block>
        <Block title="Significance">
          <p>{c.significance}</p>
        </Block>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-ink-900/40 mb-2">Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {c.keywords.map((k) => (
              <span key={k} className="px-3 py-1 rounded-full bg-brand-grad-soft text-brand-violet text-sm font-medium">{k}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionDetail({ section: s }: { section: Section }) {
  return (
    <div>
      <div className="p-8 bg-brand-grad text-white">
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20">
          {s.category}
        </span>
        <h2 className="mt-3 text-2xl md:text-3xl font-bold leading-tight">{s.number}</h2>
        <p className="mt-1 text-lg text-white/90 font-medium">{s.title}</p>
        <p className="mt-2 text-sm text-white/80">{s.act}</p>
      </div>
      <div className="p-8 space-y-6">
        <Block title="Bare Text">
          <p className="italic font-mono text-sm leading-relaxed">{s.text}</p>
        </Block>
        <Block title="Explanation">
          <p>{s.explanation}</p>
        </Block>
        {s.punishment && (
          <Block title="Punishment">
            <p className="font-medium text-rose-600">{s.punishment}</p>
          </Block>
        )}
        <Block title="Examples">
          <ul className="list-disc ml-5 space-y-1">
            {s.examples.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </Block>
        <Block title="Landmark Cases">
          <ul className="space-y-1">
            {s.landmark.map((l, i) => <li key={i}>{l}</li>)}
          </ul>
        </Block>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-ink-900/40 mb-2">Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {s.keywords.map((k) => (
              <span key={k} className="px-3 py-1 rounded-full bg-brand-grad-soft text-brand-violet text-sm font-medium">{k}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-widest text-ink-900/40 mb-2">{title}</h4>
      <div className="text-ink-900/80 leading-relaxed space-y-1">{children}</div>
    </div>
  );
}
