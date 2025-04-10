import { serial, text, boolean, timestamp, integer } from 'drizzle-orm/pg-core';
import { defaultSchema, timestamps } from '../db/helpers/columns';
import { users } from './users';
import { categories } from './categories';
export const priorityEnum = defaultSchema.enum('reminder_priority', ['low', 'medium', 'high', 'urgent']);
export const statusEnum = defaultSchema.enum('reminder_status', ['pending', 'completed', 'missed', 'cancelled']);
export const typeEnum = defaultSchema.enum('reminder_type', ['task', 'meeting', 'birthday', 'deadline', 'other']);
export const periodEnum = defaultSchema.enum('recurring_period', ['annual', 'monthly', 'weekly', 'daily', 'custom', 'once']);
export const intervalUnitEnum = defaultSchema.enum('interval_unit', ['hour', 'day', 'week', 'month', 'year']);

export const reminders = defaultSchema.table('reminders', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    
    // Date e ora
    reminderDate: timestamp('reminder_date').notNull(),
    reminderTime: timestamp('reminder_time').notNull(),
    endTime: timestamp('end_time'), // Fascia oraria (ora fine)

    isActive: boolean('is_active').default(true),
    
    // Configurazione ricorrenza
    isRecurring: boolean('is_recurring').default(false),
    recurringPeriod: periodEnum('recurring_period'),
    
    // Per ricorrenze personalizzate (es. ogni 3 mesi)
    customInterval: integer('custom_interval'), // Valore dell'intervallo (es. 3)
    intervalUnit: intervalUnitEnum('interval_unit'), // Unità dell'intervallo (es. 'month')
    
    // Date di inizio e fine della ricorrenza
    recurringStartDate: timestamp('recurring_start_date'), // Data di inizio della ricorrenza
    recurringEndDate: timestamp('recurring_end_date'), // Data di fine della ricorrenza (opzionale)
    
    // Metadati e categorizzazione
    reminderType: typeEnum('reminder_type').notNull().default('task'),
    reminderStatus: statusEnum('reminder_status').notNull().default('pending'),
    categoryId: integer('category_id').notNull().references(() => categories.id),
    priority: priorityEnum('priority').notNull().default('medium'),
    
    // Relazione con l'utente
    userId: integer('user_id').notNull().references(() => users.id),
    
    // Configurazione notifiche
    notifyBefore: integer('notify_before'), // Minuti prima per la notifica
    notificationSent: boolean('notification_sent').default(false),
    
    // Altri metadati utili
    notes: text('notes'),
    locationText: text('location_text'),
    
    // Tracking delle occorrenze
    lastOccurrenceDate: timestamp('last_occurrence_date'), // Data dell'ultima occorrenza completata
    nextOccurrenceDate: timestamp('next_occurrence_date'), // Data della prossima occorrenza prevista
    
    // Campi timestamp standard
    ...timestamps,
});