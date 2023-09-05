import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { headers } from "next/headers";
import { TRPCReactProvider, ThemeProvider } from "./providers";
import Navigation from "@/components/Navigation";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "PDF Generator",
};

export default function RootLayout(props: { children: React.ReactNode }) {
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
              <Navigation />
              <main className="flex h-full w-full items-center justify-center p-8">
                {props.children}
              </main>
            </div>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
