import { Context } from 'hono';
import { userService } from '../services/user.service';
import { jsonResponse, ResponseStatus } from '../../utils/response';
import { logger } from '../../utils/logger';

export class AuthController {
  async register(c: Context) {
    try {
      const body = await c.req.json();
      const result = await userService.register(body);
      
      return jsonResponse(c, ResponseStatus.OK, { 
        data: result,
        message: 'Registration successful' 
      });
    } catch (error) {
      logger.error(error, 'Registration failed');
      
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      const statusCode = errorMessage.includes('already exists') ? 409 : 400;
      
      return jsonResponse(c, ResponseStatus.KO, { 
        error: errorMessage,
        statusCode
      });
    }
  }

  async login(c: Context) {
    try {
      const body = await c.req.json();
      const result = await userService.login(body);
      
      return jsonResponse(c, ResponseStatus.OK, { 
        data: result,
        message: 'Login successful' 
      });
    } catch (error) {
      logger.error(error, 'Login failed');
      
      return jsonResponse(c, ResponseStatus.KO, { 
        error: 'Invalid email or password',
        statusCode: 401
      });
    }
  }

  async forgotPassword(c: Context) {
    try {
      const { email } = await c.req.json();
      await userService.sendPasswordResetEmail(email);
      
      return jsonResponse(c, ResponseStatus.OK, { 
        message: 'Se l\'email esiste nel sistema, riceverai istruzioni per il reset' 
      });
    } catch (error) {
      logger.error(error, 'Password reset request failed');
      return jsonResponse(c, ResponseStatus.KO, { 
        error: 'Impossibile elaborare la richiesta',
        statusCode: 400
      });
    }
  }

  async resetPassword(c: Context) {
    try {
      const { token, newPassword } = await c.req.json();
      await userService.resetPassword(token, newPassword);
      
      return jsonResponse(c, ResponseStatus.OK, { 
        message: 'Password aggiornata con successo' 
      });
    } catch (error) {
      logger.error(error, 'Password reset failed');
      return jsonResponse(c, ResponseStatus.KO, { 
        error: 'Token non valido o scaduto',
        statusCode: 400
      });
    }
  }
}

export const authController = new AuthController();
