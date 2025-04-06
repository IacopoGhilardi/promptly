import { queueJobs } from '../../models/queueJob';
import { BaseRepository } from './base.repository';
import dbConfig from '../index';
import { queues } from '../../models/queue';

export class QueueRepository extends BaseRepository<typeof queues> {
  constructor() {
    super(dbConfig.db, queues, 'queues');
  }
}

export const queueRepository = new QueueRepository();