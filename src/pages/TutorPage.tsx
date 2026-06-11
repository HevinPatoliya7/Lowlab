import { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, Loader2, MessageSquare, BookOpen, Scale, 
  FileText, Trash2, Terminal, Code2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Msg {
  role: 'user' | 'model';
  content: string;
  contextTags?: string[];
}

const SUGGESTIONS = [
  { icon: Scale, text: 'Explain Article 21 with landmark cases' },
  { icon: BookOpen, text: 'Difference between murder and culpable homicide' },
  { icon: FileText, text: 'What are the essentials of a valid contract?' },
  { icon: MessageSquare, text: 'Doctrine of basic structure in simple terms' },
];

const CONTEXT_PILLS = [
  { label: 'Constitution', icon: Scale },
  { label: 'IPC (Penal Code)', icon: BookOpen },
  { label: 'Landmark Cases', icon: FileText },
  { label: 'Bare Acts', icon: Terminal },
];

function renderMarkdown(text: string): string {
  let html = text;
  
  // Format code blocks: ```lang code ```
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)\n```/g;
  html = html.replace(codeBlockRegex, (_, lang, code) => {
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    // Create copy script safe string
    const safeCode = code
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\$/g, '\\$')
      .replace(/"/g, '&quot;');

    return `
      <div class="my-4 rounded-xl border border-ink-900/10 overflow-hidden bg-ink-800 text-white font-mono text-xs shadow-md">
        <div class="flex items-center justify-between px-4 py-2 bg-ink-900/80 border-b border-white/10 text-white/50 text-[10px] uppercase font-bold tracking-wider">
          <span>${lang || 'code'}</span>
          <button 
            onclick="navigator.clipboard.writeText(\`${safeCode}\`); this.textContent='Copied!'; setTimeout(() => this.textContent='Copy', 2000)"
            class="hover:text-white transition-colors cursor-pointer"
          >
            Copy
          </button>
        </div>
        <pre class="p-4 overflow-x-auto"><code>${escapedCode}</code></pre>
      </div>
    `;
  });

  // Format inline code
  html = html.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-ink-900/5 font-mono text-xs text-brand-violet">$1</code>');

  // Format headers
  html = html
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-bold mt-4 mb-2 text-ink-900">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold mt-5 mb-2 text-ink-900">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold mt-6 mb-3 text-ink-900">$1</h1>');

  // Format bold and italics
  html = html
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-ink-900">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Format lists
  html = html
    .replace(/^\* (.+)$/gm, '<li class="ml-5 list-disc mb-1 text-ink-900/80">$1</li>')
    .replace(/^- (.+)$/gm, '<li class="ml-5 list-disc mb-1 text-ink-900/80">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-5 list-decimal mb-1 text-ink-900/80">$2</li>');

  // Format paragraphs
  const paragraphs = html.split('\n\n');
  html = paragraphs
    .map((p) => {
      const trimmed = p.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('<div') || trimmed.startsWith('<h') || trimmed.startsWith('<li')) {
        return trimmed;
      }
      return `<p class="mb-3 leading-relaxed text-ink-900/80">${trimmed}</p>`;
    })
    .join('\n');

  return html;
}

export function TutorPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeModel, setActiveModel] = useState<'gemini-2.5-flash' | 'gemini-2.5-pro'>('gemini-2.5-flash');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const toggleTag = (tag: string) => {
    if (activeTags.includes(tag)) {
      setActiveTags(activeTags.filter(t => t !== tag));
    } else {
      setActiveTags([...activeTags, tag]);
    }
  };

  async function send(text: string, messagesOverride?: Msg[]) {
    if (!text.trim() || loading) return;
    setError(null);
    
    const contextTagPrefix = activeTags.length > 0 ? `[Context: ${activeTags.join(', ')}]\n` : '';
    const formattedContent = contextTagPrefix + text;

    const newMsgs: Msg[] = messagesOverride || [
      ...messages, 
      { role: 'user', content: formattedContent, contextTags: [...activeTags] }
    ];
    
    setMessages(newMsgs);
    setInput('');
    setActiveTags([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('GEMINI_API_KEY') || '';
      let replyText = '';

      if (apiKey) {
        // Direct call to Gemini API for local development or custom key override
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
          `https://generativelanguage.googleapis.com/v1beta/models/${activeModel}:generateContent?key=${apiKey}`,
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
        replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
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
        replyText = data.reply ?? '';
      }

      setMessages([...newMsgs, { role: 'model', content: replyText }]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="pt-24 pb-12 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-6 flex justify-between items-end">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-grad-soft mb-3">
              <Sparkles className="w-3.5 h-3.5 text-brand-violet" />
              <span className="text-xs font-bold uppercase tracking-wider text-brand-violet">AI Tutor</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-ink-900 tracking-tight">
              Ask anything <span className="text-gradient">about Indian law.</span>
            </h1>
          </div>
        </div>

        {/* Cursor AI styled panel */}
        <div className="rounded-3xl bg-white border border-ink-900/10 shadow-xl overflow-hidden flex flex-col relative" style={{ height: 'min(75vh, 750px)' }}>
          
          {/* Top Bar */}
          <div className="border-b border-ink-900/5 px-6 py-4 flex items-center justify-between bg-ink-900/[0.01]">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-xs font-medium text-emerald-700">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Live Chat
              </div>
              
              {/* Model Dropdown */}
              <div className="relative">
                <select 
                  value={activeModel}
                  onChange={(e) => setActiveModel(e.target.value as any)}
                  className="bg-ink-900/[0.04] text-xs font-semibold text-ink-900/70 border border-ink-900/5 rounded-full px-3 py-1 outline-none hover:bg-ink-900/10 transition-colors cursor-pointer appearance-none pr-6"
                >
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (Fast)</option>
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep)</option>
                </select>
                <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-ink-900/40 font-bold">&#9662;</div>
              </div>
            </div>

            {messages.length > 0 && (
              <button 
                onClick={clearChat}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-ink-900/40 hover:text-red-600 hover:bg-red-50 hover:border-red-100 border border-transparent transition-all"
                title="Clear Chat History"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto py-12">
                <div className="w-16 h-16 rounded-2xl bg-brand-grad flex items-center justify-center mb-4 shadow-lg shadow-brand-violet/20">
                  <Code2 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-ink-900 mb-2">Welcome to Cursor-AI Tutor</h3>
                <p className="text-ink-900/60 mb-6 text-sm">
                  A premium interactive terminal for exploring Indian law. Try one of the suggested topics or type your legal query below.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => send(s.text)}
                      className="p-4 rounded-2xl bg-ink-900/[0.02] hover:bg-brand-grad-soft border border-ink-900/5 text-left transition card-pop group"
                    >
                      <s.icon className="w-4 h-4 text-brand-violet mb-2" />
                      <p className="text-xs font-semibold text-ink-900/80 group-hover:text-ink-900">{s.text}</p>
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
                    className={`max-w-[90%] ${
                      msg.role === 'user'
                        ? 'bg-ink-900/90 text-white rounded-3xl px-5 py-4 shadow-sm border border-ink-900/5'
                        : 'text-ink-900 w-full'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <div>
                        {msg.contextTags && msg.contextTags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {msg.contextTags.map((tag) => (
                              <span key={tag} className="px-2 py-0.5 rounded-full bg-white/20 text-[9px] font-bold uppercase tracking-wider text-white/90">
                                @{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="whitespace-pre-wrap text-sm leading-relaxed font-sans">{msg.content.replace(/^\[Context: .+?\]\n/, '')}</p>
                      </div>
                    ) : (
                      <div className="flex gap-4 items-start w-full border-t border-ink-900/5 pt-6 mt-2 first:border-0 first:pt-0 first:mt-0">
                        {/* Logo avatar */}
                        <div className="w-8 h-8 rounded-lg bg-brand-grad flex items-center justify-center shrink-0 shadow-md">
                          <Scale className="w-4 h-4 text-white" />
                        </div>
                        {/* Model content */}
                        <div className="flex-1 overflow-hidden">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs font-bold text-ink-900">AI Tutor</span>
                            <span className="text-[10px] text-ink-900/40 font-semibold font-mono">@{activeModel}</span>
                          </div>
                          <div
                            className="prose prose-sm max-w-none leading-relaxed text-sm [&_li]:mb-1"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 items-start border-t border-ink-900/5 pt-6">
                <div className="w-8 h-8 rounded-lg bg-brand-grad flex items-center justify-center shrink-0 shadow-md">
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold text-ink-900">AI Tutor</span>
                    <span className="text-[10px] text-ink-900/40 font-semibold font-mono">thinking...</span>
                  </div>
                  <div className="bg-ink-900/[0.03] px-4 py-2 rounded-xl flex items-center gap-2">
                    <span className="text-xs text-ink-900/60 font-medium">Formulating grounded response...</span>
                  </div>
                </div>
              </motion.div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl text-sm space-y-3 animate-fade-in">
                <div className="font-semibold">{error}</div>
                {error.includes('GEMINI_API_KEY') && (
                  <div className="p-4 bg-white rounded-xl border border-red-100 space-y-3 text-left">
                    <p className="text-xs text-ink-900/60 leading-relaxed">
                      This deployment doesn't have a Google Gemini API Key configured. You can paste your own API key below to run AI features directly from your browser. It is stored securely only on your device.
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        placeholder="Paste AIzaSy... API key"
                        className="flex-1 px-4 py-2 text-xs rounded-xl bg-ink-900/[0.02] border border-ink-900/5 outline-none focus:ring-2 focus:ring-brand-violet/30 text-ink-900 placeholder:text-ink-900/40 font-mono"
                        id="tutor-api-key-input"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const inputVal = (document.getElementById('tutor-api-key-input') as HTMLInputElement)?.value.trim();
                          if (inputVal) {
                            localStorage.setItem('GEMINI_API_KEY', inputVal);
                            setError(null);
                            const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
                            if (lastUserMsg) {
                              send(lastUserMsg.content, messages);
                            }
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
          </div>

          {/* Cursor Input Bar Panel */}
          <div className="border-t border-ink-900/5 p-4 bg-ink-900/[0.01]">
            {/* Context Selectors */}
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              <span className="text-[10px] text-ink-900/40 font-bold uppercase tracking-wider flex items-center mr-1">
                Context:
              </span>
              {CONTEXT_PILLS.map((pill) => {
                const isActive = activeTags.includes(pill.label);
                return (
                  <button
                    key={pill.label}
                    onClick={() => toggleTag(pill.label)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                      isActive 
                        ? 'bg-brand-violet/15 text-brand-violet border-brand-violet/35' 
                        : 'bg-white text-ink-900/60 border-ink-900/10 hover:border-ink-900/20'
                    }`}
                  >
                    <pill.icon className="w-3 h-3" />
                    <span>@{pill.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Editor Input Container */}
            <div className="border border-ink-900/10 rounded-2xl bg-white shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-brand-violet/30 transition-all flex flex-col">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder="Ask AI tutor anything about Indian law, IPC, or sections..."
                className="w-full px-4 py-3 bg-transparent outline-none text-ink-900 placeholder:text-ink-900/35 text-sm resize-none min-h-[60px] font-sans leading-relaxed"
                disabled={loading}
              />
              
              <div className="flex items-center justify-between border-t border-ink-900/5 px-4 py-2 bg-ink-900/[0.01] text-xs text-ink-900/40">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] flex items-center gap-1 bg-ink-900/[0.04] px-2 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 bg-brand-violet rounded-full" />
                    {activeModel}
                  </span>
                  <span>Enter to send, Shift + Enter for newline</span>
                </div>
                
                <button
                  onClick={() => send(input)}
                  disabled={loading || !input.trim()}
                  className="px-3.5 py-1.5 rounded-lg bg-ink-900 hover:bg-brand-violet text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-30 disabled:hover:bg-ink-900 transition-all cursor-pointer shadow-sm"
                >
                  <span>Chat</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs text-center text-ink-900/40">
          AI can occasionally make mistakes. Verify important citations against bare acts and SCC.
        </p>
      </div>
    </div>
  );
}
