import { Hono } from "hono";
import { authMiddleware } from "../../middlewares/auth.midleware";

export function initCategoriesRoutes(app: Hono) {
    const reminders = new Hono();
    
    reminders.use('*', authMiddleware);
    
    // reminders.post('/', (c) => reminderController.createReminder(c));
    // reminders.get('/', (c) => reminderController.getReminders(c));
    // reminders.get('/:id', (c) => reminderController.getReminderById(c));
    // reminders.put('/:id', (c) => reminderController.updateReminder(c));
    // reminders.delete('/:id', (c) => reminderController.deleteReminder(c));

    app.route('/reminders', reminders);
} 