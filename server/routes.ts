import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';

const router = Router();

// Health check
router.get('/health', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: 'API is healthy' });
}));

// Register route
router.post('/register', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;
  // Registration logic here
  res.status(201).json({ message: 'User registered' });
}));

// Login route
router.post('/login', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  // Login logic here
  res.status(200).json({ message: 'User logged in' });
}));

// Protected route example
router.get('/profile', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // Auth middleware should populate req.user
  res.status(200).json({ message: 'User profile data' });
}));

export default router;