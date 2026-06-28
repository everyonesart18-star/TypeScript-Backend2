import jwt from 'jsonwebtoken';

export const generateToken = (id: string) => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }
  
  return jwt.sign({ id }, secret, {
    expiresIn: '30d',
  });
};
