import { FlashcardService } from "@/lib/services/flashCardService";
import { createApiHandler } from "@/lib/utils/createApiHandler";

export default createApiHandler({
    async POST({ req, res, user }) {
        const userName = user?.username;

        if (userName == null) {
            return res.status(403).end();
        }

        const service = new FlashcardService();
        const input = JSON.parse(req.body);
        const result = await service.create(input, userName);
        res.send(result);
    },
    async PUT({ req, res, user }) {
        const userName = user?.username;

        if (userName == null) {
            return res.status(403).end();
        }

        const service = new FlashcardService();
        const input = JSON.parse(req.body);
        const result = await service.update(input, userName);
        res.send(result);
    }
})