import { Request, Response, NextFunction } from 'express';
import { validationResult, body, param } from 'express-validator';
import { Request as RequestModel } from '../models/Request';
import { Resource } from '../models/Resource';
import { AppError } from '../middleware/errorHandler';
import mongoose from 'mongoose';

function isOwner(req: Request, requestDoc: { userId: mongoose.Types.ObjectId }) {
  return req.user && requestDoc.userId.toString() === req.user.id;
}

function isAdmin(req: Request) {
  return req.user?.role === 'ADMIN';
}

export async function list(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) throw new AppError('Authentication required', 401);
    const page = Math.max(1, parseInt(String(req.query.page), 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit), 10) || 10));
    const skip = (page - 1) * limit;
    const status = typeof req.query.status === 'string' ? req.query.status : '';

    const filter: Record<string, unknown> = {};
    if (!isAdmin(req)) {
      filter.userId = new mongoose.Types.ObjectId(req.user.id);
    }
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      filter.status = status;
    }

    const [requests, total] = await Promise.all([
      RequestModel.find(filter)
        .populate('resourceId', 'name category availability')
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      RequestModel.countDocuments(filter),
    ]);

    res.json({
      requests: requests.map((r) => ({
        id: r._id,
        resourceId: r.resourceId,
        userId: r.userId,
        status: r.status,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (e) {
    next(e);
  }
}

export async function getById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) throw new AppError('Authentication required', 401);
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid request ID', 400);
    }
    const requestDoc = await RequestModel.findById(id)
      .populate('resourceId', 'name category availability description')
      .populate('userId', 'name email')
      .lean();
    if (!requestDoc) throw new AppError('Request not found', 404);
    const userId = (requestDoc.userId as { _id: mongoose.Types.ObjectId })._id;
    if (!isAdmin(req) && userId.toString() !== req.user.id) {
      throw new AppError('You can only view your own requests', 403);
    }
    res.json({
      id: requestDoc._id,
      resourceId: requestDoc.resourceId,
      userId: requestDoc.userId,
      status: requestDoc.status,
      createdAt: requestDoc.createdAt,
      updatedAt: requestDoc.updatedAt,
    });
  } catch (e) {
    next(e);
  }
}

export const createValidation = [
  body('resourceId').isMongoId().withMessage('Valid resource ID is required'),
];

export async function create(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array().map((e) => e.msg).join('; '), 400);
    }
    if (!req.user) throw new AppError('Authentication required', 401);
    const { resourceId } = req.body;
    const resource = await Resource.findById(resourceId);
    if (!resource) throw new AppError('Resource not found', 404);
    if (resource.availability !== 'available') {
      throw new AppError('Resource is not available for request', 400);
    }
    const existing = await RequestModel.findOne({
      resourceId,
      userId: req.user.id,
      status: 'pending',
    });
    if (existing) {
      throw new AppError('You already have a pending request for this resource', 409);
    }
    const requestDoc = await RequestModel.create({
      resourceId,
      userId: req.user.id,
      status: 'pending',
    });
    const populated = await RequestModel.findById(requestDoc._id)
      .populate('resourceId', 'name category availability')
      .populate('userId', 'name email')
      .lean();
    res.status(201).json({
      id: populated!._id,
      resourceId: populated!.resourceId,
      userId: populated!.userId,
      status: populated!.status,
      createdAt: populated!.createdAt,
      updatedAt: populated!.updatedAt,
    });
  } catch (e) {
    next(e);
  }
}

export const updateValidation = [
  param('id').isMongoId(),
  body('status').optional().isIn(['pending', 'approved', 'rejected']),
];

export async function update(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array().map((e) => e.msg).join('; '), 400);
    }
    if (!req.user) throw new AppError('Authentication required', 401);
    const { id } = req.params;
    const requestDoc = await RequestModel.findById(id);
    if (!requestDoc) throw new AppError('Request not found', 404);
    if (!isAdmin(req) && !isOwner(req, requestDoc)) {
      throw new AppError('You can only edit your own requests', 403);
    }
    if (requestDoc.status !== 'pending') {
      throw new AppError('Only pending requests can be edited', 400);
    }
    const { status } = req.body;
    if (status !== undefined && status !== 'pending') {
      throw new AppError('Users may only cancel (delete) or leave pending', 400);
    }
    const populated = await RequestModel.findById(id)
      .populate('resourceId', 'name category availability')
      .populate('userId', 'name email')
      .lean();
    res.json({
      id: populated!._id,
      resourceId: populated!.resourceId,
      userId: populated!.userId,
      status: populated!.status,
      createdAt: populated!.createdAt,
      updatedAt: populated!.updatedAt,
    });
  } catch (e) {
    next(e);
  }
}

export async function remove(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) throw new AppError('Authentication required', 401);
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid request ID', 400);
    }
    const requestDoc = await RequestModel.findById(id);
    if (!requestDoc) throw new AppError('Request not found', 404);
    if (!isAdmin(req) && !isOwner(req, requestDoc)) {
      throw new AppError('You can only cancel your own requests', 403);
    }
    if (requestDoc.status !== 'pending') {
      throw new AppError('Only pending requests can be cancelled', 400);
    }
    await RequestModel.findByIdAndDelete(id);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
}

export async function approve(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      throw new AppError('Admin access required', 403);
    }
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid request ID', 400);
    }
    const existing = await RequestModel.findById(id);
    if (!existing) throw new AppError('Request not found', 404);
    if (existing.status !== 'pending') {
      throw new AppError('Only pending requests can be approved', 400);
    }
    const requestDoc = await RequestModel.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true }
    )
      .populate('resourceId', 'name category availability')
      .populate('userId', 'name email')
      .lean();
    res.json({
      id: requestDoc!._id,
      resourceId: requestDoc!.resourceId,
      userId: requestDoc!.userId,
      status: 'approved',
      createdAt: requestDoc!.createdAt,
      updatedAt: requestDoc!.updatedAt,
    });
  } catch (e) {
    next(e);
  }
}

export async function reject(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      throw new AppError('Admin access required', 403);
    }
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid request ID', 400);
    }
    const requestDoc = await RequestModel.findById(id);
    if (!requestDoc) throw new AppError('Request not found', 404);
    if (requestDoc.status !== 'pending') {
      throw new AppError('Only pending requests can be rejected', 400);
    }
    requestDoc.status = 'rejected';
    await requestDoc.save();
    const populated = await RequestModel.findById(requestDoc._id)
      .populate('resourceId', 'name category availability')
      .populate('userId', 'name email')
      .lean();
    res.json({
      id: populated!._id,
      resourceId: populated!.resourceId,
      userId: populated!.userId,
      status: 'rejected',
      createdAt: populated!.createdAt,
      updatedAt: populated!.updatedAt,
    });
  } catch (e) {
    next(e);
  }
}
