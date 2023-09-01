import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { headers } from "next/headers";
import { TRPCReactProvider } from "./providers";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "PDF Generator",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={["font-sans", fontSans.variable].join(" ")}>
        <TRPCReactProvider headers={headers()}>
          <div className="flex h-screen">
            <nav className="h-full w-64 bg-red-500"></nav>

            {props.children}
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
