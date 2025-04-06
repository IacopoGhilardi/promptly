import { queueJobRepository, QueueJobRepository } from "../src/db/repositories/queueJob.repository";

export interface QueueJobCreateDto {
    queueName: string;
    jobName: string;
    data: any;
    status: string;
    type: string;
    queueId: number;
}

export class QueueJobService {
    async createQueueJob(queueJob: QueueJobCreateDto) {
        await queueJobRepository.create(queueJob);
    }
}