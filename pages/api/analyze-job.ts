import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

type AnalyzeJobRequestBody = {
  jobDescription: string;
};

type AnalyzeJobResponseBody = { skills: string[] } | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AnalyzeJobResponseBody>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res
      .status(500)
      .json({ error: 'Gemini API key is not configured on the server' });
  }

  const { jobDescription } = req.body as AnalyzeJobRequestBody;

  if (!jobDescription || typeof jobDescription !== 'string') {
    return res
      .status(400)
      .json({ error: 'jobDescription is required and must be a string' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName =
      process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite-preview';
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 256,
      },
    });

    const prompt = `You are helping a job seeker quickly understand the key technical skills required for a role.

Job description:
${jobDescription}

Task: Identify the top 3 technical skills needed for this role.

Reply in this exact JSON format (no extra text):
{"skills":["Skill 1","Skill 2","Skill 3"]}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    let skills: string[] = [];

    try {
      const parsed = JSON.parse(text) as { skills?: unknown };
      if (Array.isArray(parsed.skills)) {
        skills = parsed.skills
          .map((s) => String(s).trim())
          .filter((s) => s.length > 0);
      }
    } catch {
      skills = text
        .split(/\n|,/)
        .map((s) => s.replace(/^[-*0-9.\s]+/, '').trim())
        .filter((s) => s.length > 0)
        .slice(0, 3);
    }

    if (skills.length === 0) {
      return res.status(500).json({
        error: 'Could not extract skills from Gemini response',
      });
    }

    return res.status(200).json({ skills });
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : 'Unexpected error occurred',
    });
  }
}

