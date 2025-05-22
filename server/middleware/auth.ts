import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';
import session from 'express-session';

// Extend the Express Session interface to include userId
declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

// Extend the Express Request interface to include the user
declare global {
  namespace Express {
    interface Request {
      user?: any;
      userId?: number;
    }
  }
}

// Authentication middleware
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session?.userId;
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  try {
    const user = await storage.getUserById(userId);
    
    if (!user) {
      req.session.destroy(err => {
        if (err) console.error('Session destruction error:', err);
      });
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }
    
    // Add user to request object
    req.user = user;
    req.userId = user.id;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Admin authorization middleware
export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // First apply auth middleware to ensure user is logged in
  authMiddleware(req, res, async () => {
    console.log('Admin middleware - checking role:', req.user?.role);
    
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }
    
    next();
  });
};