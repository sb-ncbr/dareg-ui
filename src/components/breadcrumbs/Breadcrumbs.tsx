"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight, Slash } from "lucide-react";

interface BreadcrumbsProps {
  detailName?: string;
}

const STATIC_LABELS: Record<string, string> = {
  collections: "Collections",
  datasets: "Datasets",
  settings: "Settings",
};

export function Breadcrumbs({ detailName }: BreadcrumbsProps) {
  const pathname = usePathname() || "/";
  const segments = pathname.split("/").filter(Boolean);

  const idPairIndex = segments.findIndex((seg) =>
    Object.keys(STATIC_LABELS).includes(seg)
  );
  const overrideIndex = idPairIndex !== -1 ? idPairIndex + 1 : -1;

  const crumbs = segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");

    if (idx === overrideIndex && detailName) {
      return { href, label: detailName };
    }

    const raw = decodeURIComponent(seg);
    const label =
      STATIC_LABELS[raw] ||
      raw.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    return { href, label };
  });

  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link href="/">Home</Link>
        </BreadcrumbLink>
        <BreadcrumbSeparator className="px-2">
          <Slash />
        </BreadcrumbSeparator>
      </BreadcrumbItem>

      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <BreadcrumbItem key={crumb.href}>
            {isLast ? (
              <span aria-current="page">{crumb.label}</span>
            ) : (
              <BreadcrumbLink asChild>
                <Link href={crumb.href}>{crumb.label}</Link>
              </BreadcrumbLink>
            )}
            {!isLast && (
              <BreadcrumbSeparator className="px-2">
                <Slash />
              </BreadcrumbSeparator>
            )}
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
}
