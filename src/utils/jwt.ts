import * as jwt from 'jsonwebtoken';
import { logger } from './logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export interface JwtPayload {
  userId: string;
  email: string;
}

export function generateToken(payload: JwtPayload): string {
  logger.info({ userId: payload.userId }, 'Generating JWT token');
  return jwt.sign(payload, JWT_SECRET as jwt.Secret, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    logger.info('Verifying JWT token');
    return jwt.verify(token, JWT_SECRET as jwt.Secret) as JwtPayload;
  } catch (error) {
    logger.error(error, 'JWT verification failed');
    return null;
  }
}

export function generatePasswordResetToken(email: string): string {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
}