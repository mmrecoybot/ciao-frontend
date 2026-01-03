import { Loader } from "lucide-react";
import React from "react";

export default function Loading({ className = "w-20 h-20" }) {
  return (
    <div className="p-6 space-y-6 w-full flex flex-col items-center justify-center dark:text-white">
      <div className="">
          <Loader className={`animate-spin ${className}`} />
      </div>
    </div>
  );  
}
