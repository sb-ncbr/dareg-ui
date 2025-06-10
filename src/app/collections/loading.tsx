"use client";

import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

export default function Loading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 2;
      setProgress(current);
      if (current >= 100) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md">
        <Progress value={progress} />
      </div>
    </div>
  );
}
