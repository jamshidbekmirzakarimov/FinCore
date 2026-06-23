import { Router } from 'express';
import { getComplianceReports } from '../controllers/compliance.controller';
import { authenticate } from '../middlewares/auth.middleware';

export const complianceRouter = Router();
complianceRouter.get('/', authenticate, getComplianceReports);
