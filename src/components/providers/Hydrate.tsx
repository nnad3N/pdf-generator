import {
  HydrationBoundary,
  defaultShouldDehydrateQuery,
  dehydrate,
  type QueryClient,
} from "@tanstack/react-query";
import React from "react";

interface Props {
  queryClient: QueryClient;
}

const Hydrate: React.FC<React.PropsWithChildren<Props>> = ({
  queryClient,
  children,
}) => {
  return (
    <HydrationBoundary
      state={dehydrate(queryClient, {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      })}
    >
      {children}
    </HydrationBoundary>
  );
};

export default Hydrate;
