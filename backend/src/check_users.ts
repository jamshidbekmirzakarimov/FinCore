import { prisma } from './utils/db';

async function main() {
  const users = await prisma.user.findMany({
    include: { role: true }
  });
  console.log('Total users in DB:', users.length);
  console.log('Users list:', JSON.stringify(users, null, 2));

  const roles = await prisma.role.findMany();
  console.log('Total roles in DB:', roles.length);
  console.log('Roles list:', JSON.stringify(roles, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
