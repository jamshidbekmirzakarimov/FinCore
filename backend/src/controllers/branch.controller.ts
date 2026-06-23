import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/db';

export const getBranches = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const branches = await prisma.branch.findMany({
      include: {
        _count: { select: { users: true, customers: true } }
      }
    });
    res.json(branches);
  } catch (error) {
    next(error);
  }
};
