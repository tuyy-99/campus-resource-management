import mongoose, { Document, Schema } from 'mongoose';

export interface IResourceFile {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: Date;
}

export interface IResource extends Document {
  name: string;
  category: string;
  description: string;
  availability: 'available' | 'unavailable';
  files: IResourceFile[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const resourceFileSchema = new Schema<IResourceFile>({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

const resourceSchema = new Schema<IResource>(
  {
    name: {
      type: String,
      required: [true, 'Resource name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      maxlength: [100, 'Category cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },
    availability: {
      type: String,
      enum: {
        values: ['available', 'unavailable'],
        message: 'Availability must be available or unavailable',
      },
      default: 'available',
    },
    files: [resourceFileSchema],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export const Resource = mongoose.model<IResource>('Resource', resourceSchema);
