import { Request, Response, NextFunction } from 'express';
import Todo, { ITodo } from '../models/Todo';
import { z } from 'zod';
import { Types } from 'mongoose';

const createTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  description: z.string().trim().optional(),
  dueDate: z
    .string()
    .optional()
    .transform((value) => (value?.trim() ? value.trim() : undefined)),
  priority: z.enum(['low', 'medium', 'high']).optional(),
});

const updateTodoSchema = z.object({
  title: z.string().min(1).trim().optional(),
  description: z.string().trim().optional(),
  dueDate: z
    .string()
    .optional()
    .transform((value) => (value?.trim() ? value.trim() : undefined)),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  completed: z.boolean().optional(),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;

export const getTodos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const todos = await Todo.find({ user: userId }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    next(error);
  }
};

export const createTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const validatedData = createTodoSchema.parse(req.body);

    const todo: ITodo = await Todo.create({
      user: userId,
      title: validatedData.title,
      description: validatedData.description,
      dueDate: validatedData.dueDate
        ? new Date(validatedData.dueDate)
        : undefined,
      priority: validatedData.priority || 'medium',
      completed: false,
    });

    res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
};

export const updateTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const todoId = req.params.id;

    // Validate if todoId is a valid MongoDB ObjectId
    if (!Types.ObjectId.isValid(todoId)) {
      return res.status(400).json({ message: 'Invalid todo ID' });
    }

    const validatedData = updateTodoSchema.parse(req.body);

    // Process dueDate if provided
    const updateData: Partial<UpdateTodoInput & { dueDate?: Date }> = validatedData;
    if (validatedData.dueDate) {
      updateData.dueDate = new Date(validatedData.dueDate);
    }

    // Use findOneAndUpdate to ensure user owns the todo
    const updated = await Todo.findOneAndUpdate(
      { _id: todoId, user: userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Todo not found or not authorized' });
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const todoId = req.params.id;

    // Validate if todoId is a valid MongoDB ObjectId
    if (!Types.ObjectId.isValid(todoId)) {
      return res.status(400).json({ message: 'Invalid todo ID' });
    }

    // Delete with both ID and user filter to ensure authorization
    const result = await Todo.deleteOne({
      _id: todoId,
      user: userId,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Todo not found or not authorized' });
    }

    res.json({ message: 'Todo removed' });
  } catch (error) {
    next(error);
  }
};
