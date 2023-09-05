import { env } from "@/env.mjs";
import { sealData, type IronSessionData } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: string;
      isAdmin: boolean;
      isDeactivated: boolean;
    };
  }
}

export const destroyServerActionSession = () => {
  cookies().delete(env.IRON_SESSION_COOKIE_NAME);
  redirect("/login");
};

export const saveServerActionSession = async (data: IronSessionData) => {
  const sealedData = await sealData(data, {
    password: env.IRON_SESSION_PASSWORD,
  });

  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() + 1);

  cookies().set(env.IRON_SESSION_COOKIE_NAME, sealedData, {
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    httpOnly: true,
    expires: currentDate.getTime(), // one month from now
    path: "/",
  });
};
