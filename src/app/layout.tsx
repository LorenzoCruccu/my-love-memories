import "~/styles/globals.css";
import { Inter as FontSans } from "next/font/google";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { cn } from "~/lib/utils";
import NextAuthProvider from "~/providers/next-auth-provider";
import { AlertDialogProvider } from "~/providers/alert-dialog-provider";
import { Toaster } from "~/components/ui/sonner";
import Menu from "./_components/site/menu";

export const metadata: Metadata = {
  title: "Hide and Hit",
  description: "Mark your favorite places, discover new ones!",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body
        className={cn(
          "bg-background min-h-screen font-sans antialiased",
          fontSans.variable,
        )}
      >
        <TRPCReactProvider>
          <NextAuthProvider>
            <AlertDialogProvider>
							<Toaster />
							<Menu />
							{children}
							</AlertDialogProvider>
          </NextAuthProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
