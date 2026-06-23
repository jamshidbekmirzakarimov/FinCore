import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '../utils/db';

export const loginService = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true }
  });

  if (!user) throw new Error('Invalid email or password');

  // Compare passwords (first checking plain text fallback for mock user, then bcrypt)
  const isMatch = password === user.password || await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid email or password');

  const token = jwt.sign(
    { id: user.id, role: user.role.name, email: user.email },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '24h' }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role.name,
      firstName: user.firstName,
      lastName: user.lastName
    }
  };
};
