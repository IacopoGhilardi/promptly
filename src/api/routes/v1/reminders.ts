import { Hono } from 'hono';
import { reminderController } from '../../controllers/reminder.controller';
import { authMiddleware } from '../../middlewares/auth.midleware';

export function initRemindersRoutes(app: Hono) {
  const remindersRouter = new Hono();
  
  remindersRouter.use('*', authMiddleware);
  
  remindersRouter.post('/', reminderController.createReminder);
  remindersRouter.get('/user/:userId', reminderController.getReminders);
  remindersRouter.get('/:id', reminderController.getReminderById);
  remindersRouter.put('/:id', reminderController.updateReminder);
  remindersRouter.delete('/:id', reminderController.deleteReminder);
  
  app.route('/reminders', remindersRouter);
} 