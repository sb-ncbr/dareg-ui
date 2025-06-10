import { cx } from "class-variance-authority";
import React, { ReactNode } from "react";

interface BoundingBoxProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const BoundingBox: React.FC<BoundingBoxProps> = ({
  children,
  className,
  style,
}) => {
  return (
    <div
      className={cx("max-w-[100vh] mb-4 mt-6 space-y-4", className)}
      style={style}
    >
      {children}
    </div>
  );
};

export default BoundingBox;
