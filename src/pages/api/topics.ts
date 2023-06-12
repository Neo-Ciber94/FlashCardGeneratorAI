import { TopicService } from "@/lib/services/topicService";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const service = new TopicService();

    // TODO: Validate JWT token

    switch (req.method) {
        case 'POST': {
            const input = JSON.parse(req.body);
            const bearerToken = req.headers.authorization;

            if (bearerToken == null) {
                return res.status(403).end();
            }

            const token = bearerToken.slice("Bearer ".length);
            const payload = jwt.decode(token) as jwt.JwtPayload;
            const result = await service.create(input, payload.sub as string);
            res.send(result);
            break;
        }
        default:
            res.status(405).end()
            break;
    }
} 