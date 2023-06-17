import Redirect from "@/lib/components/Redirect";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";

export default function AuthPage() {
  const { user, authStatus } = useAuthenticator((ctx) => [ctx.user]);
  console.log({ user, authStatus });

  if (authStatus === "configuring") {
    return "Loading...";
  }

  if (authStatus === "authenticated") {
    return <Redirect to="/" />;
  }

  return <Authenticator socialProviders={["google"]} />;
  // return <Redirect to="/" />;
}
