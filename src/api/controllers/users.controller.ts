import { Context } from 'hono';
import { userService } from '../../../services/user.service';
import { jsonResponse, ResponseStatus } from '../../utils/response';
import { logger } from '../../utils/logger';

export class UsersController {
  async createUser(c: Context) {
    try {
      const body = await c.req.json();
      const user = await userService.createUser(body);
      return jsonResponse(c, ResponseStatus.OK, { 
        data: user,
        message: 'User created successfully' 
      });
    } catch (error) {
      logger.error(error, 'Failed to create user');
      return jsonResponse(c, ResponseStatus.KO, { 
        error: 'Failed to create user',
        statusCode: 400
      });
    }
  }

  async getUsers(c: Context) {
    try {
      const users = await userService.getUsers();
      return jsonResponse(c, ResponseStatus.OK, { data: users });
    } catch (error) {
      logger.error(error, 'Failed to fetch users');
      return jsonResponse(c, ResponseStatus.KO, { 
        error: 'Failed to fetch users',
        statusCode: 500
      });
    }
  }

  async getUserById(c: Context) {
    try {
      const publicId = c.req.param('id');
      const user = await userService.getUserById(publicId);
      
      if (!user) {
        logger.warn({ userId: publicId }, 'User not found');
        return jsonResponse(c, ResponseStatus.KO, { 
          error: 'User not found',
          statusCode: 404
        });
      }

      return jsonResponse(c, ResponseStatus.OK, { data: user });
    } catch (error) {
      logger.error(error, 'Failed to fetch user');
      return jsonResponse(c, ResponseStatus.KO, { 
        error: 'Failed to fetch user',
        statusCode: 500
      });
    }
  }

  async updateUser(c: Context) {
    try {
      const publicId = c.req.param('id');
      const body = await c.req.json();
      const user = await userService.updateUser(publicId, body);

      if (!user) {
        logger.warn({ userId: publicId }, 'User not found for update');
        return jsonResponse(c, ResponseStatus.KO, { 
          error: 'User not found',
          statusCode: 404
        });
      }

      return jsonResponse(c, ResponseStatus.OK, { 
        data: user,
        message: 'User updated successfully' 
      });
    } catch (error) {
      logger.error(error, 'Failed to update user');
      return jsonResponse(c, ResponseStatus.KO, { 
        error: 'Failed to update user',
        statusCode: 400
      });
    }
  }

  async deleteUser(c: Context) {
    try {
      const publicId = c.req.param('id');
      const user = await userService.deleteUser(publicId);

      if (!user) {
        return jsonResponse(c, ResponseStatus.KO, { 
          error: 'User not found',
          statusCode: 404
        });
      }

      return jsonResponse(c, ResponseStatus.OK, { 
        message: 'User deleted successfully' 
      });
    } catch (error) {
      return jsonResponse(c, ResponseStatus.KO, { 
        error: 'Failed to delete user',
        statusCode: 500
      });
    }
  }
}

export const usersController = new UsersController();
