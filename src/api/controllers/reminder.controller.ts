import { Context } from 'hono';
import { reminderService } from '../services/reminder.service';
import { jsonResponse, ResponseStatus } from '../../utils/response';
import { logger } from '../../utils/logger';

export class ReminderController {
  async createReminder(c: Context) {
    try {
      const body = await c.req.json();
      const reminder = await reminderService.createReminder(body);
      return jsonResponse(c, ResponseStatus.OK, { 
        data: reminder,
        message: 'Reminder created successfully' 
      });
    } catch (error) {
      logger.error(error, 'Failed to create reminder');
      return jsonResponse(c, ResponseStatus.KO, { 
        error: 'Failed to create reminder',
        statusCode: 400
      });
    }
  }

  async getReminders(c: Context) {
    try {
      const userId = Number(c.req.param('userId'));
      const reminders = await reminderService.getReminders(userId);
      return jsonResponse(c, ResponseStatus.OK, { 
        data: reminders,
        message: 'Reminders fetched successfully' 
      });
    } catch (error) {
      logger.error(error, 'Failed to fetch reminders');
      return jsonResponse(c, ResponseStatus.KO, { 
        error: 'Failed to fetch reminders',
        statusCode: 400
      });
    }
  }

  async getReminderById(c: Context) {
    try {
      const id = Number(c.req.param('id'));
      const reminder = await reminderService.getReminderById(id);
      
      if (!reminder) {
        return jsonResponse(c, ResponseStatus.KO, { 
          error: 'Reminder not found',
          statusCode: 404
        });
      }
      
      return jsonResponse(c, ResponseStatus.OK, { 
        data: reminder,
        message: 'Reminder fetched successfully' 
      });
    } catch (error) {
      logger.error(error, 'Failed to fetch reminder');
      return jsonResponse(c, ResponseStatus.KO, { 
        error: 'Failed to fetch reminder',
        statusCode: 400
      });
    }
  }

  async updateReminder(c: Context) {
    try {
      const id = Number(c.req.param('id'));
      const body = await c.req.json();
      const reminder = await reminderService.updateReminder(id, body);
      
      if (!reminder) {
        return jsonResponse(c, ResponseStatus.KO, { 
          error: 'Reminder not found',
          statusCode: 404
        });
      }
      
      return jsonResponse(c, ResponseStatus.OK, { 
        data: reminder,
        message: 'Reminder updated successfully' 
      });
    } catch (error) {
      logger.error(error, 'Failed to update reminder');
      return jsonResponse(c, ResponseStatus.KO, { 
        error: 'Failed to update reminder',
        statusCode: 400
      });
    }
  }

  async deleteReminder(c: Context) {
    try {
      const id = Number(c.req.param('id'));
      const reminder = await reminderService.deleteReminder(id);
      
      if (!reminder) {
        return jsonResponse(c, ResponseStatus.KO, { 
          error: 'Reminder not found',
          statusCode: 404
        });
      }
      
      return jsonResponse(c, ResponseStatus.OK, { 
        data: reminder,
        message: 'Reminder deleted successfully' 
      });
    } catch (error) {
      logger.error(error, 'Failed to delete reminder');
      return jsonResponse(c, ResponseStatus.KO, { 
        error: 'Failed to delete reminder',
        statusCode: 400
      });
    }
  }
}

export const reminderController = new ReminderController();
