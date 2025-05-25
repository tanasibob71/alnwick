
import express from 'express';
import session from 'express-session';
import memoryStore from 'memorystore';
import { registerRoutes } from './routes/index';
import { setupVite, serveStatic, log } from './vite';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const MemoryStore = memoryStore(session);

app.use(session({
  store: new MemoryStore({ checkPeriod: 86400000 }),
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  },
}));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  const originalJson = res.json;
  res.json = function (body, ...args) {
    const duration = Date.now() - start;
    log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
    return originalJson.call(this, body, ...args);
  };
  next();
});

app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
  throw err;
});

(async () => {
  await registerRoutes(app); // ?? Moved inside async block

  if (app.get("env") === "development") {
    const server = await setupVite(app);
    server.listen(5000, () => log(`serving on port 5000`));
  } else {
    serveStatic(app);
    app.listen(5000, () => log(`serving on port 5000`));
  }
})();