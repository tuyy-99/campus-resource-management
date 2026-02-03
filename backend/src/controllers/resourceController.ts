import { Request, Response, NextFunction } from 'express';
import { validationResult, body, param } from 'express-validator';
import { Resource } from '../models/Resource';
import { AppError } from '../middleware/errorHandler';
import mongoose from 'mongoose';

export async function list(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = Math.max(1, parseInt(String(req.query.page), 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit), 10) || 10));
    const skip = (page - 1) * limit;
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const category = typeof req.query.category === 'string' ? req.query.category.trim() : '';

    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
      ];
    }
    if (category) filter.category = category;

    const [resources, total] = await Promise.all([
      Resource.find(filter).populate('createdBy', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Resource.countDocuments(filter),
    ]);

    res.json({
      resources: resources.map((r) => ({
        id: r._id,
        name: r.name,
        category: r.category,
        description: r.description,
        availability: r.availability,
        files: r.files || [],
        createdBy: r.createdBy,
        createdAt: r.createdAt,
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
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid resource ID', 400);
    }
    const resource = await Resource.findById(id).populate('createdBy', 'name email').lean();
    if (!resource) {
      throw new AppError('Resource not found', 404);
    }
    res.json({
      id: resource._id,
      name: resource.name,
      category: resource.category,
      description: resource.description,
      availability: resource.availability,
      files: resource.files || [],
      createdBy: resource.createdBy,
      createdAt: resource.createdAt,
    });
  } catch (e) {
    next(e);
  }
}

export const createValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 200 }),
  body('category').trim().notEmpty().withMessage('Category is required').isLength({ max: 100 }),
  body('description').trim().isLength({ max: 2000 }).optional(),
  body('availability').optional().isIn(['available', 'unavailable']),
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
    
    const { name, category, description, availability, files } = req.body;
    
    // Process uploaded files if any
    const processedFiles = files ? files.map((file: any, index: number) => ({
      filename: `resource_${Date.now()}_${index}`,
      originalName: file.name || `file_${index}`,
      mimeType: file.type || 'application/octet-stream',
      size: file.size || 0,
      url: file.url || file, // In a real app, you'd save to cloud storage
      uploadedAt: new Date()
    })) : [];
    
    const resource = await Resource.create({
      name,
      category: category || 'General',
      description: description || '',
      availability: availability || 'available',
      files: processedFiles,
      createdBy: req.user.id,
    });
    
    const populated = await Resource.findById(resource._id).populate('createdBy', 'name email').lean();
    res.status(201).json({
      id: populated!._id,
      name: populated!.name,
      category: populated!.category,
      description: populated!.description,
      availability: populated!.availability,
      files: populated!.files,
      createdBy: populated!.createdBy,
      createdAt: populated!.createdAt,
    });
  } catch (e) {
    next(e);
  }
}

export const updateValidation = [
  param('id').isMongoId(),
  body('name').trim().notEmpty().optional().isLength({ max: 200 }),
  body('category').trim().notEmpty().optional().isLength({ max: 100 }),
  body('description').trim().optional().isLength({ max: 2000 }),
  body('availability').optional().isIn(['available', 'unavailable']),
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
    const { id } = req.params;
    const resource = await Resource.findById(id);
    if (!resource) throw new AppError('Resource not found', 404);
    const { name, category, description, availability } = req.body;
    if (name !== undefined) resource.name = name;
    if (category !== undefined) resource.category = category;
    if (description !== undefined) resource.description = description;
    if (availability !== undefined) resource.availability = availability;
    await resource.save();
    const populated = await Resource.findById(resource._id).populate('createdBy', 'name email').lean();
    res.json({
      id: populated!._id,
      name: populated!.name,
      category: populated!.category,
      description: populated!.description,
      availability: populated!.availability,
      createdBy: populated!.createdBy,
      createdAt: populated!.createdAt,
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
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid resource ID', 400);
    }
    const resource = await Resource.findByIdAndDelete(id);
    if (!resource) throw new AppError('Resource not found', 404);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
}
