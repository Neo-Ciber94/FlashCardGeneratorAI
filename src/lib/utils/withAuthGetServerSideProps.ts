import { GetServerSidePropsContext, GetServerSidePropsResult, PreviewData } from "next";
import { ParsedUrlQuery } from "querystring";
import { withSSRContext } from "aws-amplify";
import type { Auth } from "@aws-amplify/auth";

// FIXME: We don't have 
const NOT_AUTHENTICATED_ERROR = "The user is not authenticated";

type RawUser = { username: string, [key: string]: unknown }

type WithAuthGetServerSideProps<
    Props extends Record<string, unknown>,
    Params extends ParsedUrlQuery = ParsedUrlQuery,
    Preview extends PreviewData = PreviewData> =
    (user: RawUser, context: GetServerSidePropsContext<Params, Preview>) => Promise<GetServerSidePropsResult<Props>>

export function withAuthGetServerSideProps<
    Props extends Record<string, unknown>,
    Params extends ParsedUrlQuery = ParsedUrlQuery,
    Preview extends PreviewData = PreviewData>(getServerSideProps: WithAuthGetServerSideProps<Props, Params, Preview>) {
    return async (context: GetServerSidePropsContext<Params, Preview>): Promise<GetServerSidePropsResult<Props>> => {
        try {
            const amplifyContext = withSSRContext(context);
            const auth = amplifyContext.Auth as typeof Auth;
            const user = await auth.currentAuthenticatedUser();

            return await getServerSideProps(user, context);
        } catch (err) {

            if (err === NOT_AUTHENTICATED_ERROR) {
                console.error(err);
                return {
                    redirect: {
                        destination: "/login",
                        permanent: false
                    }
                }
            }

            throw err;
        }
    }
}

// withAuthGetServerSideProps((ctx) => {})