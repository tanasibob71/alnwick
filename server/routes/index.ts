import { Express } from 'express';
import exampleRoutes from './exampleRoutes';

export function registerRoutes(app: Express) {
  app.use('/example', exampleRoutes);
}