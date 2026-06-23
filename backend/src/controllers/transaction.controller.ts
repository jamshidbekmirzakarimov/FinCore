import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/db';

export const getTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

export const depositFunds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accountNumber, amount, description } = req.body;
    const amt = parseFloat(amount);

    const account = await prisma.account.findUnique({ where: { accountNumber } });
    if (!account) return res.status(404).json({ message: 'Account not found' });

    // Update balance
    const updatedAccount = await prisma.account.update({
      where: { id: account.id },
      data: { balance: { increment: amt } }
    });

    const ref = 'TRX-' + Math.floor(10000000 + Math.random() * 90000000);
    const trx = await prisma.transaction.create({
      data: {
        referenceNumber: ref,
        amount: amt,
        type: 'DEPOSIT',
        status: 'COMPLETED',
        description,
        toAccountId: account.id
      }
    });

    res.json({ trx, newBalance: updatedAccount.balance });
  } catch (error) {
    next(error);
  }
};

export const withdrawFunds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accountNumber, amount, description } = req.body;
    const amt = parseFloat(amount);

    const account = await prisma.account.findUnique({ where: { accountNumber } });
    if (!account) return res.status(404).json({ message: 'Account not found' });

    if (account.balance < amt) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    const updatedAccount = await prisma.account.update({
      where: { id: account.id },
      data: { balance: { decrement: amt } }
    });

    const ref = 'TRX-' + Math.floor(10000000 + Math.random() * 90000000);
    const trx = await prisma.transaction.create({
      data: {
        referenceNumber: ref,
        amount: amt,
        type: 'WITHDRAWAL',
        status: 'COMPLETED',
        description,
        fromAccountId: account.id
      }
    });

    res.json({ trx, newBalance: updatedAccount.balance });
  } catch (error) {
    next(error);
  }
};
