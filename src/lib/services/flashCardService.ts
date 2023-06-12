import { FlashCardModel } from "../models/flashcard";
import { dynamoDb } from "../aws/dynamodb";

export class FlashcardService {
    async getAll(userId: string): Promise<FlashCardModel[]> {
        const result = await dynamoDb.query({
            TableName: process.env.FLASHCARD_TABLE_NAME,
            FilterExpression: "ownerId = :userId",
            ExpressionAttributeValues: {
                ":userId": userId
            }
        });
        return result.Items as unknown as FlashCardModel[];
    }
}