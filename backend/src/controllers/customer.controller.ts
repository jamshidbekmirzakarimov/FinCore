import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/db';

export const getCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, kycStatus } = req.query;
    const whereClause: any = {};

    if (kycStatus && kycStatus !== 'ALL') {
      whereClause.kycStatus = kycStatus as string;
    }

    if (search) {
      whereClause.OR = [
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const customers = await prisma.customer.findMany({
      where: whereClause,
      include: { branch: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json(customers);
  } catch (error) {
    next(error);
  }
};

export const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, phone, dateOfBirth, passportNumber, address, city, country, branchId } = req.body;
    
    // Find first branch if not specified
    let targetBranchId = branchId;
    if (!targetBranchId) {
      const firstBranch = await prisma.branch.findFirst();
      if (!firstBranch) throw new Error('No branches configured in system');
      targetBranchId = firstBranch.id;
    }

    const customer = await prisma.customer.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth: new Date(dateOfBirth || '1990-01-01'),
        passportNumber,
        address,
        city,
        country,
        branchId: targetBranchId
      }
    });

    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
};
