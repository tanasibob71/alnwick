import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
  res.send('Example route working!');
});

export default router;