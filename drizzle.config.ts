import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
}

export default defineConfig({
    dialect: 'postgresql',
    schema: './src/models',
    out: './src/db/migrations',
    dbCredentials: {
        url: process.env.DATABASE_URL
    },
    migrations: {
        table: 'drizzle_migrations',
        schema: 'promptly',
    },
});