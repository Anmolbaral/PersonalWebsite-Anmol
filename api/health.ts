import type { VercelRequest, VercelResponse } from '@vercel/node';

// Health check endpoint
export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Anmol Portfolio API'
  });
}
