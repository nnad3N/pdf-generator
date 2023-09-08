import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { headers } from "next/headers";
import { TRPCReactProvider, ThemeProvider } from "@/app/providers";
import Navigation from "@/components/Navigation";
import { auth, getPageSession } from "@/server/auth";
import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "PDF Generator",
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const session = await getPageSession();

  if (session?.user.isDeactivated) {
    await auth.invalidateAllUserSessions(session.user.userId);
    redirect("/");
  }

  return (
    <html suppressHydrationWarning lang="en">
      <body className={["font-sans", fontSans.variable].join(" ")}>
        <TRPCReactProvider headers={headers()}>
          <ThemeProvider
            attribute="data-theme"
            enableSystem
            defaultTheme="system"
          >
            <div className="flex h-screen">
              {session && <Navigation user={session.user} />}
              <main className="flex h-full w-full items-center justify-center p-8">
                {session ? props.children : <LoginForm />}
              </main>
            </div>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
