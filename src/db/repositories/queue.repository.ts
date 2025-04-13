import { BaseRepository } from './base.repository';
import dbConfig from '../index';
import { queues } from '../../models/queue';
import { eq } from 'drizzle-orm';

export class QueueRepository extends BaseRepository<typeof queues> {
  constructor() {
    super(dbConfig.db, queues, 'queues', dbConfig.redisConnection);
  }

  async findInRedis(name: string) {
    const queueKey = `bull:${name}`;
    const queueData = await this.redisConnection.hgetall(`${queueKey}:meta`);
    
    if (Object.keys(queueData).length === 0) {
      return null;
    }
    
    return queueData;
  }

  async findByName(queueName: string) {
    return await this.db.select().from(this.table).where(eq(this.table.name, queueName));
  }

  async createInRedis(queueName: string, queueData: any) {
    const queueKey = `bull:${queueName}`;
    await this.redisConnection.hset(`${queueKey}:meta`, queueData);
  }

  async updateInRedis(queueName: string, queueData: any) {
    const queueKey = `bull:${queueName}`;
    await this.redisConnection.hset(`${queueKey}:meta`, queueData);
  }

  async deleteInRedis(queueName: string) {
    const queueKey = `bull:${queueName}`;
    await this.redisConnection.del(queueKey);
  }
}

export const queueRepository = new QueueRepository();