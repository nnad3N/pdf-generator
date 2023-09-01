"use client";

import { api } from "@/utils/api";

export default function Page() {
  const [data] = api.example.hello.useSuspenseQuery({ text: "from tRPC" });

  return <p className="text-2xl">{data.greeting}</p>;
}
