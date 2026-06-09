import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle2, XCircle, RefreshCw, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { MCQS, TOPICS, type MCQ } from '../data/mcqs';

type Stage = 'select' | 'quiz' | 'results';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function PracticePage() {
  const [stage, setStage] = useState<Stage>('select');
  const [topic, setTopic] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<MCQ[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const topicCounts = useMemo(() => {
    const m: Record<string, number> = {};
    MCQS.forEach((q) => (m[q.topic] = (m[q.topic] || 0) + 1));
    return m;
  }, []);

  function startQuiz(t: string) {
    const pool = MCQS.filter((q) => q.topic === t);
    const picked = shuffle(pool).slice(0, Math.min(10, pool.length));
    setTopic(t);
    setQuiz(picked);
    setCurrent(0);
    setAnswers([]);
    setSelected(null);
    setShowExplanation(false);
    setStage('quiz');
  }

  function startAll() {
    setTopic('All Topics (Mixed)');
    setQuiz(shuffle(MCQS).slice(0, 10));
    setCurrent(0);
    setAnswers([]);
    setSelected(null);
    setShowExplanation(false);
    setStage('quiz');
  }

  function submit() {
    if (selected === null) return;
    setShowExplanation(true);
  }

  function next() {
    const newAnswers = [...answers, selected!];
    setAnswers(newAnswers);
    setSelected(null);
    setShowExplanation(false);
    if (current + 1 >= quiz.length) {
      setStage('results');
    } else {
      setCurrent(current + 1);
    }
  }

  function restart() {
    setStage('select');
    setTopic(null);
    setQuiz([]);
    setCurrent(0);
    setAnswers([]);
    setSelected(null);
    setShowExplanation(false);
  }

  const score = useMemo(() => {
    return answers.reduce((acc, a, i) => acc + (a === quiz[i]?.correctIndex ? 1 : 0), 0);
  }, [answers, quiz]);

  // SELECT STAGE
  if (stage === 'select') {
    return (
      <div className="pt-24 pb-12 min-h-screen">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-grad-soft mb-3">
              <Sparkles className="w-3.5 h-3.5 text-brand-violet" />
              <span className="text-xs font-bold uppercase tracking-wider text-brand-violet">Practice</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-ink-900 tracking-tight">
              Test what <span className="text-gradient">you actually know.</span>
            </h1>
            <p className="mt-3 text-ink-900/60">
              Pick a topic. Get 10 randomized MCQs with detailed explanations. No login. No fluff.
            </p>
          </div>

          {/* Mixed quiz card */}
          <motion.button
            onClick={startAll}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mb-6 p-6 md:p-8 rounded-3xl bg-brand-grad text-white text-left card-pop group"
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest opacity-80">Mixed Quiz</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold">All Topics — 10 Random Questions</h3>
                <p className="mt-2 text-white/80">Best for general revision across subjects</p>
              </div>
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-brand-violet font-bold group-hover:scale-105 transition-transform">
                Start <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.button>

          {/* Topic cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOPICS.map((t, i) => (
              <motion.button
                key={t}
                onClick={() => startQuiz(t)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-2xl bg-white border border-ink-900/5 text-left card-pop"
              >
                <h3 className="text-lg font-bold text-ink-900">{t}</h3>
                <p className="mt-1 text-sm text-ink-900/50">{topicCounts[t] || 0} questions available</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-violet">
                  Start practice <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // QUIZ STAGE
  if (stage === 'quiz') {
    const q = quiz[current];
    const isCorrect = selected !== null && selected === q.correctIndex;

    return (
      <div className="pt-24 pb-12 min-h-screen">
        <div className="max-w-3xl mx-auto px-6">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-ink-900/60">{topic}</span>
              <span className="text-sm font-bold text-ink-900">
                Q {current + 1} / {quiz.length}
              </span>
            </div>
            <div className="h-2 bg-ink-900/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-brand-grad"
                initial={{ width: 0 }}
                animate={{ width: `${((current) / quiz.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          {/* Question card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 md:p-8 rounded-3xl bg-white border border-ink-900/5 shadow-lg"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  q.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
                  q.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' :
                  'bg-rose-100 text-rose-700'
                }`}>{q.difficulty}</span>
                <span className="text-xs font-semibold text-ink-900/50">{q.topic}</span>
              </div>

              <h2 className="text-lg md:text-2xl font-bold text-ink-900 leading-snug mb-6">{q.question}</h2>

              <div className="space-y-3">
                {q.options.map((opt, i) => {
                  let style = 'bg-ink-900/[0.02] hover:bg-ink-900/[0.05] border-ink-900/5';
                  if (showExplanation) {
                    if (i === q.correctIndex) style = 'bg-emerald-50 border-emerald-300 text-emerald-900';
                    else if (i === selected) style = 'bg-rose-50 border-rose-300 text-rose-900';
                    else style = 'bg-ink-900/[0.01] border-ink-900/5 opacity-50';
                  } else if (selected === i) {
                    style = 'bg-brand-grad-soft border-brand-violet/50 text-ink-900';
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => !showExplanation && setSelected(i)}
                      disabled={showExplanation}
                      className={`w-full p-4 rounded-2xl border-2 text-left transition ${style} disabled:cursor-default`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                          showExplanation && i === q.correctIndex ? 'bg-emerald-500 text-white' :
                          showExplanation && i === selected ? 'bg-rose-500 text-white' :
                          selected === i ? 'bg-brand-violet text-white' :
                          'bg-ink-900/10 text-ink-900/70'
                        }`}>
                          {showExplanation && i === q.correctIndex ? <CheckCircle2 className="w-4 h-4" /> :
                           showExplanation && i === selected ? <XCircle className="w-4 h-4" /> :
                           String.fromCharCode(65 + i)}
                        </span>
                        <span className="font-medium pt-0.5">{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-6 p-5 rounded-2xl border-l-4 ${
                    isCorrect ? 'bg-emerald-50 border-emerald-500' : 'bg-rose-50 border-rose-500'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrect ? (
                      <><CheckCircle2 className="w-5 h-5 text-emerald-600" /><span className="font-bold text-emerald-900">Correct!</span></>
                    ) : (
                      <><XCircle className="w-5 h-5 text-rose-600" /><span className="font-bold text-rose-900">Not quite.</span></>
                    )}
                  </div>
                  <p className="text-sm text-ink-900/80 leading-relaxed">{q.explanation}</p>
                </motion.div>
              )}

              {/* Buttons */}
              <div className="mt-6 flex justify-end">
                {!showExplanation ? (
                  <button
                    onClick={submit}
                    disabled={selected === null}
                    className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Submit answer
                  </button>
                ) : (
                  <button onClick={next} className="btn-primary inline-flex items-center gap-2">
                    {current + 1 >= quiz.length ? 'See results' : 'Next question'} <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // RESULTS STAGE
  const pct = Math.round((score / quiz.length) * 100);
  const grade =
    pct >= 90 ? { label: 'Excellent', color: 'text-emerald-600', bg: 'from-emerald-500 to-teal-500' } :
    pct >= 70 ? { label: 'Good', color: 'text-brand-violet', bg: 'from-brand-violet to-brand-indigo' } :
    pct >= 50 ? { label: 'Fair', color: 'text-amber-600', bg: 'from-amber-500 to-orange-500' } :
    { label: 'Needs work', color: 'text-rose-600', bg: 'from-rose-500 to-pink-500' };

  return (
    <div className="pt-24 pb-12 min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className={`p-8 md:p-12 rounded-3xl bg-gradient-to-br ${grade.bg} text-white text-center`}>
            <Trophy className="w-12 h-12 mx-auto mb-4 opacity-90" />
            <p className="text-sm font-bold uppercase tracking-widest opacity-80">{grade.label}</p>
            <h1 className="text-6xl md:text-7xl font-bold mt-2">{score}/{quiz.length}</h1>
            <p className="mt-2 text-2xl opacity-90">{pct}%</p>
          </div>

          <div className="mt-8 space-y-3">
            <h2 className="text-lg font-bold text-ink-900">Question breakdown</h2>
            {quiz.map((q, i) => {
              const correct = answers[i] === q.correctIndex;
              return (
                <div key={q.id} className={`p-4 rounded-2xl border-l-4 ${correct ? 'bg-emerald-50 border-emerald-500' : 'bg-rose-50 border-rose-500'}`}>
                  <div className="flex gap-3">
                    {correct ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" /> :
                              <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-ink-900">{q.question}</p>
                      <p className="mt-1 text-xs text-ink-900/60">
                        Correct: <strong>{q.options[q.correctIndex]}</strong>
                        {!correct && <> · Your answer: {q.options[answers[i]]}</>}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={restart} className="btn-primary inline-flex items-center gap-2 justify-center">
              <RefreshCw className="w-4 h-4" /> Try another topic
            </button>
            <button onClick={() => topic && startQuiz(topic.replace(' (Mixed)', ''))} className="btn-ghost">
              Retry this topic
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
