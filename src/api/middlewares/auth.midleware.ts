import { Context, Next } from 'hono';
import { verifyToken } from '../../utils/jwt';
import { logger } from '../../utils/logger';
import { jsonResponse, ResponseStatus } from '../../utils/response';

export interface AuthData {
  userId: string;
  email: string;
}

declare module 'hono' {
  interface ContextVariableMap {
    auth: AuthData;
  }
}

export async function authMiddleware(c: Context, next: Next) {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('Authorization header missing or invalid format');
      return jsonResponse(c, ResponseStatus.KO, {
        error: 'Unauthorized',
        statusCode: 401
      });
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);

    if (!payload) {
      logger.warn('Invalid or expired JWT token');
      return jsonResponse(c, ResponseStatus.KO, {
        error: 'Unauthorized',
        statusCode: 401
      });
    }

    c.set('auth', { 
      userId: payload.userId,
      email: payload.email
    });

    logger.info({ userId: payload.userId }, 'User authenticated successfully');
    await next();
  } catch (error) {
    logger.error(error, 'Authentication error');
    return jsonResponse(c, ResponseStatus.KO, {
      error: 'Authentication failed',
      statusCode: 401
    });
  }
}