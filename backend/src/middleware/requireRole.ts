import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { IUser } from '../models/User';

export function requireRole(...allowedRoles: IUser['role'][]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Authentication required', 401));
      return;
    }
    if (!allowedRoles.includes(req.user.role)) {
      next(new AppError('Insufficient permissions', 403));
      return;
    }
    next();
  };
}
