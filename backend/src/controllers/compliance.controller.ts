import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/db';

export const getComplianceReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let reports = await prisma.complianceReport.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // If empty, seed compliance reports automatically
    if (reports.length === 0) {
      await prisma.complianceReport.createMany({
        data: [
          { title: 'Suspicious Transfer Amount', type: 'SUSPICIOUS_ACTIVITY', severity: 'CRITICAL', status: 'OPEN', description: 'Large deposit detected from unknown external source' },
          { title: 'Multiple Failed KYC Attempts', type: 'RISK_ALERT', severity: 'HIGH', status: 'INVESTIGATING', description: 'Failed document check 3 times on passport validation' },
          { title: 'Out of Country Account Login', type: 'SECURITY_ALERT', severity: 'MEDIUM', status: 'RESOLVED', description: 'Ip address logged in from unexpected geographic coordinates' }
        ]
      });
      reports = await prisma.complianceReport.findMany({
        orderBy: { createdAt: 'desc' }
      });
    }

    res.json(reports);
  } catch (error) {
    next(error);
  }
};
