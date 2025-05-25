import { Router } from 'express';

const router = Router();

router.get('/example', (req, res) => {
  res.json({ message: 'Hello from /example route!' });
});

export default router;