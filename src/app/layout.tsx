import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Navigation from "@/components/Navigation";
import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Authenticated from "@/components/providers/Authenticated";

export const metadata: Metadata = {
  title: {
    default: "Page",
    template: "%s | PDF Generator",
  },
  robots: "noindex",
};

export default async function RootLayout(props: { children: React.ReactNode }) {
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
              <Authenticated>
                {({ user }) => (
                  <div className="flex h-screen">
                    <Navigation user={user} />
                    <main className="flex h-full w-full items-center justify-center p-8">
                      {props.children}
                    </main>
                  </div>
                )}
              </Authenticated>
            </TooltipProvider>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
