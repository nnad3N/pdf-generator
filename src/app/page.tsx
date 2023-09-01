"use client";

import { api } from "@/utils/api";

export default function Home() {
  const [data] = api.example.hello.useSuspenseQuery({ text: "from tRPC" });

  return <p className="text-2xl">{data.greeting}</p>;
}
