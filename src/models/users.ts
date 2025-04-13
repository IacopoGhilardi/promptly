import { serial, text, uuid, varchar, boolean } from 'drizzle-orm/pg-core';
import { defaultSchema, timestamps } from '../db/helpers/columns';

const userPreferences = {
    emailNotifications: boolean('email_notifications').notNull().default(true),
    smsNotifications: boolean('sms_notifications').notNull().default(true),
    pushNotifications: boolean('push_notifications').notNull().default(true),
};

export const users = defaultSchema.table('users', {
    id: serial('id').primaryKey(),
    name: varchar({length: 50}).notNull(),
    email: varchar({length: 50}).notNull().unique(),
    password: text().notNull(),
    publicId: uuid('public_id').notNull().unique(),
    ...userPreferences,
    ...timestamps,
});