import { prisma } from './utils/db';
import bcrypt from 'bcrypt';

async function main() {
  const email = 'admin@fincore.com';
  const hashedPassword = await bcrypt.hash('admin', 10);
  
  const updatedUser = await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword
    }
  });
  
  console.log('Successfully reset password for', email);
  console.log('New hashed password:', updatedUser.password);

  // Test compare
  const isMatch = await bcrypt.compare('admin', updatedUser.password);
  console.log('Does "admin" match?', isMatch);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
