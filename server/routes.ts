import express from 'express';
import exampleRoutes from './exampleRoutes';

const router = express.Router();

router.use('/example', exampleRoutes);

export default router;