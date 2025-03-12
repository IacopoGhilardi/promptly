import { pgTable, serial, text, boolean, pgEnum, timestamp, integer, uuid, jsonb } from 'drizzle-orm/pg-core';
import { timestamps } from '../db/helpers/columns';
import { users } from './users';
import { categories } from './categories';
export const priorityEnum = pgEnum('reminder_priority', ['low', 'medium', 'high', 'urgent']);
export const statusEnum = pgEnum('reminder_status', ['pending', 'completed', 'missed', 'cancelled']);
export const typeEnum = pgEnum('reminder_type', ['task', 'meeting', 'birthday', 'deadline', 'other']);
export const periodEnum = pgEnum('recurring_period', ['annual', 'monthly', 'weekly', 'daily', 'custom', 'once']);
export const intervalUnitEnum = pgEnum('interval_unit', ['hour', 'day', 'week', 'month', 'year']);

export const reminders = pgTable('reminders', {
    id: serial('id').primaryKey(),
    title: text().notNull(),
    description: text().notNull(),
    
    // Date e ora
    reminderDate: timestamp().notNull(),
    reminderTime: timestamp().notNull(),
    endTime: timestamp(), // Fascia oraria (ora fine)
    
    // Configurazione ricorrenza
    isRecurring: boolean().default(false),
    recurringPeriod: periodEnum(),
    
    // Per ricorrenze personalizzate (es. ogni 3 mesi)
    customInterval: integer(), // Valore dell'intervallo (es. 3)
    intervalUnit: intervalUnitEnum(), // Unità dell'intervallo (es. 'month')
    
    // Date di inizio e fine della ricorrenza
    recurringStartDate: timestamp(), // Data di inizio della ricorrenza
    recurringEndDate: timestamp(), // Data di fine della ricorrenza (opzionale)
    
    // Metadati e categorizzazione
    reminderType: typeEnum().notNull().default('task'),
    reminderStatus: statusEnum().notNull().default('pending'),
    categoryId: integer('category_id').notNull().references(() => categories.id),
    priority: priorityEnum().notNull().default('medium'),
    
    // Relazione con l'utente
    userId: integer('user_id').notNull().references(() => users.id),
    
    // Configurazione notifiche
    notifyBefore: integer(), // Minuti prima per la notifica
    notificationSent: boolean().default(false),
    
    // Altri metadati utili
    notes: text(),
    locationText: text(),
    
    // Tracking delle occorrenze
    lastOccurrenceDate: timestamp(), // Data dell'ultima occorrenza completata
    nextOccurrenceDate: timestamp(), // Data della prossima occorrenza prevista
    
    // Campi timestamp standard
    ...timestamps,
});