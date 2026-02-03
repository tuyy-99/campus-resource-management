import { Request, Response, NextFunction } from 'express';
import { validationResult, body } from 'express-validator';
import { User } from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { signToken, getCookieOptions, COOKIE_NAME } from '../utils/jwt';

const sanitizeUser = (user: InstanceType<typeof User>) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
});

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').trim().isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),
];

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array().map((e) => e.msg).join('; '), 400);
    }
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      throw new AppError('Email already registered', 409);
    }
    const user = await User.create({ name, email, password, role: 'USER' });
    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });
    res.cookie(COOKIE_NAME, token, getCookieOptions());
    res.status(201).json({ user: sanitizeUser(user) });
  } catch (e) {
    next(e);
  }
}

export const loginValidation = [
  body('email').trim().isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError('Invalid email or password', 400);
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }
    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });
    res.cookie(COOKIE_NAME, token, getCookieOptions());
    res.json({ user: sanitizeUser(user) });
  } catch (e) {
    next(e);
  }
}

export async function logout(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    res.json({ message: 'Logged out' });
  } catch (e) {
    next(e);
  }
}

export async function me(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    res.json({ user: sanitizeUser(user) });
  } catch (e) {
    next(e);
  }
}
