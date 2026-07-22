import { Router, Request, Response } from 'express';

export const createHealthRouter = (): Router => {
  const router = Router();

  router.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      data: {
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      }
    });
  });

  return router;
};