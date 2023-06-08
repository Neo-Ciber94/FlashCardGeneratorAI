import "@/lib/awsConfig";
import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from "@aws-amplify/ui-react";

export default function Page() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main className="p-10">
          {user && <h1>Hello {user.username}</h1>}
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}
