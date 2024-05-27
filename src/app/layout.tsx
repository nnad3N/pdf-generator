import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Navigation from "@/components/Navigation";
import { getCachedUser } from "@/server/cache";
import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "sonner";
import SignIn from "@/components/SignIn";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "PDF Generator",
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const user = await getCachedUser();

  return (
    <html suppressHydrationWarning lang="en" className={GeistSans.className}>
      <body>
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            <TooltipProvider delayDuration={100}>
              <div className="flex h-screen">
                {user && <Navigation user={user} />}
                <main className="flex h-full w-full items-center justify-center p-8">
                  {user ? props.children : <SignIn />}
                </main>
              </div>
            </TooltipProvider>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
