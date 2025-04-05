import { Queue } from 'bullmq';
import db from '../db';

const queue = new Queue('test', {
    connection: db.redisConnection,
});

export default queue;