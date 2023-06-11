import Link from "next/link";
import { PAGE_TITLE } from "../common/constants";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/router";

export default function Header() {
  const { user, signOut, } = useAuthenticator((context) => [context.user]);
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
    router.push("/login");
  };

  return (
    <header className="h-20 p-2 flex-grow-0 flex-shrink-0 border-b border-gray-200 shadow flex flex-row items-center">
      <nav className="flex flex-row items-center justify-between px-5 w-full">
        <div className="flex flex-row items-center">
          <Link href="/">
            <span className="font-bold text-2xl mr-10 text-red-500">
              {PAGE_TITLE}
            </span>
          </Link>
        </div>
        <div className="font-bold text-red-500">
          {user ? (
            <button className="hover:text-red-600" onClick={handleSignOut}>
              Sign Out
            </button>
          ) : (
            <Link className="hover:text-red-600" href="/login">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
