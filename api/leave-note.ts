import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { check_rate_limit } from './utils/rate-limit.js';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
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

    // Send copy to your inbox if Resend is configured
    const resendKey = process.env.RESEND_API_KEY;
    const notifyEmail = process.env.NOTIFY_EMAIL;
    if (resendKey && notifyEmail) {
      try {
        const resend = new Resend(resendKey);
        const from = process.env.NOTIFY_FROM || 'Portfolio <onboarding@resend.dev>';
        const { error: emailError } = await resend.emails.send({
          from,
          to: notifyEmail,
          subject: `New note from ${name} (${email})`,
          html: `
            <h2>New note from your portfolio</h2>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            ${contactInfo ? `<p><strong>Extra contact:</strong> ${escapeHtml(contactInfo)}</p>` : ''}
            <p><strong>Message:</strong></p>
            <pre style="white-space:pre-wrap;font-family:inherit;background:#f4f4f4;padding:12px;border-radius:8px;">${escapeHtml(message)}</pre>
            <p style="color:#666;font-size:12px;">IP: ${escapeHtml(clientIp)} · Note ID: ${noteData.id}</p>
          `,
        });
        if (emailError) {
          console.error('Resend email error:', emailError);
        }
      } catch (emailErr) {
        console.error('Failed to send notification email:', emailErr);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Note submitted successfully',
      noteId: noteData.id
    });
  } catch (error) {
    console.error('Error in leave-note endpoint:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    const isUnreachable = /ENOTFOUND|fetch failed|ECONNREFUSED|ETIMEDOUT/i.test(message);
    return res.status(500).json({
      error: isUnreachable
        ? 'Database is temporarily unreachable. If you use Supabase free tier, check the dashboard — the project may be paused and need restoring.'
        : 'An error occurred while processing your request.',
      details: process.env.NODE_ENV === 'development' ? message : undefined
    });
  }
}
