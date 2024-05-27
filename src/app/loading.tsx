import { Loader2Icon } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2Icon className="h-14 w-14 animate-spin" />
    </div>
  );
}
