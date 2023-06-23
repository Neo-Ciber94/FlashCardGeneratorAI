import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

const BASE_CLIENT = new DynamoDBClient({});
export const dynamoDb = DynamoDBDocument.from(BASE_CLIENT);