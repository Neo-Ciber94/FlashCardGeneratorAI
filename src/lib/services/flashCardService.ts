import { CreateFlashCardModel, FlashCardModel, UpdateFlashCardModel, createFlashCardModel, updateFlashCardModel } from "../models/flashcard";
import { dynamoDb } from "../aws/dynamodb";
import { ServerError } from "../utils/error";
import crypto from 'crypto';
import { TopicModel } from "../models/topic";
import { TopicService } from "./topicService";
import { OpenAIApi, Configuration as OpenAIConfiguration, CreateChatCompletionRequest } from "openai";
import { PASTEL_COLORS } from "../common/constants";
import { GenerateFlashCardModel } from "../models/generate";

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

        // FIXME: We are doing two operations to update, we need to rethink the keys

        await dynamoDb.delete({
            Key: { ownerId: userId, lastModified: flashCardToUpdate.lastModified },
            TableName: process.env.FLASHCARD_TABLE_NAME
        })

        await dynamoDb.put({
            Item: item,
            TableName: process.env.FLASHCARD_TABLE_NAME,
        });

        return item;
    }

    async generateFlashCards(userId: string, input: GenerateFlashCardModel, options?: { signal?: AbortSignal }) {
        const ERROR_RESPONSE = "[failed to generate]";
        const openAiConfig = new OpenAIConfiguration({
            apiKey: process.env.OPENAI_API_KEY
        })

        const openAi = new OpenAIApi(openAiConfig);
        const request: CreateChatCompletionRequest = {
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `You are a assistant that creates flashcards, keep your answer just as json.
                    If unable to process a request response only with: ${ERROR_RESPONSE}`
                },
                {
                    role: 'user',
                    content: `Create a JSON array of maximum 5 unique flashcards with the properties: title (string), and content (string) using the next text: ${input.text}`
                }
            ]
        }

        const response = await openAi.createChatCompletion(request, { signal: options?.signal });
        const createChatCompletionResponse = response.data;
        console.log("response", createChatCompletionResponse);
        const message = createChatCompletionResponse.choices[0].message;

        if (message == null || message.content == null || message.content.trim() === ERROR_RESPONSE) {
            throw new ServerError("BAD_REQUEST", "Failed to create flashcards")
        }

        const json = JSON.parse(message.content) as Pick<FlashCardModel, 'title' | 'content'>[];
        const flashCards: FlashCardModel[] = json.map(card => {
            return {
                id: crypto.randomUUID(),
                color: getRandomFlashCardColor(),
                title: card.title,
                content: card.content,
                topicId: input.topicId,
                ownerId: userId,
                lastModified: Date.now(),
                isAiGenerated: true
            }
        });

        const requests = flashCards.map(flashCard => ({ PutRequest: { Item: flashCard } }))
        await dynamoDb.batchWrite({
            RequestItems: {
                [process.env.FLASHCARD_TABLE_NAME]: requests
            }
        });

        return flashCards;
    }
}

function getRandomFlashCardColor(): string {
    const idx = Math.floor(Math.random() * PASTEL_COLORS.length);
    return PASTEL_COLORS[idx];
}