import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/db';

export const getStatsSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activeCustomers = await prisma.customer.count();
    
    const accounts = await prisma.account.findMany();
    const totalDeposits = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    const loans = await prisma.loan.findMany();
    const totalLoans = loans.reduce((sum, loan) => sum + loan.amount, 0);

    res.json({
      activeCustomers,
      totalDeposits,
      totalLoans,
      systemHealth: '99.99%',
      status: 'stable'
    });
  } catch (error) {
    next(error);
  }
};
