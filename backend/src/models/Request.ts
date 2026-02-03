import mongoose, { Document, Schema } from 'mongoose';

export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface IRequest extends Document {
  resourceId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  status: RequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

const requestSchema = new Schema<IRequest>(
  {
    resourceId: {
      type: Schema.Types.ObjectId,
      ref: 'Resource',
      required: [true, 'Resource is required'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'rejected'],
        message: 'Status must be pending, approved, or rejected',
      },
      default: 'pending',
    },
  },
  { timestamps: true }
);

requestSchema.index({ userId: 1, createdAt: -1 });
requestSchema.index({ resourceId: 1 });
requestSchema.index({ status: 1 });

export const Request = mongoose.model<IRequest>('Request', requestSchema);
