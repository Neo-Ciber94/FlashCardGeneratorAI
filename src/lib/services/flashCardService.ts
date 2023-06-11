import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { FlashCardModel } from "../models/flashcard";

export class FlashcardService {
    private client = new DynamoDBClient({});

    async getAll() : Promise<FlashCardModel[]> {
        const command = new ScanCommand({
            TableName: process.env.FLASHCARD_TABLE_NAME
        });

        const result = await this.client.send(command);
        return result.Items as unknown as FlashCardModel[];
    }
}