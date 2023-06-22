
import { NextApiRequest } from "next";
import { withSSRContext } from "aws-amplify";
import type { Auth } from '@aws-amplify/auth';

type User = {
    username: string
}

export async function getUserFromRequest(req: NextApiRequest) {
    const amplifyContext = withSSRContext({ req });
    const auth = amplifyContext.Auth as typeof Auth;
    const user = await auth.currentAuthenticatedUser();
    return user as User | null;
}
