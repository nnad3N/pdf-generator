import "server-only";

import { headers } from "next/headers";
import { cache } from "react";

import { appRouter, createCaller } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { createServerSideHelpers } from "@trpc/react-query/server";
import SuperJSON from "superjson";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(() => {
  const _headers = new Headers(headers());
  _headers.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: _headers,
  });
});

// This will be replaced by hydration helpers from tRPC in the future

export const getServerSideHelpers = async () =>
  createServerSideHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: SuperJSON,
  });

export const api = createCaller(createContext);
