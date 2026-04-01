import type { NextApiRequest, NextApiResponse } from 'next';

type AnalyzeSkillsRequestBody = {
  jobDescription: string;
};

type AnalyzeSkillsResponseBody =
  | { skills: string[] }
  | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AnalyzeSkillsResponseBody>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res
      .status(500)
      .json({ error: 'Anthropic API key is not configured on the server' });
  }

  const { jobDescription } = req.body as AnalyzeSkillsRequestBody;

  if (!jobDescription || typeof jobDescription !== 'string') {
    return res
      .status(400)
      .json({ error: 'jobDescription is required and must be a string' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 256,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `You are helping a job seeker quickly understand the key technical skills required for a role.

Job description:
${jobDescription}

Task: Identify the top 3 technical skills needed for this role.

Reply in this exact JSON format (no extra text):
{"skills":["Skill 1","Skill 2","Skill 3"]}`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(500).json({
        error: `Anthropic API error: ${response.status} ${response.statusText} - ${errorText}`,
      });
    }

    const data = (await response.json()) as {
      content?: { text?: string }[];
    };

    const text = data.content?.[0]?.text ?? '';

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
        error: 'Could not extract skills from Anthropic response',
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

