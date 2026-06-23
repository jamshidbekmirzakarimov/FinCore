import { Router } from 'express';
import { getBranches } from '../controllers/branch.controller';
import { authenticate } from '../middlewares/auth.middleware';

export const branchRouter = Router();
branchRouter.get('/', authenticate, getBranches);
