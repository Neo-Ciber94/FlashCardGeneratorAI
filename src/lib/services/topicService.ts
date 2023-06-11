import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { TopicModel } from "../models/topic";

export class TopicService {
    private client = new DynamoDBClient({});

    async getAll() : Promise<TopicModel[]> {
        const command = new ScanCommand({
            TableName: process.env.TOPIC_TABLE_NAME
        });

        const result = await this.client.send(command);
        return result.Items as unknown as TopicModel[];
    }
}

