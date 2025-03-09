import { pgTable, serial, text, uuid } from 'drizzle-orm/pg-core';
import { timestamps } from '../db/helpers/columns';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text().notNull(),
    email: text().notNull(),
    password: text().notNull(),
    publicId: uuid('public_id').notNull().unique(),
    ...timestamps,
});
