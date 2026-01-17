import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import { readFileSync } from 'fs';
import { join } from 'path';
import { check_rate_limit } from './utils/rate-limit.js';

// Context cache to avoid reading file on every request
let cachedContext: { content: string; timestamp: number } | null = null;
const CONTEXT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Load context from file with caching
function load_context(): string {
  const now = Date.now();
  
  // Return cached context if still valid
  if (cachedContext && (now - cachedContext.timestamp) < CONTEXT_CACHE_TTL) {
    return cachedContext.content;
  }
  
  try {
    // Try multiple possible paths for Vercel deployment
    const possiblePaths = [
      join(process.cwd(), 'public', 'context.md'),
      join(process.cwd(), '..', 'public', 'context.md'),
    ];
    
    for (const contextPath of possiblePaths) {
      try {
        const content = readFileSync(contextPath, 'utf-8');
        // Cache the content with current timestamp
        cachedContext = {
          content,
          timestamp: now
        };
        return content;
      } catch {
        continue;
      }
    }
    
    throw new Error('Context file not found in any expected location');
  } catch (error) {
    console.error('Error reading context file:', error);
    const fallback = 'Anmol Baruwal is a software developer with expertise in full-stack development and modern web technologies.';
    // Cache fallback to avoid repeated errors
    cachedContext = {
      content: fallback,
      timestamp: now
    };
    return fallback;
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
                          - If asked for his resume, reply with exactly: https://anmolbaruwal.vercel.app/AnmolBaruwal__Resume.pdf
                          
                          FORMATTING GUIDELINES:
                          - Use rich markdown formatting to make responses visually appealing and easy to read.
                          - For projects: Use ## for project name, bullet points with - for features, **bold** for key terms, and emoji where appropriate (🚀 for projects, ⚡ for tech, 🎯 for achievements).
                          - For work experience: Use ## for company name, **bold** for role and duration, bullet points for achievements.
                          - Use code blocks with language tags for technical details when relevant.
                          - Structure information with clear headings, lists, and emphasis.
                          - Make responses engaging and scannable with proper spacing and formatting.`;
    
    const context = load_context();

    // Set up Server-Sent Events for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Create timeout for OpenAI API call (60 seconds)
    const timeoutMs = 60000;
    let timeoutFired = false;
    const timeoutId = setTimeout(() => {
      timeoutFired = true;
      res.write(`data: ${JSON.stringify({ error: 'Request timeout. The response took too long. Please try again with a shorter question.' })}\n\n`);
      res.end();
    }, timeoutMs);

    try {
      const stream = await openai.chat.completions.create({
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
        max_tokens: 800,
        temperature: 0.3,
        stream: true,
      });

      // Stream tokens as they arrive
      for await (const chunk of stream) {
        if (timeoutFired) break;
        
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      if (!timeoutFired) {
        // Send completion signal
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        clearTimeout(timeoutId);
        res.end();
      }
    } catch (error) {
      if (!timeoutFired) {
        clearTimeout(timeoutId);
        console.error('Error in streaming:', error);
        
        let errorMessage = 'An error occurred while processing your request.';
        if (error instanceof Error) {
          if (error.message.includes('rate limit') || error.message.includes('429')) {
            errorMessage = 'OpenAI API rate limit exceeded. Please try again in a moment.';
          } else if (error.message.includes('timeout')) {
            errorMessage = 'Request timeout. Please try again with a shorter question.';
          } else if (error.message.includes('API key')) {
            errorMessage = 'API configuration error. Please contact support.';
          }
        }
        
        res.write(`data: ${JSON.stringify({ 
          error: errorMessage,
          details: error instanceof Error ? error.message : 'Unknown error'
        })}\n\n`);
        res.end();
      }
    }
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    
    // If response headers haven't been sent, send JSON error
    if (!res.headersSent) {
      return res.status(500).json({
        error: 'An error occurred while processing your request.',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    } else {
      // If streaming has started, send error via SSE
      res.write(`data: ${JSON.stringify({ 
        error: 'An error occurred while processing your request.',
        details: error instanceof Error ? error.message : 'Unknown error'
      })}\n\n`);
      res.end();
    }
  }
}
