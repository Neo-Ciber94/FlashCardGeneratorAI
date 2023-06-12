import { TopicService } from "@/lib/services/topicService";
import { NextApiRequest, NextApiResponse } from "next";
import { withSSRContext } from "aws-amplify";
import type { Auth } from '@aws-amplify/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const service = new TopicService();
    const amplifyContext = withSSRContext({ req });
    const auth = amplifyContext.Auth as typeof Auth;
    const user = await auth.currentAuthenticatedUser();
    const userName = user?.username;

    if (userName == null) {
        return res.status(403).end();
    }

    // TODO: Validate JWT token

    switch (req.method) {
        case 'POST': {
            const input = JSON.parse(req.body);
            const result = await service.create(input, userName);
            res.send(result);
            break;
        }
        default:
            res.status(405).end()
            break;
    }
} 