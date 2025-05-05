import React from "react";
import { Skeleton } from "../ui/skeleton";

export function SkeletonTable() {
  const rows = Array.from({ length: 5 }); // Number of skeleton rows
  const columns = Array.from({ length: 5 }); // Number of skeleton columns

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Skeleton className="h-10 w-1/3 max-w-sm" />
        <Skeleton className="h-10 w-20 ml-auto" />
      </div>
      <div className="border border-border rounded-md overflow-hidden">
        <div className="bg-muted h-10 flex">
          {columns.map((_, index) => (
            <Skeleton key={index} className="h-full w-full flex-1" />
          ))}
        </div>
        <div>
          {rows.map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="flex items-center border-t border-border h-12"
            >
              {columns.map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-8 w-full flex-1 mx-2" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
