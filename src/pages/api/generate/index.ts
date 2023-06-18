import { generateFlashCardModel } from "@/lib/models/generate";
import { FlashcardService } from "@/lib/services/flashCardService";
import { NextApiRequest, NextApiResponse } from "next";
import { withSSRContext } from "aws-amplify";
import type { Auth } from '@aws-amplify/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).end();
    }

    try {
        const input = generateFlashCardModel.safeParse(JSON.parse(req.body));
        if (input.success === false) {
            return res.status(400).json({
                message: input.error.message
            });
        }

        const abortController = new AbortController();
        req.on('close', () => {
            abortController.abort();
        })

        const amplifyContext = withSSRContext({ req });
        const auth = amplifyContext.Auth as typeof Auth;
        const user = await auth.currentAuthenticatedUser();
        const userName = user?.username;

        const service = new FlashcardService();
        const { data } = input;
        const result = service.generateFlashCards(userName, data, { signal: abortController.signal });
        return res.status(200).json(result);
    }
    catch (err) {
        console.error(err);
        return res.status(500);
    }
}