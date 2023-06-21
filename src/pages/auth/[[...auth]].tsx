import LoadingIndicator from "@/lib/components/LoadingIndicator";
import Redirect from "@/lib/components/Redirect";
import { useAuthenticator } from "@aws-amplify/ui-react";

export default function AuthPage() {
  const { authStatus } = useAuthenticator((ctx) => [ctx.user]);

  if (authStatus === "configuring") {
    return <LoadingIndicator />;
  }

  return authStatus === "authenticated" ? (
    <Redirect to="/topics" />
  ) : (
    <Redirect to="/login" />
  );
}
