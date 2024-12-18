import { cn } from "@/utils";
import React from "react";

const ExpandingIndicator = ({
  className,
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "relative flex size-3 items-center justify-center",
        className,
      )}
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
      <span className="relative inline-flex size-2.5 rounded-full bg-primary"></span>
    </span>
  );
};

export { ExpandingIndicator };
