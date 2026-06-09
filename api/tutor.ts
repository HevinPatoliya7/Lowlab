import type { VercelRequest, VercelResponse } from '@vercel/node';

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

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
  }

  const { messages } = req.body as { messages: ChatMessage[] };
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array required' });
  }

  try {
    const contents = messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error:', errText);
      return res.status(response.status).json({ error: 'Gemini API error', detail: errText });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    if (!text) {
      console.error('Empty Gemini response:', JSON.stringify(data));
      return res.status(500).json({ error: 'Empty response from Gemini' });
    }

    return res.status(200).json({ reply: text });
  } catch (e) {
    console.error('Tutor handler error:', e);
    return res.status(500).json({ error: 'Internal error', detail: String(e) });
  }
}
