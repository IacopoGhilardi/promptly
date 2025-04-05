import { DEFAULT_QUEUE_OPTIONS } from "../utils/queue";
import { Queue } from "bullmq";

export class QueueService {
    private queues: Map<string, Queue> = new Map();

    async createQueue(queueName: string) {
        const queue = new Queue(queueName, DEFAULT_QUEUE_OPTIONS);
        this.queues.set(queueName, queue);
        return queue;
    }

    async getQueue(queueName: string) {
        return this.queues.get(queueName);
    }

    async getQueues() {
        return this.queues;
    }

    async getOrCreateQueue(queueName: string) {
        const queue = this.getQueue(queueName);
        if (!queue) {
            return this.createQueue(queueName);
        }
        return queue;
    }
}