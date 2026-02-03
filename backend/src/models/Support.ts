import mongoose, { Document, Schema } from "mongoose";

export interface ISupport extends Document {
  name: string;
  email: string;
  category: "technical" | "resource" | "account" | "general";
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo?: string;
  response?: string;
  createdAt: Date;
  updatedAt: Date;
}

const supportSchema = new Schema<ISupport>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    category: { 
      type: String, 
      enum: ["technical", "resource", "account", "general"],
      default: "general"
    },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open"
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium"
    },
    assignedTo: { type: String },
    response: { type: String }
  },
  { timestamps: true },
);

export const Support = mongoose.model<ISupport>("Support", supportSchema);
