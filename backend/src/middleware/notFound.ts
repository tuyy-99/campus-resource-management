import { Request, Response } from 'express';

/**
 * Catch-all for unmatched API routes. Returns JSON 404 so clients get a consistent response.
 */
export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ error: 'Not found' });
}
