import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: err.issues,
    });
  }

  if (err && typeof err === 'object' && 'code' in err && err.code === 11000) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const message =
    err instanceof Error ? err.message : 'Internal server error';

  res.status(500).json({ message });
};
