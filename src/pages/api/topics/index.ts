
import { TopicService } from "@/lib/services/topicService";
import { NextApiRequest, NextApiResponse } from "next";
import { getUserFromRequest } from "@/lib/utils/getUserFromRequest";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user = await getUserFromRequest(req);
    const userName = user?.username;

    if (userName == null) {
        return res.status(403).end();
    }

    const service = new TopicService();

    try {
        switch (req.method) {
            case 'POST': {
                const input = JSON.parse(req.body);
                const result = await service.create(input, userName);
                res.send(result);
                break;
            }
            case 'PUT': {
                const input = JSON.parse(req.body);
                const result = await service.update(input, userName);
                res.send(result);
                break;
            }
            default:
                res.status(405).end()
                break;
        }
    } catch (e) {
        console.error(e);
        res.status(500).end();
    }
} 