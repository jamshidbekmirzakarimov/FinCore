import { Router } from 'express';
import { getLoans, createLoan, updateLoanStatus } from '../controllers/loan.controller';
import { authenticate } from '../middlewares/auth.middleware';

export const loanRouter = Router();
loanRouter.get('/', authenticate, getLoans);
loanRouter.post('/', authenticate, createLoan);
loanRouter.patch('/:id/status', authenticate, updateLoanStatus);
