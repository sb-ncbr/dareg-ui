import React, { ReactNode } from "react";
import { TypographyH5 } from "@/components/typography/typography-h5";

interface ExperimentInfoRowProps {
  icon: ReactNode;
  title: string | undefined | null;
  value: string | undefined | null;
  child?: React.ReactElement | null;
}

export function ExperimentInfoRow({
  icon,
  title,
  value,
  child = null,
}: ExperimentInfoRowProps) {
  return (
    <div>
      <div className="flex items-center gap-2">
        {icon && typeof icon === "object"
          ? // @ts-ignore
            React.cloneElement(icon, { className: "h-4 w-4 mt-[1px]" })
          : icon}
        <TypographyH5 text={title ?? ""} />
      </div>
      {child !== null ? (
        child
      ) : (
        <span className="opacity-90">{value ?? ""}</span>
      )}
    </div>
  );
}
