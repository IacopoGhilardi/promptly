import { queueRepository } from "../src/db/repositories/queue.repository";
import { queueJobRepository } from "../src/db/repositories/queueJob.repository";

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

    async getQueue(queueId: number) {
        return await queueRepository.findById(queueId);
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