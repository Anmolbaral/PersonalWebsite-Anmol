import type { VercelRequest, VercelResponse } from '@vercel/node';

// Redirect to hosted resume PDF
export default function handler(req: VercelRequest, res: VercelResponse) {
  res.redirect(307, '/AnmolBaruwal__Resume.pdf');
}
