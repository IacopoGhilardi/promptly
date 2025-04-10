import { BaseRepository } from './base.repository';
import dbConfig from '../index';
import { queues } from '../../models/queue';

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
}

export const queueRepository = new QueueRepository();