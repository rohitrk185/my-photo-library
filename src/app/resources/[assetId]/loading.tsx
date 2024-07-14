import { Loader2 } from "lucide-react";
import React from "react";

const loading = () => {
  return (
    <div className="w-full h-full flex items-center justify-center gap-1 text-white">
      <span className="italic text-lg">Loading</span>
      <span className="animate-spin">
        <Loader2 color="#fff" className="h-6 w-6" />
      </span>
    </div>
  );
};

export default loading;
