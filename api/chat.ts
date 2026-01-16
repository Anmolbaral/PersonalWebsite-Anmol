import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import { readFileSync } from 'fs';
import { join } from 'path';
import { check_rate_limit } from './utils/rate-limit.js';

// Load context from file
function load_context(): string {
  try {
    // Try multiple possible paths for Vercel deployment
    const possiblePaths = [
      join(process.cwd(), 'public', 'context.md'),
      join(process.cwd(), '..', 'public', 'context.md'),
    ];
    
    for (const contextPath of possiblePaths) {
      try {
        return readFileSync(contextPath, 'utf-8');
      } catch {
        continue;
      }
    }
    
    throw new Error('Context file not found in any expected location');
  } catch (error) {
    console.error('Error reading context file:', error);
    return 'Anmol Baruwal is a software developer with expertise in full-stack development and modern web technologies.';
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get client IP for rate limiting
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
                   (req.headers['x-real-ip'] as string) || 
                   'unknown';

  // Apply rate limiting: 5 requests per 5 minutes
  if (!check_rate_limit(clientIp, 5, 5 * 60 * 1000)) {
    return res.status(429).json({
      error: 'Too many chat requests, please try again later.',
      retryAfter: 300
    });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key is not configured' });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const systemPrompt = `You are Anmol Baruwal's personal AI assistant.
                          - Answer questions based on the provided CONTEXT.
                          - You can synthesize and combine information from the context to answer questions.
                          - You can infer logical conclusions from the provided information.
                          - If the answer cannot be reasonably derived from the context, say: "I don't have enough information to answer that question."
                          - NEVER invent details that are not supported by the context.
                          - Keep answers friendly, professional, and concise (2-5 sentences).
                          - If asked for his resume, reply with exactly: https://yourvercelapp.vercel.app/AnmolBaruwal__Resume.pdf`;
    
    const context = load_context();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `CONTEXT: ###\n${context}\n###\n\nQUESTION: "${message}"`
        }
      ],
      max_tokens: 500,
      temperature: 0.2,
    });

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    return res.status(200).json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    return res.status(500).json({
      error: 'An error occurred while processing your request.',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
