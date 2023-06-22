
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
    const id = req.query.id;

    if (typeof id !== 'string') {
        return res.status(429).end();
    }

    try {
        switch (req.method) {
            case 'DELETE': {
                const result = await service.delete(id, userName);
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