import type { Metadata } from "next";
import { Montserrat, Roboto } from "next/font/google";
import "./globals.css";
import NavBar from "./nav-bar";
import { Context } from "./context";
import clsx from "clsx";
import { CONSTS } from "@/utils/constants";
import { ClerkProvider } from "@clerk/nextjs";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["100", "300", "400", "500", "700", "900"],
});
const monteserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-monteserrat",
});

const fontVars = [roboto.variable, monteserrat.variable].join(" ");

export const metadata: Metadata = {
  title: CONSTS.TITLE,
  description: CONSTS.DESCRIPTION,
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={fontVars}>
        <body className="font-monteserrat">
          <Context>
            <NavBar />
            <main className={clsx("lg:px-24 sm:px-10 p-6", "py-24")}>
              {children}
            </main>
          </Context>
        </body>
      </html>
    </ClerkProvider>
  );
}
