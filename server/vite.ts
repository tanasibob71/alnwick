import { type Express } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

export const log = (...args: any[]) => console.log('[LOG]', ...args);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function setupVite(app: Express) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
    root: path.resolve(__dirname, '../client'),
  });

  app.use(vite.middlewares);
  return app;
}

export function serveStatic(app: Express) {
  const expressStatic = require('express').static;
  const staticPath = path.resolve(__dirname, '../client/dist');
  app.use(expressStatic(staticPath));
}