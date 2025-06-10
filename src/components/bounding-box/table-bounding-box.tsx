import { cx } from "class-variance-authority";
import React, { ReactNode } from "react";

interface TableBoundingBoxProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const TableBoundingBox: React.FC<TableBoundingBoxProps> = ({
  children,
  className,
  style,
}) => {
  return (
    <div
      className={cx("max-w-full mb-4 mt-8 space-y-4", className)}
      style={style}
    >
      {children}
    </div>
  );
};

export default TableBoundingBox;
