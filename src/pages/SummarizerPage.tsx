import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Sparkles, Loader2, RefreshCw, Scale, Users, BookOpen, Hammer, Lightbulb, Tag } from 'lucide-react';

interface Summary {
  caseName: string;
  citation?: string;
  court?: string;
  year?: string;
  bench?: string;
  parties: { petitioner: string; respondent: string };
  facts: string;
  issues: string[];
  holding: string;
  ratio: string;
  significance: string;
  keywords: string[];
}

const SAMPLE = `Maneka Gandhi v. Union of India, AIR 1978 SC 597. The petitioner, a journalist, was issued a passport on 1 June 1976 under the Passport Act, 1967. On 4 July 1977, the Regional Passport Officer, Delhi, by letter, asked her to surrender the passport "in public interest", giving no reasons. She filed a writ petition under Article 32 challenging the impoundment as violative of Articles 14, 19(1)(a), 19(1)(g), and 21 of the Constitution. The Supreme Court, by a seven-judge bench, held that the right to travel abroad is part of personal liberty under Article 21. It further held that the procedure prescribed by law for depriving a person of personal liberty must be just, fair and reasonable, and not arbitrary, fanciful or oppressive. The Court read Articles 14, 19 and 21 together as constituting the "golden triangle" of fundamental rights. The order impounding the passport was held to be in violation of natural justice as no reasons were communicated and no hearing was offered.`;

export function SummarizerPage() {
  const [input, setInput] = useState('');
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function summarize() {
    if (!input.trim() || input.trim().length < 50) {
      setError('Please paste at least 50 characters of a judgment.');
      return;
    }
    setError(null);
    setLoading(true);
    setSummary(null);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('GEMINI_API_KEY') || '';
      let parsed: Summary;

      if (apiKey) {
        // Direct call to Gemini API for local development or custom key override
        const SYSTEM_PROMPT = `You are LawLab Case Summarizer. Given a court judgment text (Indian, UK, or US common law), extract its essential elements into structured JSON.

Be accurate. If a field cannot be determined from the text, use an empty string or empty array. Do not fabricate.`;

        const RESPONSE_SCHEMA = {
          type: 'OBJECT',
          properties: {
            caseName: { type: 'STRING' },
            citation: { type: 'STRING' },
            court: { type: 'STRING' },
            year: { type: 'STRING' },
            bench: { type: 'STRING' },
            parties: { type: 'OBJECT', properties: { petitioner: { type: 'STRING' }, respondent: { type: 'STRING' } }, required: ['petitioner', 'respondent'] },
            facts: { type: 'STRING' },
            issues: { type: 'ARRAY', items: { type: 'STRING' } },
            holding: { type: 'STRING' },
            ratio: { type: 'STRING' },
            significance: { type: 'STRING' },
            keywords: { type: 'ARRAY', items: { type: 'STRING' } },
          },
          required: ['caseName', 'parties', 'facts', 'issues', 'holding', 'ratio', 'significance', 'keywords'],
        };

        const truncated = input.slice(0, 30000);
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
              contents: [{ role: 'user', parts: [{ text: `Summarize this judgment into structured JSON:\n\n${truncated}` }] }],
              generationConfig: { temperature: 0.2, maxOutputTokens: 8192, responseMimeType: 'application/json', responseSchema: RESPONSE_SCHEMA },
            }),
          }
        );

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error?.message || 'Gemini API Error');
        }
        
        const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
        const cleaned = responseText.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
        parsed = JSON.parse(cleaned);
      } else {
        // Secure call to Vercel Serverless Function in production
        const res = await fetch('/api/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ judgment: input }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'API Error');
        }
        parsed = data;
      }
      
      setSummary(parsed as Summary);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setSummary(null);
    setInput('');
    setError(null);
  }

  return (
    <div className="pt-24 pb-12 min-h-screen">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-grad-soft mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-violet" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-violet">Case Summarizer</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-ink-900 tracking-tight">
            Long judgments,<br /><span className="text-gradient">short summaries.</span>
          </h1>
          <p className="mt-3 text-ink-900/60 max-w-2xl">
            Paste any case judgment. Get parties, facts, issues, holding, ratio decidendi, and significance — extracted in seconds.
          </p>
        </div>

        {!summary && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="rounded-3xl bg-white border border-ink-900/5 shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-ink-900">Paste the judgment text</label>
                  <button
                    onClick={() => setInput(SAMPLE)}
                    className="text-xs font-semibold text-brand-violet hover:underline"
                  >
                    Try sample (Maneka Gandhi)
                  </button>
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste the full judgment text here..."
                  className="w-full h-80 px-4 py-3 rounded-2xl bg-ink-900/[0.02] border border-ink-900/5 outline-none focus:ring-2 focus:ring-brand-violet/30 text-ink-900 placeholder:text-ink-900/40 resize-none font-mono text-sm leading-relaxed"
                  disabled={loading}
                />
                <div className="mt-2 flex justify-between text-xs text-ink-900/50">
                  <span>{input.length.toLocaleString()} chars (~{Math.ceil(input.length / 4)} tokens)</span>
                  <span>Max 30,000 chars used</span>
                </div>
              </div>
              <div className="border-t border-ink-900/5 p-4 bg-ink-900/[0.01]">
                {error && (
                  <div className="mb-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm space-y-3 text-left">
                    <div className="font-semibold">{error}</div>
                    {error.includes('GEMINI_API_KEY') && (
                      <div className="p-4 bg-white rounded-xl border border-red-100 space-y-3">
                        <p className="text-xs text-ink-900/60 leading-relaxed">
                          This deployment doesn't have a Google Gemini API Key configured. You can paste your own API key below to run AI features directly from your browser. It is stored securely only on your device.
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="password"
                            placeholder="Paste AIzaSy... API key"
                            className="flex-1 px-4 py-2 text-xs rounded-xl bg-ink-900/[0.02] border border-ink-900/5 outline-none focus:ring-2 focus:ring-brand-violet/30 text-ink-900 placeholder:text-ink-900/40 font-mono"
                            id="summarizer-api-key-input"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const inputVal = (document.getElementById('summarizer-api-key-input') as HTMLInputElement)?.value.trim();
                              if (inputVal) {
                                localStorage.setItem('GEMINI_API_KEY', inputVal);
                                setError(null);
                                summarize();
                              }
                            }}
                            className="px-4 py-2 bg-brand-grad text-white text-xs font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-sm whitespace-nowrap"
                          >
                            Save & Retry
                          </button>
                        </div>
                        <p className="text-[10px] text-brand-violet font-semibold">
                          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-0.5">
                            Get a free key from Google AI Studio &rarr;
                          </a>
                        </p>
                      </div>
                    )}
                  </div>
                )}
                <button
                  onClick={summarize}
                  disabled={loading || input.trim().length < 50}
                  className="w-full btn-primary disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Summarizing...</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> Summarize judgment</>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {summary && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Header card */}
            <div className="p-8 rounded-3xl bg-brand-grad text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">{summary.caseName}</h2>
              <div className="flex flex-wrap gap-4 text-sm text-white/80">
                {summary.citation && <span>{summary.citation}</span>}
                {summary.court && <span>· {summary.court}</span>}
                {summary.year && <span>· {summary.year}</span>}
                {summary.bench && <span>· {summary.bench}</span>}
              </div>
            </div>

            {/* Parties */}
            <SummaryCard icon={Users} title="Parties" color="from-brand-orange to-brand-magenta">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-900/40 mb-1">Petitioner</p>
                  <p className="text-ink-900 font-medium">{summary.parties.petitioner}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-900/40 mb-1">Respondent</p>
                  <p className="text-ink-900 font-medium">{summary.parties.respondent}</p>
                </div>
              </div>
            </SummaryCard>

            {/* Facts */}
            <SummaryCard icon={FileText} title="Facts" color="from-brand-magenta to-brand-violet">
              <p className="text-ink-900/80 leading-relaxed">{summary.facts}</p>
            </SummaryCard>

            {/* Issues */}
            <SummaryCard icon={BookOpen} title="Issues" color="from-brand-violet to-brand-indigo">
              <ul className="space-y-2">
                {summary.issues.map((issue, i) => (
                  <li key={i} className="flex gap-3 text-ink-900/80 leading-relaxed">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-brand-grad-soft text-brand-violet text-xs font-bold flex items-center justify-center">{i + 1}</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </SummaryCard>

            {/* Holding */}
            <SummaryCard icon={Hammer} title="Holding" color="from-brand-indigo to-accent-sky">
              <p className="text-ink-900/80 leading-relaxed font-medium">{summary.holding}</p>
            </SummaryCard>

            {/* Ratio */}
            <SummaryCard icon={Scale} title="Ratio Decidendi" color="from-accent-emerald to-accent-sky">
              <p className="text-ink-900/80 leading-relaxed">{summary.ratio}</p>
            </SummaryCard>

            {/* Significance */}
            <SummaryCard icon={Lightbulb} title="Significance" color="from-accent-amber to-brand-orange">
              <p className="text-ink-900/80 leading-relaxed">{summary.significance}</p>
            </SummaryCard>

            {/* Keywords */}
            {summary.keywords.length > 0 && (
              <SummaryCard icon={Tag} title="Keywords" color="from-brand-violet to-brand-magenta">
                <div className="flex flex-wrap gap-2">
                  {summary.keywords.map((kw, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-brand-grad-soft text-brand-violet text-sm font-medium">
                      {kw}
                    </span>
                  ))}
                </div>
              </SummaryCard>
            )}

            <button
              onClick={reset}
              className="btn-ghost inline-flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" /> Summarize another judgment
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, title, color, children }: { icon: any; title: string; color: string; children: React.ReactNode }) {
  return (
    <div className="p-6 md:p-8 rounded-3xl bg-white border border-ink-900/5 card-pop">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-bold text-ink-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}
