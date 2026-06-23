import { Router } from 'express';
import { getStatsSummary } from '../controllers/stats.controller';
import { authenticate } from '../middlewares/auth.middleware';

export const statsRouter = Router();
statsRouter.get('/summary', authenticate, getStatsSummary);
