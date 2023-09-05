export const runtime = "nodejs";

import { env } from "@/env.mjs";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

function setCorsHeaders(res: Response) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Request-Method", "*");
  res.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  res.headers.set("Access-Control-Allow-Headers", "*");
}

export function OPTIONS() {
  const response = new Response(null, {
    status: 204,
  });
  setCorsHeaders(response);
  return response;
}

const handler = async (req: Request) => {
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    router: appRouter,
    req,
    createContext: createTRPCContext,
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
            );
          }
        : undefined,
  });

  setCorsHeaders(response);

  return response;
};

export { handler as GET, handler as POST };
