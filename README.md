# LawLab

> AI-powered legal e-learning platform for LLB students and CLAT aspirants.

Live demo: _(deploy and update this URL)_

LawLab is a single, focused workspace for studying Indian law. It combines an AI tutor, a case-judgment summarizer, a practice-MCQ engine, and a curated library of landmark cases and statutory sections — all in one place, free to use, no signup.

## Features

| Tool | What it does | How it works |
|---|---|---|
| **AI Law Tutor** | Conversational AI that answers any question about Indian law in plain English, with citations to sections, articles, and landmark cases | Google Gemini 2.5 Flash via a Vercel serverless function |
| **Case Summarizer** | Paste any court judgment; extracts parties, facts, issues, holding, ratio decidendi, significance, and keywords as structured cards | Gemini 2.5 Flash with `responseSchema` for structured JSON output |
| **Practice Engine** | 40 hand-curated MCQs across Constitutional Law, Criminal Law, Contract Law, Tort Law, CrPC, and CLAT-style Legal Reasoning. Pick a topic → 10 randomized questions → instant grading with explanations | Hardcoded TypeScript dataset, shuffled per session |
| **Law Library** | 15 landmark Indian and common-law cases + 20 key sections (Constitution, IPC, CrPC, Contract Act, Evidence Act), searchable and category-filterable | Hardcoded structured TypeScript, full-text search across name/citation/keywords |

## Tech Stack

- **Framework:** React 18 + TypeScript + Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS v3 with custom brand gradients (orange → magenta → violet)
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **AI:** Google Gemini 2.5 Flash via REST
- **Backend:** Vercel Serverless Functions (`/api/tutor`, `/api/summarize`)
- **Deployment:** Vercel

## Run Locally

```bash
npm install
cp .env.example .env       # add your Gemini key
npx vercel dev             # runs frontend + serverless APIs together
```

For the AI Tutor and Summarizer to work, use `vercel dev` (not `npm run dev`) — the serverless functions in `/api` only run in the Vercel runtime.

## Deploy to Vercel

1. Push to a GitHub repo
2. Import the repo in [vercel.com/new](https://vercel.com/new)
3. In **Settings → Environment Variables**, add `GEMINI_API_KEY` with your key
4. Deploy

Vercel auto-detects Vite and the `api/` folder. No build configuration needed.

## Content Coverage

**Cases (15):** Kesavananda Bharati, Maneka Gandhi, Puttaswamy, Vishaka, Shreya Singhal, Navtej Johar, M.C. Mehta (Oleum), Olga Tellis, Minerva Mills, Indra Sawhney, Mohori Bibee, Carlill, Donoghue v. Stevenson, Romesh Thappar, Bachan Singh.

**Sections (20):** Articles 14, 15, 16, 19, 21, 32, 226 of the Constitution; IPC §§ 302, 304, 375, 420, 498A, 124A; CrPC §§ 41, 154, 164, 438; Contract Act §§ 10, 23; Evidence Act § 25.

**MCQs (40):** Constitutional Law (10), Criminal Law (8), Contract Law (7), Tort Law (5), CrPC (5), Legal Reasoning CLAT-style (5). Mix of Easy / Medium / Hard difficulty.

## Disclaimer

LawLab is for educational purposes only. It is not legal advice. AI-generated responses can contain errors — always verify citations against bare acts and authoritative reporters (SCC, AIR) before relying on them. For specific legal matters, consult a qualified advocate.

## Dev by

**Hevin Patoliya**

- GitHub: [@HevinPatoliya7](https://github.com/HevinPatoliya7)
- LinkedIn: [hevinpatoliya](https://www.linkedin.com/in/hevinpatoliya)
- Email: hevinpatoliya@gmail.com
