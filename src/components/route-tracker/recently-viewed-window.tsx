import React from "react";
import { RecentlyViewedItem } from "@/types/recently-viewed/recently-viewed-item";
import { RecentlyViewedTile } from "./recently-viewed-tile";
import {
  FileText,
  FlaskConical,
  LayoutPanelTop,
  Library,
  Newspaper,
} from "lucide-react";
import { recentPagesService } from "@/services/recent-pages-service";
import {
  useApiServiceGetApiV1DatasetsById,
  useApiServiceGetApiV1ProjectsById,
  useApiServiceGetApiV1SchemasById,
} from "../../../openapi/queries";
import { RecentlyViewedTileSkeleton } from "./recently-viewed-tile-skeleton";

export const iconMap: Record<RecentlyViewedItem["icon"], React.ReactNode> = {
  dataset: <FileText className="h-full w-full" />,
  collection: <Library className="h-full w-full" />,
  template: <LayoutPanelTop name="template" className="h-full w-full" />,
  experiment: <FlaskConical className="h-full w-full" />,
  default: <Newspaper className="h-full w-full" />,
};

function useRecentlyViewedTitleAndName(pathname: string): {
  typeTitle: string;
  detailName?: string;
} {
  // Dataset detail
  if (pathname.startsWith("/datasets/") && pathname.split("/").length > 2) {
    const id = pathname.split("/")[2];
    if (pathname.includes("/experiments")) {
      const { data } = useApiServiceGetApiV1DatasetsById({ id });
      return {
        typeTitle: "Experiments In:",
        detailName: data?.name,
      };
    }
    const { data } = useApiServiceGetApiV1DatasetsById({ id });
    return { typeTitle: "Dataset:", detailName: data?.name };
  }
  // Collection detail
  if (pathname.startsWith("/collections/") && pathname.split("/").length > 2) {
    const id = pathname.split("/")[2];
    const { data } = useApiServiceGetApiV1ProjectsById({ id });
    return { typeTitle: "Collection:", detailName: data?.name };
  }
  // Template detail
  if (pathname.startsWith("/templates/") && pathname.split("/").length > 2) {
    const id = pathname.split("/")[2];
    const { data } = useApiServiceGetApiV1SchemasById({ id });
    return { typeTitle: "Template:", detailName: data?.name };
  }

  if (pathname.startsWith("/datasets")) return { typeTitle: "Datasets" };
  if (pathname.startsWith("/collections")) return { typeTitle: "Collections" };
  if (pathname.startsWith("/templates")) return { typeTitle: "Templates" };
  return { typeTitle: "Page" };
}

export function RecentlyViewedList() {
  const items: RecentlyViewedItem[] = recentPagesService.getRecentPages();
  if (!items?.length)
    return (
      <div className="flex gap-4">
        {[...Array(3)].map((_, i) => (
          <RecentlyViewedTileSkeleton key={i} />
        ))}
      </div>
    );

  return (
    <div className="flex flex-row gap-4 overflow-x-auto py-2">
      {items.map((item, idx) => {
        const title = useRecentlyViewedTitleAndName(item.url);
        return (
          <RecentlyViewedTile
            key={idx}
            title={title.typeTitle}
            detailName={title.detailName}
            icon={iconMap[item.icon]}
            url={item.url}
          />
        );
      })}
    </div>
  );
}
