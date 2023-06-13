import { CreateFlashCardModel, FlashCardModel, createFlashCardModel } from "../models/flashcard";
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
}