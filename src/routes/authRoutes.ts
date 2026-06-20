import express from 'express';
import { registerUser, loginUser, getMe } from '../controllers/authController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { z } from 'zod';

const router = express.Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

export default router;