import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";

import { ThemeProvider } from "@/app/providers";
import Navigation from "@/components/Navigation";
import LoginForm from "@/components/LoginForm";
import { getCachedUser } from "@/server/cache";
import { TRPCReactProvider } from "@/trpc/react";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "PDF Generator",
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const user = await getCachedUser();

  if (user?.isDeactivated) {
    redirect("/login");
  }

  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${GeistSans.variable}`}
    >
      <body>
        <TRPCReactProvider>
          <ThemeProvider
            attribute="data-theme"
            enableSystem
            defaultTheme="system"
          >
            <div className="flex h-screen">
              {user && <Navigation user={user} />}
              <main className="flex h-full w-full items-center justify-center p-8">
                {user ? props.children : <LoginForm />}
              </main>
            </div>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
