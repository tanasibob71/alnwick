import { Express } from 'express';
import exampleRoutes from './exampleRoutes';

export async function registerRoutes(app: Express) {
  app.use('/api', exampleRoutes);
  return app;
}