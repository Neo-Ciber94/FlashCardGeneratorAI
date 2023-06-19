import { CreateTopicModel, TopicModel, UpdateTopicModel, createTopicModel, updateTopicModel } from "../models/topic";
import crypto from 'crypto';
import { ServerError } from "../utils/error";
import { dynamoDb } from "../aws/dynamodb";

const OWNER_INDEX = "ownerId-Index";

export class TopicService {
    async getAll(userId: string): Promise<TopicModel[]> {
        const result = await dynamoDb.query({
            TableName: process.env.TOPIC_TABLE_NAME,
            IndexName: OWNER_INDEX,
            ScanIndexForward: true,
            KeyConditionExpression: "ownerId = :userId",
            ExpressionAttributeValues: { ":userId": userId }
        })

        return result.Items as unknown as TopicModel[];
    }

    async getById(id: string, userId: string): Promise<TopicModel | null> {
        const result = await dynamoDb.query({
            TableName: process.env.TOPIC_TABLE_NAME,
            IndexName: OWNER_INDEX,
            KeyConditionExpression: "ownerId = :userId",
            FilterExpression: "id = :id",
            ExpressionAttributeValues: {
                ':id': id,
                ':userId': userId
            }
        })

        if (result.Items == null || result.Items.length === 0) {
            return null;
        }

        return result.Items[0] as TopicModel;
    }

    async create(input: CreateTopicModel, userId: string): Promise<TopicModel> {
        const parsed = createTopicModel.safeParse(input);

        if (parsed.success === false) {
            throw new ServerError('BAD_REQUEST', parsed.error.message)
        }

        const { data } = parsed;

        const item: TopicModel = {
            id: crypto.randomUUID(),
            name: data.name,
            lastModified: Date.now(),
            ownerId: userId
        };

        await dynamoDb.put({
            Item: item,
            TableName: process.env.TOPIC_TABLE_NAME,
        });

        return item;
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

        // FIXME: We are doing two operations to update, we need to rethink the keys

        await dynamoDb.delete({
            Key: { id: topicToUpdate.id, lastModified: topicToUpdate.lastModified },
            TableName: process.env.TOPIC_TABLE_NAME
        })

        await dynamoDb.put({
            Item: data,
            TableName: process.env.TOPIC_TABLE_NAME,
        });

        return data;
    }

    async delete(id: string, userId: string): Promise<TopicModel> {
        const item = await this.getById(id, userId);

        if (item == null || item?.ownerId != userId) {
            throw new ServerError('NOT_FOUND')
        }

        await dynamoDb.delete({
            Key: { id: item.id, lastModified: item.lastModified },
            TableName: process.env.TOPIC_TABLE_NAME,
        });

        return item as TopicModel;
    }
}

