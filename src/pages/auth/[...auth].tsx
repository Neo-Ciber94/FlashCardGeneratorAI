import Redirect from "@/lib/components/Redirect";
import { useAuthenticator } from "@aws-amplify/ui-react";

export default function AuthPage() {
  const { user } = useAuthenticator((ctx) => [ctx.user]);
  console.log({ user });

  return <Redirect to="/" />;
}
