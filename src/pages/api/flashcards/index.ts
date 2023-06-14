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