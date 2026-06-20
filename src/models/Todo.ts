import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITodo extends Document {
  user: Types.ObjectId;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
}

const todoSchema = new Schema<ITodo>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    completed: { type: Boolean, default: false },
    dueDate: { type: Date },
    priority: { 
      type: String, 
      enum: ['low', 'medium', 'high'], 
      default: 'medium' 
    },
  },
  { timestamps: true }
);

// Index for fast user queries (important for scaling)
todoSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model<ITodo>('Todo', todoSchema);