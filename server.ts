import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { generateRuleBasedComment } from './src/utils/fallbackGenerator';
import { StudentInput, GeneratedCommentResponse } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// The dev server must bind to port 3000 (ignore outer container PORT=8080)
const port = 3000;

app.use(express.json({ limit: '20mb' }));

// Shared server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;
const hasValidApiKey = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 10);

let ai: GoogleGenAI | null = null;
if (hasValidApiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey!,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function generateCommentWithGemini(student: StudentInput): Promise<GeneratedCommentResponse> {
  if (!ai || !hasValidApiKey) {
    return generateRuleBasedComment(student);
  }

  const toneGuides: Record<string, string> = {
    encouraging: 'Warm, highly encouraging, empathetic, fostering self-confidence, praising effort and growth mindset.',
    academic: 'Formal, academic, objective, competency-based, precise linguistic evaluation.',
    constructive: 'Growth-oriented, direct yet polite, pinpointing improvement areas with clear practical next steps.',
    enthusiastic: 'High energy, celebratory, exclamation-friendly, motivating for lively learners.',
    diplomatic: 'Respectful, balanced, thoughtful for parent reports, appreciative of family partnership.',
    concise: 'Punchy, succinct, 2-3 essential sentences without fluff.'
  };

  const selectedToneGuide = toneGuides[student.tone] || toneGuides.encouraging;

  const prompt = `
Generate an individual English student report card comment and tailored performance feedback based on the following student details:

- Student Name: "${student.name}"
- Pronoun Preference: "${student.pronoun || 'neutral'}"
- Grade/Level: "${student.gradeLevel || 'middle'}"
- English Keywords to incorporate naturally: ${JSON.stringify(student.keywords)}
- Tone & Manner: "${student.tone}" (${selectedToneGuide})
- Desired Length: "${student.length || 'medium'}" (short: 2 sentences, medium: 3-4 sentences, detailed: 4-6 sentences full report)
- Homework Status / Submission: "${student.homeworkStatus}" (Rate: ${student.homeworkRate ?? 'N/A'}%, Note: ${student.homeworkNote || 'None'})
- Vocabulary Test Score: ${student.vocabScore} / 100 (Note: ${student.vocabNote || 'None'})
${student.customNote ? `- Teacher's Special Request / Context: "${student.customNote}"` : ''}

Key Pedagogical Instructions:
1. Seamlessly integrate the keywords into natural, flowing English sentences. Do NOT list the keywords like a machine; weave them into vivid observations of ${student.name}'s learning behavior.
2. Directly acknowledge both Homework consistency and Vocabulary test performance. If scores are high, praise diligence. If low or inconsistent, provide warm or constructive advice without being overly punitive.
3. Provide 2 fresh alternative variations for the overall comment so the teacher can pick the most fitting nuance.
4. Provide a natural, elegant Korean summary/translation that the teacher can send directly to Korean parents.
`;

  try {
    const geminiCall = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are a master bilingual ESL/EFL English educator and academy curriculum director. You write natural, native-level, grammatically pristine student report comments. You understand Korean EFL contexts (vocabulary tests, workbook homework, speaking confidence, grammar accuracy) and communicate with educational professionalism.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallComment: {
              type: Type.STRING,
              description: 'The primary polished English comment paragraph tailored to name, tone, and keywords.'
            },
            homeworkFeedback: {
              type: Type.STRING,
              description: '1-2 specific sentences evaluating homework completion and study habits.'
            },
            vocabFeedback: {
              type: Type.STRING,
              description: '1-2 specific sentences evaluating vocabulary test score, memorization, and word usage.'
            },
            actionableGoals: {
              type: Type.STRING,
              description: 'Concise recommendation or goal for the upcoming month.'
            },
            koreanSummary: {
              type: Type.STRING,
              description: 'Polite, natural Korean translation and report summary for parents.'
            },
            alternativePhrasings: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '2 distinct alternative phrasing variations for the overall comment.'
            }
          },
          required: ['overallComment', 'homeworkFeedback', 'vocabFeedback', 'actionableGoals', 'koreanSummary']
        }
      }
    });

    // 8-second safety timeout
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API timeout')), 8000)
    );

    const response = await Promise.race([geminiCall, timeoutPromise]);
    const text = response.text;
    if (text) {
      const parsed = JSON.parse(text);
      return {
        overallComment: parsed.overallComment || '',
        homeworkFeedback: parsed.homeworkFeedback || '',
        vocabFeedback: parsed.vocabFeedback || '',
        actionableGoals: parsed.actionableGoals || '',
        koreanSummary: parsed.koreanSummary || '',
        alternativePhrasings: parsed.alternativePhrasings || []
      };
    }
    return generateRuleBasedComment(student);
  } catch (err: any) {
    console.error('Gemini generation error, falling back to rule-based generator:', err?.message || err);
    return generateRuleBasedComment(student);
  }
}

// Single student generation route
app.post('/api/generate-comment', async (req: Request, res: Response) => {
  try {
    const student: StudentInput = req.body;
    if (!student || !student.name) {
      return res.status(400).json({ error: 'Student name is required' });
    }

    const result = await generateCommentWithGemini(student);
    return res.json({ success: true, data: result });
  } catch (err: any) {
    console.error('Route error:', err);
    return res.status(500).json({ error: err?.message || 'Server generation error' });
  }
});

// Batch generation route
app.post('/api/batch-generate', async (req: Request, res: Response) => {
  try {
    const { students, defaultTone, defaultLength } = req.body;
    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ error: 'Students array is required' });
    }

    const results = [];
    for (const item of students) {
      const kwArray = typeof item.keywords === 'string'
        ? item.keywords.split(',').map((s: string) => s.trim()).filter(Boolean)
        : (item.keywords || []);

      let hwStatus: any = 'good';
      const hwStr = String(item.homeworkStatus || '').toLowerCase();
      if (hwStr.includes('100') || hwStr.includes('완벽') || hwStr.includes('perfect')) {
        hwStatus = 'perfect';
      } else if (hwStr.includes('미흡') || hwStr.includes('지각') || hwStr.includes('50') || hwStr.includes('60') || hwStr.includes('late')) {
        hwStatus = 'inconsistent';
      } else if (hwStr.includes('미제출') || hwStr.includes('poor') || hwStr.includes('missing')) {
        hwStatus = 'poor';
      }

      const input: StudentInput = {
        name: item.name,
        keywords: kwArray.length > 0 ? kwArray : ['active participation', 'diligent effort'],
        homeworkStatus: hwStatus,
        vocabScore: Number(item.vocabScore) || 80,
        tone: (item.tone as any) || defaultTone || 'encouraging',
        length: defaultLength || 'medium',
        gradeLevel: 'middle'
      };

      const gen = await generateCommentWithGemini(input);
      results.push({
        id: item.id,
        name: item.name,
        result: gen
      });
    }

    return res.json({ success: true, data: results });
  } catch (err: any) {
    console.error('Batch route error:', err);
    return res.status(500).json({ error: err?.message || 'Batch generation error' });
  }
});

// Health / Status check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: hasValidApiKey,
    model: 'gemini-3.8-flash'
  });
});

// Mount Vite in dev mode or serve static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`EduComment AI server listening on port ${port}`);
  });
}

startServer();
