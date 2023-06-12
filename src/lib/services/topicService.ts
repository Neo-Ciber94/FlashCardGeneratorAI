import { CreateTopicModel, TopicModel, UpdateTopicModel, createTopicModel, updateTopicModel } from "../models/topic";
import crypto from 'crypto';
import { ServerError } from "../utils/error";
import { dynamoDb } from "../aws/dynamodb";

export class TopicService {
    async getAll(userId: string): Promise<TopicModel[]> {
        const result = await dynamoDb.query({
            TableName: process.env.TOPIC_TABLE_NAME,
            KeyConditionExpression: "ownerId = :userId",
            ExpressionAttributeValues: { ":userId": userId }
        })

        return result.Items as unknown as TopicModel[];
    }

    async getById(id: string, userId: string): Promise<TopicModel | null> {
        const result = await dynamoDb.query({
            TableName: process.env.TOPIC_TABLE_NAME,
            Limit: 1,
            FilterExpression: "id = :id AND ownerId = :userId",
            ExpressionAttributeValues: {
                ':id': id,
                ':ownerId': userId
            }
        })

        if (result.Items == null || result.Items.length === 0) {
            return null;
        }

        return result.Items[0] as TopicModel;
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

        const topicToUpdate = await this.getById(input.id, userId);

        if (topicToUpdate == null || topicToUpdate.ownerId != userId) {
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

        const item = await this.getById(id, userId);

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

