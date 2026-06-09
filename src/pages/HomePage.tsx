import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  FileText,
  Brain,
  BookOpen,
  ArrowRight,
  Sparkles,
  Scale,
  Zap,
  Target,
  TrendingUp,
} from 'lucide-react';
import { FadeIn } from '../components/FadeIn';
import { CASES } from '../data/cases';
import { SECTIONS } from '../data/sections';
import { MCQS } from '../data/mcqs';

const FEATURES = [
  {
    icon: MessageSquare,
    title: 'AI Law Tutor',
    description: 'Ask any legal question — sections, doctrines, case law. Get instant, plain-English answers grounded in Indian law.',
    color: 'from-brand-orange to-brand-magenta',
    href: '/tutor',
    badge: 'Powered by Gemini',
  },
  {
    icon: FileText,
    title: 'Case Summarizer',
    description: 'Paste any judgment. Get parties, facts, issues, ratio decidendi, and holding extracted in seconds.',
    color: 'from-brand-magenta to-brand-violet',
    href: '/summarizer',
    badge: 'Structured AI',
  },
  {
    icon: Brain,
    title: 'Practice Engine',
    description: 'CLAT-style MCQs + LLB topic quizzes. Get graded instantly with detailed explanations for every question.',
    color: 'from-brand-violet to-brand-indigo',
    href: '/practice',
    badge: `${MCQS.length} Questions`,
  },
  {
    icon: BookOpen,
    title: 'Law Library',
    description: 'Curated landmark Indian cases and key statutory provisions — searchable, summarized, and exam-ready.',
    color: 'from-brand-indigo to-accent-sky',
    href: '/library',
    badge: `${CASES.length} Cases · ${SECTIONS.length} Sections`,
  },
];

const STATS = [
  { value: CASES.length, suffix: '+', label: 'Landmark Cases' },
  { value: SECTIONS.length, suffix: '+', label: 'Key Sections' },
  { value: MCQS.length, suffix: '+', label: 'Practice MCQs' },
  { value: 4, suffix: '', label: 'AI-Powered Tools' },
];

export function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="absolute inset-0 bg-mesh opacity-60 pointer-events-none" />
        <div className="absolute top-20 -left-20 w-72 h-72 bg-brand-orange/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 -right-20 w-96 h-96 bg-brand-violet/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur border border-ink-900/10 mb-8">
              <Sparkles className="w-4 h-4 text-brand-violet" />
              <span className="text-sm font-medium text-ink-900/80">AI-powered legal learning</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-ink-900 leading-[1.05]">
              Learn law the way<br />
              <span className="text-gradient">it should be taught.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mt-8 text-lg md:text-xl text-ink-900/60 max-w-2xl mx-auto leading-relaxed">
              An AI-powered platform for LLB students and CLAT aspirants. Ask questions, summarize judgments, practice MCQs, and master landmark cases — all in one place.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/tutor" className="btn-primary inline-flex items-center gap-2">
                Start with AI Tutor <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/library" className="btn-ghost">
                Browse the Library
              </Link>
            </div>
          </FadeIn>

          {/* Stats */}
          <FadeIn delay={0.5}>
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="p-6 rounded-3xl glass card-pop"
                >
                  <div className="text-4xl md:text-5xl font-bold text-gradient">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="mt-2 text-sm text-ink-900/60 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="text-sm font-bold uppercase tracking-widest text-brand-violet">Four tools</span>
              <h2 className="mt-4 text-4xl md:text-6xl font-bold tracking-tight text-ink-900">
                Everything you need.<br />Nothing you don't.
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((feature, i) => (
              <FadeIn key={feature.title} delay={i * 0.1}>
                <Link
                  to={feature.href}
                  className="group block p-8 md:p-10 rounded-3xl bg-white border border-ink-900/5 card-pop h-full"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
                      <feature.icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-ink-900/5 text-ink-900/60">
                      {feature.badge}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-ink-900 mb-3">{feature.title}</h3>
                  <p className="text-ink-900/60 leading-relaxed">{feature.description}</p>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-900 group-hover:gap-3 transition-all">
                    Try it <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="relative py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <span className="text-sm font-bold uppercase tracking-widest text-brand-violet">Why LawLab</span>
              <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-ink-900 leading-tight">
                Built for the way law students actually study.
              </h2>
              <p className="mt-6 text-lg text-ink-900/60 leading-relaxed">
                Bare acts are dense. Casebooks are intimidating. Coaching is expensive. LawLab gives you a single, focused workspace — answer-first, exam-aware, and free.
              </p>
            </FadeIn>

            <div className="space-y-4">
              {[
                { icon: Zap, title: 'Instant Answers', text: 'Stop scrolling 60-page PDFs. Get the exact section, doctrine, or case principle in seconds.' },
                { icon: Target, title: 'Exam-Aware', text: 'Curated for LLB syllabus topics and CLAT-style legal reasoning. Built by people who write the kind of questions you face.' },
                { icon: TrendingUp, title: 'Track Your Practice', text: 'Topic-wise MCQ scoring shows you exactly where you\'re strong and where you need work.' },
                { icon: Scale, title: 'Real Indian Law', text: 'Landmark Indian cases, IPC sections, Constitution articles, CrPC procedure — not just generic global content.' },
              ].map((item, i) => (
                <FadeIn key={item.title} delay={i * 0.1}>
                  <div className="flex gap-4 p-6 rounded-2xl bg-white border border-ink-900/5 card-pop">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-brand-grad-soft flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-brand-violet" />
                    </div>
                    <div>
                      <h3 className="font-bold text-ink-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-ink-900/60 leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn>
            <div className="relative overflow-hidden p-12 md:p-20 rounded-[2.5rem] bg-brand-grad text-center">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
              <div className="relative">
                <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
                  Ready to stop<br />memorizing and start understanding?
                </h2>
                <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                  Free to use. No signup. No paywall. Just open it and start learning.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/tutor" className="px-8 py-4 rounded-full bg-white text-brand-violet font-bold hover:scale-105 transition-transform inline-flex items-center gap-2 justify-center">
                    Open AI Tutor <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/practice" className="px-8 py-4 rounded-full bg-white/10 text-white font-bold backdrop-blur border border-white/20 hover:bg-white/20 transition">
                    Try Practice MCQs
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
