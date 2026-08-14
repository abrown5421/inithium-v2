import { Request, Response, NextFunction, RequestHandler } from 'express';

export interface RateLimitOptions {
  readonly windowMs: number;
  readonly maxRequests: number;
}

/**
 * In-memory, single-process sliding-window limiter for the public error-log ingest endpoint.
 * Not safe across multiple api instances behind a load balancer — acceptable for the current
 * single-instance deployment, but would need a shared store (e.g. Redis) to scale out.
 */
export const createIngestRateLimit = (options: RateLimitOptions): RequestHandler => {
  const requestTimestampsByIp = new Map<string, number[]>();

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip ?? 'unknown';
    const now = Date.now();
    const windowStart = now - options.windowMs;

    const recentTimestamps = (requestTimestampsByIp.get(ip) ?? []).filter((timestamp) => timestamp > windowStart);

    if (recentTimestamps.length >= options.maxRequests) {
      res.status(429).json({
        success: false,
        error: { type: 'VALIDATION_ERROR', message: 'Too many error reports, please slow down' }
      });
      return;
    }

    recentTimestamps.push(now);
    requestTimestampsByIp.set(ip, recentTimestamps);
    next();
  };
};
