import { FlashCardModel } from "../models/flashcard";
import { dynamoDb } from "../aws/dynamodb";

export class FlashcardService {
    async getAll(): Promise<FlashCardModel[]> {
        const result = await dynamoDb.scan({ TableName: process.env.FLASHCARD_TABLE_NAME });
        return result.Items as unknown as FlashCardModel[];
    }
}