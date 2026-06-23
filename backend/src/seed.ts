import { prisma } from './utils/db';
import bcrypt from 'bcrypt';

async function main() {
  console.log('Starting seeding...');

  // 1. Roles
  const roles = [
    { id: '11111111-1111-1111-1111-111111111111', name: 'Admin', description: 'System Administrator' },
    { id: '22222222-2222-2222-2222-222222222222', name: 'Branch Manager', description: 'Manager of a Branch' },
    { id: '33333333-3333-3333-3333-333333333333', name: 'Teller', description: 'Bank Teller' }
  ];

  for (const r of roles) {
    await prisma.role.upsert({
      where: { id: r.id },
      update: {},
      create: r
    });
  }
  console.log('Roles seeded.');

  // 2. Branch
  const branchId = '44444444-4444-4444-4444-444444444444';
  await prisma.branch.upsert({
    where: { id: branchId },
    update: {},
    create: {
      id: branchId,
      name: 'Main Branch',
      code: 'B001',
      address: '123 Main St',
      city: 'Tashkent',
      country: 'Uzbekistan',
      phone: '+998901234567'
    }
  });
  console.log('Branches seeded.');

  // 3. User (Admin)
  const adminId = '55555555-5555-5555-5555-555555555555';
  const hashedPassword = await bcrypt.hash('admin', 10);
  await prisma.user.upsert({
    where: { id: adminId },
    update: {},
    create: {
      id: adminId,
      email: 'admin@fincore.com',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Admin',
      roleId: '11111111-1111-1111-1111-111111111111',
      branchId: branchId
    }
  });
  console.log('Admin User seeded.');

  // 4. Customer
  const customerId = '66666666-6666-6666-6666-666666666666';
  await prisma.customer.upsert({
    where: { id: customerId },
    update: {},
    create: {
      id: customerId,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+998901112233',
      dateOfBirth: new Date('1990-01-01T00:00:00Z'),
      passportNumber: 'AA1234567',
      address: '456 Side St',
      city: 'Tashkent',
      country: 'Uzbekistan',
      kycStatus: 'APPROVED',
      branchId: branchId
    }
  });
  console.log('Customers seeded.');

  // 5. Account
  const accountId = '77777777-7777-7777-7777-777777777777';
  await prisma.account.upsert({
    where: { id: accountId },
    update: {},
    create: {
      id: accountId,
      accountNumber: '1000200030004000',
      type: 'CHECKING',
      balance: 15000.00,
      currency: 'USD',
      status: 'ACTIVE',
      customerId: customerId
    }
  });
  console.log('Accounts seeded.');

  // 6. Transaction
  const trxId = '88888888-8888-8888-8888-888888888888';
  await prisma.transaction.upsert({
    where: { id: trxId },
    update: {},
    create: {
      id: trxId,
      referenceNumber: 'TRX123456789',
      amount: 5000.00,
      type: 'DEPOSIT',
      status: 'COMPLETED',
      description: 'Initial Deposit',
      toAccountId: accountId
    }
  });
  console.log('Transactions seeded.');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
