import Link from "next/link";
import { PAGE_TITLE } from "../common/constants";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/router";

export default function Header() {
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
    router.push("/login");
  };

  return (
    <header className="flex h-20 flex-shrink-0 flex-grow-0 flex-row items-center border-b border-gray-200 dark:border-white/20 p-2 shadow">
      <nav className="flex w-full flex-row items-center justify-between px-5">
        <div className="flex flex-row items-center">
          <Link href="/">
            <span className="mr-10 text-2xl font-bold text-red-500">
              {PAGE_TITLE}
            </span>
          </Link>
        </div>
        <div className="flex flex-row gap-5">
          {user && (
            <Link href="/topics" className="font-bold text-red-500 hover:underline underline-offset-4 hover:text-red-700">
              Topics
            </Link>
          )}

          <div className="font-bold text-red-500">
            {user ? (
              <button className="hover:underline underline-offset-4 hover:text-red-700" onClick={handleSignOut}>
                Sign Out
              </button>
            ) : (
              <Link className="hover:underline underline-offset-4 hover:text-red-700" href="/login">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
