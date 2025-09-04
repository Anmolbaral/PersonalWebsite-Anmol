import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';
import rateLimit from 'express-rate-limit';
import SheetsHelper from './sheets-helper';

// Context caching variables
let cachedContext = '';
let lastLoaded = 0;

// Initialize Google Sheets helper
const sheetsHelper = new SheetsHelper();

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting - Optimized for free tier usage
const chatLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // limit each IP to 5 requests per 5 minutes
  message: {
    error: 'Too many chat requests, please try again later.',
    retryAfter: 300
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const noteLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 1, // limit each IP to 1 note submission per 10 minutes
  message: {
    error: 'Too many note submissions, please try again later.',
    retryAfter: 600
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Serve static files from frontend public directory
app.use('/resume', express.static(path.join(__dirname, '../../frontend/public')));

// Context loading and caching functions
function loadContextSync() {
  const contextPath = path.join(__dirname, '..', 'context.md');
  return fs.readFileSync(contextPath, 'utf-8');
}

function getContext(): string {
  try {
    const contextPath = path.join(__dirname, '..', 'context.md');
    const stat = fs.statSync(contextPath);
    if (!cachedContext || stat.mtimeMs > lastLoaded) {
      cachedContext = loadContextSync();
      lastLoaded = stat.mtimeMs;
      console.log('Context file reloaded:', new Date().toISOString());
    }
    return cachedContext;
  } catch (error) {
    console.error('Error reading context file:', error);
    return 'Anmol Baruwal is a software developer with expertise in full-stack development and modern web technologies.';
  }
}

// Chat API endpoint
app.post('/api/chat', chatLimiter, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key is not configured' });
    }

    const systemPrompt = `You are Anmol Baruwal's personal AI assistant.
                          - Answer questions based on the provided CONTEXT.
                          - You can synthesize and combine information from the context to answer questions.
                          - You can infer logical conclusions from the provided information.
                          - If the answer cannot be reasonably derived from the context, say: "I don't have enough information to answer that question."
                          - NEVER invent details that are not supported by the context.
                          - Keep answers friendly, professional, and concise (2-5 sentences).
                          - If asked for his resume, reply with exactly: https://anmol-5831c.web.app/Resume-ANMOL_BARUWAL.pdf`
    const context = getContext();

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

    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ 
      error: 'An error occurred while processing your request.',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Resume endpoint - redirect to the hosted resume
app.get('/api/resume', (req, res) => {
  res.redirect('https://anmol-5831c.web.app/Resume-ANMOL_BARUWAL.pdf');
});

// Handle note submissions
app.post('/api/leave-note', noteLimiter, async (req, res) => {
  try {
    const { name, email, message, contactInfo } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }
    
    // Create note object with timestamp
    const note = {
      id: Date.now().toString(),
      name,
      email,
      message,
      contactInfo: contactInfo || '',
      timestamp: new Date().toISOString(),
      ip: req.ip || req.connection.remoteAddress || 'unknown'
    };
    
    // Log to Google Sheets
    const sheetsSuccess = await sheetsHelper.addNote(note);
    
    // Also log to console for debugging
    console.log('=== NEW NOTE RECEIVED ===');
    console.log('Name:', note.name);
    console.log('Email:', note.email);
    console.log('Message:', note.message);
    console.log('Contact Info:', note.contactInfo);
    console.log('Timestamp:', note.timestamp);
    console.log('IP:', note.ip);
    console.log('Google Sheets Logged:', sheetsSuccess);
    console.log('========================');
    
    res.status(200).json({ 
      success: true, 
      message: 'Note submitted successfully',
      noteId: note.id
    });
    
  } catch (error) {
    console.error('Error saving note:', error);
    res.status(500).json({ error: 'Failed to save note' });
  }
});

// Get all submitted notes (for admin purposes)
app.get('/api/notes', async (req, res) => {
  try {
    const notes = await sheetsHelper.getAllNotes();
    res.json(notes);
  } catch (error) {
    console.error('Error reading notes:', error);
    res.status(500).json({ error: 'Failed to read notes' });
  }
});

// Usage monitoring endpoint
app.get('/api/usage', async (req, res) => {
  try {
    const notes = await sheetsHelper.getAllNotes();
    const cacheStatus = sheetsHelper.getCacheStatus();
    const usage = {
      totalNotes: notes.length,
      cacheStatus: cacheStatus,
      serverUptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    };
    res.json(usage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get usage stats' });
  }
});

// Serve admin page
app.get('/admin', (req, res) => {
  const adminPath = path.join(__dirname, '../admin.html');
  res.sendFile(adminPath);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Chat API available at http://localhost:${PORT}/api/chat`);
  console.log(`Health check at http://localhost:${PORT}/api/health`);
  console.log(`Usage monitoring at http://localhost:${PORT}/api/usage`);
});
