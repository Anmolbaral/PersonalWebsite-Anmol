import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { check_rate_limit } from './utils/rate-limit.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get client IP for rate limiting
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
                   (req.headers['x-real-ip'] as string) || 
                   'unknown';

  // Apply rate limiting: 1 note per 10 minutes
  if (!check_rate_limit(clientIp, 1, 10 * 60 * 1000)) {
    return res.status(429).json({
      error: 'Too many note submissions, please try again later.',
      retryAfter: 600
    });
  }

  try {
    const { name, email, message, contactInfo } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Check environment variables
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      return res.status(500).json({ error: 'Database configuration missing' });
    }

    // Initialize Supabase client with service key for server-side operations
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // Create note object
    const noteData = {
      id: Date.now().toString(),
      name,
      email,
      message,
      contact_info: contactInfo || '',
      ip_address: clientIp,
    };

    // Insert into Supabase
    const { error } = await supabase
      .from('notes')
      .insert([noteData]);

    if (error) {
      console.error('Error saving note to Supabase:', error);
      return res.status(500).json({ error: 'Failed to save note' });
    }

    console.log('=== NEW NOTE RECEIVED ===');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('IP:', clientIp);
    console.log('========================');

    return res.status(200).json({
      success: true,
      message: 'Note submitted successfully',
      noteId: noteData.id
    });
  } catch (error) {
    console.error('Error in leave-note endpoint:', error);
    return res.status(500).json({
      error: 'An error occurred while processing your request.',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
