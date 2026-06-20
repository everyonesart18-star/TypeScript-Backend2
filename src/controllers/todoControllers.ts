import { Request, Response, NextFunction } from 'express';
import Todo from '../models/Todo';
import { z } from 'zod';

const createTodoSchema = z.object({
  title: z.string().min(1).trim(),
  description: z.string().trim().optional(),
  dueDate: z
    .string()
    .optional()
    .transform((value) => (value?.trim() ? value.trim() : undefined)),
  priority: z.enum(['low', 'medium', 'high']).optional(),
});

export const getTodos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const todos = await Todo.find({ user: req.user?._id }).sort({ createdAt: -1 });
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
    const validatedData = createTodoSchema.parse(req.body);

    const todo = await Todo.create({
      user: req.user?._id,
      title: validatedData.title,
      description: validatedData.description,
      dueDate: validatedData.dueDate
        ? new Date(validatedData.dueDate)
        : undefined,
      priority: validatedData.priority || 'medium',
      completed: false,
    } as any);

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
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user?._id,
    } as any);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const body = { ...req.body };
    if (body.dueDate === '' || body.dueDate == null) {
      delete body.dueDate;
    } else if (typeof body.dueDate === 'string') {
      body.dueDate = new Date(body.dueDate);
    }

    const updated = await Todo.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });

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
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user?._id,
    } as any);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    await Todo.deleteOne({ _id: req.params.id } as any);
    res.json({ message: 'Todo removed' });
  } catch (error) {
    next(error);
  }
};
