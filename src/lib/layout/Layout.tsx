import { PropsWithChildren } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Montserrat } from "next/font/google";
import { useAuthenticator } from "@aws-amplify/ui-react";
import Redirect from "../components/Redirect";
import { useRouter } from "next/router";
import LoadingIndicator from "../components/LoadingIndicator";

export const globalFont = Montserrat({
  weight: ["400"],
  subsets: ["latin"],
});

export default function Layout({ children }: PropsWithChildren) {
  const { user, authStatus } = useAuthenticator((context) => [context.user]);
  const router = useRouter();

  const Component = () => {
    if (authStatus === "configuring") {
      return <LoadingIndicator />;
    }

    return user || canByPassAuth(router.pathname) ? (
      <>{children}</>
    ) : (
      <Redirect to="/login" />
    );
  };

  return (
    <div
      className={`flex min-h-screen flex-col justify-between ${globalFont.className}`}
    >
      <Header />
      <main className="container mx-auto h-full flex-grow">
        <Component />
      </main>
      <Footer />
    </div>
  );
}

function canByPassAuth(pathname: string) {
  if (pathname === "/login" || pathname.startsWith("/auth")) {
    return true;
  }

  return false;
}
