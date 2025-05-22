import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { storage } from '../storage';
import { authMiddleware } from '../middleware/auth';
import { insertUserSchema } from '@shared/schema';

const router = Router();

// Login validation schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Registration schema (extended from insertUserSchema)
const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Login route
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    
    const user = await storage.getUserByEmail(email);
    
    if (!user || user.password !== password) { // In a real app, use bcrypt.compare
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      });
    }
    
    // Update last login
    await storage.updateUser(user.id, { lastLoginAt: new Date() });
    
    // Set user in session
    req.session.userId = user.id;
    
    // Return user (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// Register route
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { confirmPassword, ...userData } = registerSchema.parse(req.body);
    
    // Check if email already exists
    const existingUser = await storage.getUserByEmail(userData.email);
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }
    
    // Create user
    const newUser = await storage.createUser(userData);
    
    // Initialize user engagement metrics
    await storage.createOrUpdateUserEngagementMetrics({ userId: newUser.id });
    
    // Set user in session
    req.session.userId = newUser.id;
    
    // Return user (without password)
    const { password, ...userWithoutPassword } = newUser;
    
    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: userWithoutPassword,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// Logout route
router.post('/logout', (req: Request, res: Response) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Session destruction error:', err);
      return res.status(500).json({
        success: false,
        message: 'Logout failed',
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  });
});

// Get current user
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  const { password, ...userWithoutPassword } = req.user;
  
  return res.status(200).json({
    success: true,
    user: userWithoutPassword,
  });
});

export default router;