import { PropsWithChildren } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Montserrat } from "next/font/google";

export const globalFont = Montserrat({
  weight: ["400"],
  subsets: ["latin"],
});

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className={`flex flex-col justify-between min-h-screen ${globalFont.className}`}>
      <Header />
      <main className="container h-full mx-auto flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
