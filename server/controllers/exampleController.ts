import { Request, Response } from 'express';

export const getExample = (req: Request, res: Response) => {
  res.json({ message: 'This is a protected example route' });
};