import { QueueCreateDto } from "../../services/queue.service";
import { QUEUE_STATUS, QUEUE_TYPE } from "../models/queue";

export class QueueMapper {

    static toCreateQueueDto = (
        queueName: string,
        queueType: string,
        queueStatus: string,
        queueData: any,
    ): QueueCreateDto => {
        return {
            queueName,
            queueType,
            queueStatus,
            queueData,
        };
    }
}