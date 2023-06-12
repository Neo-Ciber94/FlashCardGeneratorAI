import { CreateTopicModel, TopicModel, createTopicModel } from "../models/topic";
import crypto from 'crypto';
import { ServerError } from "../utils/error";
import { dynamoDb } from "../aws/dynamodb";

export class TopicService {
    async getAll(): Promise<TopicModel[]> {
        const result = await dynamoDb.scan({ TableName: process.env.TOPIC_TABLE_NAME })
        return result.Items as unknown as TopicModel[];
    }

    async create(input: CreateTopicModel, userId: string): Promise<TopicModel> {
        const result = createTopicModel.safeParse(input);

        if (result.success === false) {
            throw new ServerError('BAD_REQUEST', result.error.message)
        }

        const data: TopicModel = {
            id: crypto.randomUUID(),
            name: result.data.name,
            lastModified: new Date().getTime(),
            owner: userId
        };

        await dynamoDb.put({
            Item: data,
            TableName: process.env.TOPIC_TABLE_NAME,
        });

        return data;
    }
}

