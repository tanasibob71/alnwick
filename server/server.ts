
import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import memoryStore from 'memorystore';
import { registerRoutes } from './routes/index';
import { setupVite, serveStatic, log } from './vite';

dotenv.config();

const app = express();
const MemoryStore = memoryStore(session);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  store: new MemoryStore({ checkPeriod: 86400000 }),
  secret: process.env.SESSION_SECRET || 'alnwick-community-center-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  },
}));

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  const originalJson = res.json;
  let captured;

  res.json = function (body, ...args) {
    captured = body;
    return originalJson.apply(res, [body, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let line = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (captured) line += ` :: ${JSON.stringify(captured)}`;
      if (line.length > 80) line = line.slice(0, 79) + "…";
      log(line);
    }
  });

  next();
});

registerRoutes(app);

app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
  throw err;
});

(async () => {
  if (app.get("env") === "development") {
    const server = await setupVite(app);
    server.listen(5000, () => log(`serving on port 5000`));
  } else {
    serveStatic(app);
    app.listen(5000, () => log(`serving on port 5000`));
  }
})();