import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, MessageSquare, BookOpen, Scale, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Msg {
  role: 'user' | 'model';
  content: string;
}

const SUGGESTIONS = [
  { icon: Scale, text: 'Explain Article 21 with landmark cases' },
  { icon: BookOpen, text: 'Difference between murder and culpable homicide' },
  { icon: FileText, text: 'What are the essentials of a valid contract?' },
  { icon: MessageSquare, text: 'Doctrine of basic structure in simple terms' },
];

function renderMarkdown(text: string): string {
  return text
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-bold mt-4 mb-2 text-ink-900">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold mt-5 mb-2 text-ink-900">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-ink-900">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^\* (.+)$/gm, '<li class="ml-5 list-disc">$1</li>')
    .replace(/^- (.+)$/gm, '<li class="ml-5 list-disc">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-5 list-decimal">$2</li>')
    .replace(/\n\n/g, '</p><p class="mb-3">')
    .replace(/^/, '<p class="mb-3">')
    .replace(/$/, '</p>');
}

export function TutorPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    setError(null);
    const newMsgs: Msg[] = [...messages, { role: 'user', content: text }];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);

    try {
      const isDev = import.meta.env.DEV;
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      let text = '';

      if (isDev && apiKey) {
        // Direct call to Gemini API for local development convenience
        const SYSTEM_PROMPT = `You are LawLab AI Tutor — an expert in Indian law helping LLB students and CLAT aspirants.

Your style:
- Answer in clear, plain English (avoid Latin unless necessary, and define it when used)
- Structure answers with short paragraphs, bullet points, or numbered lists
- Always cite the relevant section, article, or case name where applicable
- For Indian law: reference IPC, CrPC, CPC, Constitution, Contract Act, Evidence Act, etc.
- Cite landmark Supreme Court / Privy Council judgments when relevant
- If asked about something outside law, politely redirect to legal topics
- If unsure about a case citation or section, say so — never fabricate

Format: Use markdown for structure (## headers, **bold**, lists, etc).
Keep responses focused — aim for 200-500 words unless the user asks for more depth.`;

        const contents = newMsgs.map((m) => ({
          role: m.role,
          parts: [{ text: m.content }],
        }));

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
              contents,
              generationConfig: { temperature: 0.3, maxOutputTokens: 2048 },
            }),
          }
        );
        
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error?.message || 'Gemini API Error');
        }
        text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      } else {
        // Secure call to Vercel Serverless Function in production
        const res = await fetch('/api/tutor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: newMsgs }),
        });
        
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'API Error');
        }
        text = data.reply ?? '';
      }

      setMessages([...newMsgs, { role: 'model', content: text }]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-24 pb-12 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-grad-soft mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-violet" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-violet">AI Tutor</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-ink-900 tracking-tight">
            Ask anything <span className="text-gradient">about Indian law.</span>
          </h1>
          <p className="mt-3 text-ink-900/60">
            Get plain-English answers grounded in actual sections, articles, and landmark judgments.
          </p>
        </div>

        {/* Chat container */}
        <div className="rounded-3xl bg-white border border-ink-900/5 shadow-lg overflow-hidden flex flex-col" style={{ height: 'min(70vh, 700px)' }}>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-brand-grad flex items-center justify-center mb-4">
                  <MessageSquare className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-ink-900 mb-2">Ready when you are</h3>
                <p className="text-ink-900/60 mb-6 max-w-md">Try one of these or type your own question</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full">
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => send(s.text)}
                      className="p-4 rounded-2xl bg-ink-900/[0.02] hover:bg-brand-grad-soft border border-ink-900/5 text-left transition group"
                    >
                      <s.icon className="w-4 h-4 text-brand-violet mb-2" />
                      <p className="text-sm font-medium text-ink-900/80 group-hover:text-ink-900">{s.text}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-5 py-4 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-brand-grad text-white rounded-br-md'
                        : 'bg-ink-900/[0.03] text-ink-900 rounded-bl-md'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div
                        className="prose prose-sm max-w-none leading-relaxed [&_li]:mb-1"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                      />
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-ink-900/[0.03] px-5 py-4 rounded-2xl rounded-bl-md flex items-center gap-3">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-violet" />
                  <span className="text-sm text-ink-900/60">Thinking...</span>
                </div>
              </motion.div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-ink-900/5 p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex gap-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about a section, doctrine, or case..."
                className="flex-1 px-5 py-3 rounded-full bg-ink-900/[0.03] border border-ink-900/5 outline-none focus:ring-2 focus:ring-brand-violet/30 text-ink-900 placeholder:text-ink-900/40"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-12 h-12 rounded-full bg-brand-grad flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 transition-transform"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        <p className="mt-4 text-xs text-center text-ink-900/40">
          AI can occasionally make mistakes. Verify important citations against bare acts and SCC.
        </p>
      </div>
    </div>
  );
}
