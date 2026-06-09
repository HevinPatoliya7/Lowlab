import type { VercelRequest, VercelResponse } from '@vercel/node';

const SYSTEM_PROMPT = `You are LawLab Case Summarizer. Given a court judgment text (Indian, UK, or US common law), extract its essential elements into structured JSON.

Be accurate. If a field cannot be determined from the text, use an empty string or empty array. Do not fabricate.`;

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    caseName: { type: 'STRING', description: 'Full case name (e.g., "Maneka Gandhi v. Union of India")' },
    citation: { type: 'STRING', description: 'Citation if mentioned (e.g., "AIR 1978 SC 597")' },
    court: { type: 'STRING', description: 'Court name' },
    year: { type: 'STRING', description: 'Year of judgment' },
    bench: { type: 'STRING', description: 'Bench composition (e.g., "7-Judge Constitution Bench")' },
    parties: {
      type: 'OBJECT',
      properties: {
        petitioner: { type: 'STRING' },
        respondent: { type: 'STRING' },
      },
      required: ['petitioner', 'respondent'],
    },
    facts: { type: 'STRING', description: '2-4 sentence summary of the material facts' },
    issues: {
      type: 'ARRAY',
      items: { type: 'STRING' },
      description: '2-5 specific legal questions framed for decision',
    },
    holding: { type: 'STRING', description: 'The Court\'s answer / conclusion (1-2 sentences)' },
    ratio: { type: 'STRING', description: 'The legal reasoning forming the basis of the decision (2-4 sentences)' },
    significance: { type: 'STRING', description: 'Why this case matters for the development of law (1-3 sentences)' },
    keywords: {
      type: 'ARRAY',
      items: { type: 'STRING' },
      description: '4-8 keywords / doctrines covered (e.g., "basic structure", "article 21")',
    },
  },
  required: ['caseName', 'parties', 'facts', 'issues', 'holding', 'ratio', 'significance', 'keywords'],
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
  }

  const { judgment } = req.body as { judgment: string };
  if (!judgment || typeof judgment !== 'string' || judgment.trim().length < 50) {
    return res.status(400).json({ error: 'Provide a judgment text of at least 50 characters' });
  }

  const truncated = judgment.slice(0, 30000);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [
            {
              role: 'user',
              parts: [{ text: `Summarize this judgment into structured JSON:\n\n${truncated}` }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 8192,
            responseMimeType: 'application/json',
            responseSchema: RESPONSE_SCHEMA,
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
    const finishReason = data?.candidates?.[0]?.finishReason;

    if (!text) {
      console.error('Empty Gemini response. Finish reason:', finishReason, 'Data:', JSON.stringify(data));
      return res.status(500).json({ error: 'Empty response from Gemini', finishReason });
    }

    let parsed;
    try {
      const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('Parse error:', parseErr, 'Raw text:', text.slice(0, 500));
      return res.status(500).json({ error: 'Failed to parse Gemini JSON', raw: text.slice(0, 1000) });
    }

    return res.status(200).json(parsed);
  } catch (e) {
    console.error('Summarizer error:', e);
    return res.status(500).json({ error: 'Internal error', detail: String(e) });
  }
}
