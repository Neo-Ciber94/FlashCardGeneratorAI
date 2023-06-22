import { NextApiRequest, NextApiResponse } from "next";
import { ServerError } from "./error";
import { AuthenticatedUser, getUserFromRequest } from "./getUserFromRequest";

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';

export type NextApiContext<T extends any> = {
    req: NextApiRequest,
    res: NextApiResponse<T>,
    user?: AuthenticatedUser | null
}

export type ApiHandlerConfig = {
    [key in HttpMethod]?: (context: NextApiContext<unknown>) => unknown | Promise<unknown>;
};

export function createApiHandler(handlers: ApiHandlerConfig) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            const method = req.method?.toUpperCase() as HttpMethod;

            if (method == null) {
                return res.status(405).end();
            }

            const handler = handlers[method];

            if (handler == null) {
                return res.status(405).end();
            }

            const user = await getUserFromRequest(req);
            const context: NextApiContext<any> = { req, res, user }
            await handler(context);
        }
        catch (err) {
            console.error(err);
            if (err instanceof ServerError) {
                return err.message ?
                    res.status(err.statusCode).send(err.message) :
                    res.status(err.statusCode);
            }

            return res.status(500).end();
        }
    }
}