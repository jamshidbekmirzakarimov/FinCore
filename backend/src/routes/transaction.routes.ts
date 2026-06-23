import { Router } from 'express';
import { getTransactions, depositFunds, withdrawFunds } from '../controllers/transaction.controller';
import { authenticate } from '../middlewares/auth.middleware';

export const transactionRouter = Router();
transactionRouter.get('/', authenticate, getTransactions);
transactionRouter.post('/deposit', authenticate, depositFunds);
transactionRouter.post('/withdraw', authenticate, withdrawFunds);
