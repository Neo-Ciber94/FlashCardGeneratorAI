import Redirect from "@/lib/components/Redirect";
import { useAuthenticator } from "@aws-amplify/ui-react";

export default function AuthPage() {
  const { user, isPending, authStatus } = useAuthenticator((ctx) => [ctx.user]);
  console.log({ user, isPending, authStatus });

  if (authStatus === "configuring") {
    return "Loading...";
  }

  return <Redirect to="/" />;
}
