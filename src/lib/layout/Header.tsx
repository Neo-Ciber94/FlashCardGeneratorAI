import Link from "next/link";
import { PAGE_TITLE } from "../common/constants";

export default function Header() {
  return (
    <header className="h-20 p-2 flex-grow-0 flex-shrink-0 border-b border-gray-200 shadow flex flex-row items-center">
      <nav className="flex flex-row items-center px-5">
        <Link href="/">
          <span className="font-bold text-2xl mr-10 text-red-500">{PAGE_TITLE}</span>
        </Link>
      </nav>
    </header>
  );
}
