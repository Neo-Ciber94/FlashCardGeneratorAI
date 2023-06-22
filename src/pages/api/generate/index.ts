import { generateFlashCardModel } from "@/lib/models/generate";
import { FlashcardService } from "@/lib/services/flashCardService";
import { NextApiRequest, NextApiResponse } from "next";
import { ServerError } from "@/lib/utils/error";
import { getUserFromRequest } from "@/lib/utils/getUserFromRequest";

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
            console.log("Generate FlashCard request aborted");
        })

        const user = await getUserFromRequest(req);
        const userName = user?.username;

        if (userName == null) {
            return res.status(401).end();
        }

        const service = new FlashcardService();
        const { data } = input;
        const result = await service.generateFlashCards(userName, data, { signal: abortController.signal });
        return res.status(200).json(result);
    }
    catch (err) {
        console.error(err);
        if (err instanceof ServerError) {
            const serverError = err as ServerError;
            return res.status(serverError.statusCode).send(serverError.message);
        }

        return res.status(500).end();
    }
}