
import { NextApiRequest, NextApiResponse } from "next";
import { withSSRContext } from "aws-amplify";
import type { Auth } from '@aws-amplify/auth';
import { FlashcardService } from "@/lib/services/flashCardService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const amplifyContext = withSSRContext({ req });
    const auth = amplifyContext.Auth as typeof Auth;
    const user = await auth.currentAuthenticatedUser();
    const userName = user?.username;

    if (userName == null) {
        return res.status(403).end();
    }

    const service = new FlashcardService();
    const id = req.query.id;
    const topicId = req.query.topicId;

    if (typeof id !== 'string' || typeof topicId !== 'string') {
        return res.status(429).end();
    }

    try {
        switch (req.method) {
            case 'DELETE': {
                const result = await service.delete(userName, topicId, id);
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