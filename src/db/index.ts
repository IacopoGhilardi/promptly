import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import Redis from 'ioredis';
import { logger } from '../utils/logger';

logger.info({ DATABASE_URL: process.env.DATABASE_URL }, 'Database URL');

const db = drizzle({ connection: process.env.DATABASE_URL, casing: 'snake_case' });

async function pingDb() {
    return await db.execute('select 1');
}

const redisConnection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export default {
    db,
    pingDb,
    redisConnection,
};