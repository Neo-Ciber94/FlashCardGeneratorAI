import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

interface AmplifySecrets {
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
}

const secrets = process.env.secrets == null ?
    null :
    JSON.parse(process.env.secrets) as AmplifySecrets

let BASE_CLIENT: DynamoDBClient;

if (secrets) {
    BASE_CLIENT = new DynamoDBClient({
        credentials: {
            accessKeyId: secrets.AWS_ACCESS_KEY_ID,
            secretAccessKey: secrets.AWS_SECRET_ACCESS_KEY
        }
    });
} else {
    BASE_CLIENT = new DynamoDBClient({});
}

export const dynamoDb = DynamoDBDocument.from(BASE_CLIENT);