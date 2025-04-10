import { queueJobs } from '../../models/queueJob';
import { BaseRepository } from './base.repository';
import dbConfig from '../index';

export class QueueJobRepository extends BaseRepository<typeof queueJobs> {
  constructor() {
    super(dbConfig.db, queueJobs, 'queue_job', dbConfig.redisConnection);
  }
}

export const queueJobRepository = new QueueJobRepository();