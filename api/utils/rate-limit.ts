// Shared rate limiting utility for API routes

// Rate limiting store (in-memory, resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Check rate limit for IP address
export function check_rate_limit(ip: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const rateLimit = rateLimitMap.get(ip);

  if (!rateLimit || now > rateLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (rateLimit.count >= maxRequests) {
    return false;
  }

  rateLimit.count++;
  return true;
}
