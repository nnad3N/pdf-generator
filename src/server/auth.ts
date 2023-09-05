import { env } from "@/env.mjs";
import { sealData, type IronSessionData, unsealData } from "iron-session";
import { cookies } from "next/headers";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: string;
      isAdmin: boolean;
      isDeactivated: boolean;
    };
  }
}

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

export const getServerActionSession = async () => {
  return await unsealData<IronSessionData>(
    cookies().get(env.IRON_SESSION_COOKIE_NAME)?.value ?? "",
    {
      password: env.IRON_SESSION_PASSWORD,
    },
  );
};
