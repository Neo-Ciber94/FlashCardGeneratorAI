import { PAGE_TITLE } from "@/lib/common/constants";
import Redirect from "@/lib/components/Redirect";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import Head from "next/head";

export default function LoginPage() {
  const { user } = useAuthenticator((context) => [context.user]);

  return (
    <>
      <Head>
        <title>{`${PAGE_TITLE} | Login`}</title>
      </Head>

      <div className="py-8">
        {user ? (
          <Redirect to="/" />
        ) : (
          <Authenticator socialProviders={["google"]} />
        )}
      </div>
    </>
  );
}
