import { Queue } from "bullmq";
import db from "../src/db";
import { queueRepository } from "../src/db/repositories/queue.repository";
import { logger } from "../src/utils/logger";

export interface QueueCreateDto {
    queueName: string;
    queueType: string;
    queueStatus: string;
    queueData: any;
}

export class QueueService {
    async createQueue(queue: QueueCreateDto) {
        await queueRepository.create(queue);
    }

    async getQueueFromDb(queueId: number) {
        return await queueRepository.findById(queueId);
    }

    async getQueueFromRedis(queueName: string) {
        return await queueRepository.findInRedis(queueName);
    }

    async addQueueToRedis(queueName: string, queueData: any) {
        logger.info({ queueName, queueData }, 'Adding queue to Redis');
        new Queue(queueName, {
            connection: db.redisConnection,
        });

        logger.info({ queueName, queueData }, 'Queue added to Redis');
    }

    async updateQueue(queueId: number, queue: QueueCreateDto) {
        await queueRepository.update(queueId, queue);
    }

    async deleteQueue(queueId: number) {
        await queueRepository.delete(queueId);
    }

    async getQueues() {
        return await queueRepository.findAll();
    }
}

export const queueService = new QueueService();