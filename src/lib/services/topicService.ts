import { CreateTopicModel, TopicModel, UpdateTopicModel, createTopicModel, updateTopicModel } from "../models/topic";
import crypto from 'crypto';
import { ServerError } from "../utils/error";
import { dynamoDb } from "../aws/dynamodb";

export class TopicService {
    async getAll(userId: string): Promise<TopicModel[]> {
        const result = await dynamoDb.scan({
            TableName: process.env.TOPIC_TABLE_NAME,
            FilterExpression: "ownerId = :userId",
            ExpressionAttributeValues: { ":userId": userId }
        })

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
            lastModified: Date.now(),
            ownerId: userId
        };

        await dynamoDb.put({
            Item: data,
            TableName: process.env.TOPIC_TABLE_NAME,
        });

        return data;
    }

    async update(input: UpdateTopicModel, userId: string): Promise<TopicModel> {
        const result = updateTopicModel.safeParse(input);

        if (result.success === false) {
            throw new ServerError('BAD_REQUEST', result.error.message)
        }

        const topicToUpdate = await dynamoDb.get({
            Key: { id: input.id },
            TableName: process.env.TOPIC_TABLE_NAME,
        });

        const item = topicToUpdate.Item as TopicModel;

        if (item == null || item.ownerId != userId) {
            throw new ServerError('NOT_FOUND')
        }

        const data: TopicModel = {
            id: input.id,
            name: input.name,
            ownerId: userId,
            lastModified: Date.now()
        };

        await dynamoDb.put({
            Item: data,
            TableName: process.env.TOPIC_TABLE_NAME,
        });

        return data;
    }

    async delete(id: string, userId: string): Promise<TopicModel> {
        const topicToDelete = await dynamoDb.get({
            Key: { id },
            TableName: process.env.TOPIC_TABLE_NAME,
        });

        const item = topicToDelete.Item as TopicModel;

        if (item == null || item?.ownerId != userId) {
            throw new ServerError('NOT_FOUND')
        }

        await dynamoDb.delete({
            Key: { id },
            TableName: process.env.TOPIC_TABLE_NAME,
            ConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": userId
            }
        });

        return topicToDelete.Item as TopicModel;
    }
}

