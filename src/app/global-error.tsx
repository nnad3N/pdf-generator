"use client";

import { useEffect } from "react";
import { ArrowPathIcon } from "@heroicons/react/20/solid";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-semibold">Something went wrong!</h2>
      <button className="btn btn-accent btn-outline" onClick={reset}>
        Reload
        <ArrowPathIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
