import SignIn from "./page.client";
import { getCachedUser } from "@/server/cache";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign In",
};

export default async function Page() {
  const user = await getCachedUser();

  if (user) {
    redirect("/");
  }

  return <SignIn />;
}
