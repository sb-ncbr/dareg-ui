import React from "react";
import { RecentlyViewedItem } from "@/types/recently-viewed/recently-viewed-item";
import Link from "next/link";
import { RecentlyViewedTile } from "./recently-viewed-tile";
import { FileText, LayoutPanelTop, Library, Newspaper } from "lucide-react";
import { Icon } from "../common/icons";
import { recentPagesService } from "@/services/recent-pages-service";

export const iconMap: Record<RecentlyViewedItem["icon"], React.ReactNode> = {
  dataset: <FileText className="h-full w-full" />,
  collection: <Library className="h-full w-full" />,
  template: <LayoutPanelTop name="template" className="h-full w-full" />,
  default: <Newspaper className="h-full w-full" />,
};

const getTitleFromPath = (pathname: string): string => {
  if (pathname.startsWith("/datasets/") && pathname.split("/").length > 2) {
    return "Dataset Detail";
  }
  if (pathname.startsWith("/datasets")) {
    return "Datasets";
  }
  if (pathname.startsWith("/projects/") && pathname.split("/").length > 2) {
    return "Project Detail";
  }
  if (pathname.startsWith("/projects")) {
    return "Projects";
  }
  if (pathname.startsWith("/collections/") && pathname.split("/").length > 2) {
    return "Collection Detail";
  }
  if (pathname.startsWith("/collections")) {
    return "Collections";
  }
  if (pathname.startsWith("/templates")) {
    return "Templates";
  }
  return "Page";
};

export function RecentlyViewedList() {
  const items: RecentlyViewedItem[] = recentPagesService.getRecentPages();
  if (!items?.length) return null;

  return (
    <div className="flex flex-row gap-4 overflow-x-auto py-2">
      {items.map((item, idx) => (
        <RecentlyViewedTile
          key={idx}
          title={getTitleFromPath(item.url)}
          icon={iconMap[item.icon]}
          url={item.url}
        ></RecentlyViewedTile>
      ))}
    </div>
  );
}
