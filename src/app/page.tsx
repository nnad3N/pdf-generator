"use client";

import { api } from "@/utils/api";

export default function Home() {
  const [data] = api.example.hello.useSuspenseQuery({ text: "from tRPC" });
  console.log(data);

  return <p className="text-2xl text-white">{data.greeting}</p>;
}
