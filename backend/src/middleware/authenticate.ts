import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { verifyToken, COOKIE_NAME } from '../utils/jwt';

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    next(new AppError('Authentication required', 401));
    return;
  }
  try {
    const payload = verifyToken(token);
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401));
  }
}
