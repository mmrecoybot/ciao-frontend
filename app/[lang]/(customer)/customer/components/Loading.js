import { Loader } from "lucide-react";
import React from "react";

export default function Loading({ className = "w-36 h-36" }) {
  return (
    <div className="h-full flex justify-center items-center w-full">
      <Loader className={`animate-spin ${className}`} />
    </div>
  );
}
