import { CreateFlashCardModel, FlashCardModel, UpdateFlashCardModel, createFlashCardModel, updateFlashCardModel } from "../models/flashcard";
import { dynamoDb } from "../aws/dynamodb";
import { ServerError } from "../utils/error";
import crypto from 'crypto';
import { TopicModel } from "../models/topic";
import { TopicService } from "./topicService";

export class FlashcardService {
    async getAll(topicId: string, userId: string): Promise<{ flashCards: FlashCardModel[], topic: TopicModel }> {
        const topicService = new TopicService();
        const topic = await topicService.getById(topicId, userId);

        if (topic == null) {
            throw new ServerError("NOT_FOUND");
        }

        const result = await dynamoDb.query({
            TableName: process.env.FLASHCARD_TABLE_NAME,
            KeyConditionExpression: "ownerId = :userId",
            FilterExpression: "topicId = :topicId",
            ExpressionAttributeValues: {
                ":userId": userId,
                ":topicId": topicId
            }
        });

        const flashCards = result.Items as unknown as FlashCardModel[];
        return { flashCards, topic }
    }

    async getById(topicId: string, flashCardId: string, userId: string): Promise<FlashCardModel | null> {
        const result = await dynamoDb.query({
            TableName: process.env.FLASHCARD_TABLE_NAME,
            IndexName: "flashCardIdIndex",
            KeyConditionExpression: "id = :id",
            FilterExpression: "topicId = :topicId and ownerId = :userId",
            ExpressionAttributeValues: {
                ':id': flashCardId,
                ':topicId': topicId,
                ':userId': userId
            }
        })

        if (result.Items == null || result.Items.length == 0) {
            return null;
        }

        return result.Items[0] as FlashCardModel;
    }

    async create(createInput: CreateFlashCardModel, userId: string): Promise<FlashCardModel> {
        const parsed = createFlashCardModel.safeParse(createInput);

        if (parsed.success === false) {
            throw new ServerError("BAD_REQUEST", parsed.error.message);
        }

        const { data } = parsed;
        const item: FlashCardModel = {
            id: crypto.randomUUID(),
            color: data.color,
            title: data.title,
            content: data.content,
            topicId: data.topicId,
            ownerId: userId,
            lastModified: Date.now(),
            isAiGenerated: false
        }

        await dynamoDb.put({
            TableName: process.env.FLASHCARD_TABLE_NAME,
            Item: item
        })

        return item;
    }

    async update(updateInput: UpdateFlashCardModel, userId: string): Promise<FlashCardModel> {
        const result = updateFlashCardModel.safeParse(updateInput);

        if (result.success === false) {
            throw new ServerError('BAD_REQUEST', result.error.message)
        }

        const flashCardToUpdate = await this.getById(result.data.topicId, result.data.id, userId);

        if (flashCardToUpdate == null || flashCardToUpdate.ownerId != userId) {
            throw new ServerError('NOT_FOUND')
        }

        const { data } = result;
        const item: FlashCardModel = {
            ...data,
            ownerId: userId,
            isAiGenerated: flashCardToUpdate.isAiGenerated,
            lastModified: Date.now()
        };

        await dynamoDb.put({
            Item: item,
            TableName: process.env.FLASHCARD_TABLE_NAME,
        });

        return item;
    }
}