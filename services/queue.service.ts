import { Queue } from "bullmq";
import db from "../src/db";
import { queueRepository } from "../src/db/repositories/queue.repository";
import { logger } from "../src/utils/logger";
import { BASE_QUEUES } from "../src/models/queue";
import { QueueMapper } from "../src/mappers/queue.mapper";

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

    async getQueueFromDbByName(queueName: string) {
        return await queueRepository.findByName(queueName);
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

    async setupInitialQueues() {
        for (const queue of BASE_QUEUES) {
            const queueFromDb = await this.getQueueFromDbByName(queue.queueName);
            if (!queueFromDb) {
                await this.createQueue(QueueMapper.toCreateQueueDto(queue.queueName, queue.queueType, queue.queueStatus, {}));
            }

            const queueFromRedis = await this.getQueueFromRedis(queue.queueName);
            if (!queueFromRedis) {
                await this.addQueueToRedis(queue.queueName, {});
            }
        }
    }
}

export const queueService = new QueueService();