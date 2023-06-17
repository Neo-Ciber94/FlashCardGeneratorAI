import { PAGE_TITLE } from "@/lib/common/constants";
import Redirect from "@/lib/components/Redirect";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import Head from "next/head";

export default function LoginPage() {
  const { user, authStatus } = useAuthenticator((context) => [context.user]);

  return (
    <>
      <Head>
        <title>{`${PAGE_TITLE} | Login`}</title>
      </Head>

      <div className="py-8">
        {authStatus === "authenticated" ? (
          <Redirect to="/" />
        ) : (
          <Authenticator socialProviders={["google"]} />
        )}
        {/* <Authenticator socialProviders={["google"]} /> */}
      </div>
    </>
  );
}
