// "use client";

import { prisma } from "@/server/db";

// import { api } from "@/utils/api";

export default async function Page() {
  // const [data] = api.example.hello.useSuspenseQuery({ text: "from tRPC" });
  const data = await prisma.user.findMany();
  console.log("data: ", data);

  return (
    <div className="flex flex-col gap-5">
      {data.map(({ id, firstName }) => (
        <p key={id} className="text-2xl">
          {firstName}
        </p>
      ))}
    </div>
  );
}
