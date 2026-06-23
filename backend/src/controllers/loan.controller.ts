import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/db';

export const getLoans = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const loans = await prisma.loan.findMany({
      include: { customer: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(loans);
  } catch (error) {
    next(error);
  }
};

export const createLoan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount, interestRate, termMonths, purpose, customerId } = req.body;
    
    // Fallback customer
    let targetCustomerId = customerId;
    if (!targetCustomerId) {
      const firstCust = await prisma.customer.findFirst();
      if (!firstCust) throw new Error('No customers configured in system');
      targetCustomerId = firstCust.id;
    }

    const loanNumber = 'LN-' + Math.floor(100000 + Math.random() * 900000);
    const loan = await prisma.loan.create({
      data: {
        loanNumber,
        amount: parseFloat(amount),
        interestRate: parseFloat(interestRate || '4.5'),
        termMonths: parseInt(termMonths || '12'),
        purpose,
        customerId: targetCustomerId
      }
    });

    res.status(201).json(loan);
  } catch (error) {
    next(error);
  }
};

export const updateLoanStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const { status } = req.body; // APPROVED, REJECTED, UNDER_REVIEW
    const loan = await prisma.loan.update({
      where: { id },
      data: { status }
    });
    res.json(loan);
  } catch (error) {
    next(error);
  }
};
