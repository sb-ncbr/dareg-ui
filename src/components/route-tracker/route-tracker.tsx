"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { recentPagesService } from "@/services/recent-pages-service";
import { RecentlyViewedItem } from "@/types/recently-viewed/recently-viewed-item";

const getIconType = (pathname: string): RecentlyViewedItem["icon"] => {
  if (pathname.startsWith("/datasets")) return "dataset";
  if (pathname.startsWith("/templates")) return "template";
  if (pathname.startsWith("/collections")) return "collection";
  return "default";
};

export function RouteTracker() {
  const pathname = usePathname();
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    if (pathname && pathname !== prevPath.current && pathname !== "/") {
      prevPath.current = pathname;

      recentPagesService.savePage({
        url: pathname,
        icon: getIconType(pathname),
      });
    }
  }, [pathname]);

  return null;
}
