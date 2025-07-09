import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ReactNode } from "react";

interface RecentlyViewedTileProps {
  title: string;
  url: string;
  icon: ReactNode;
  detailName?: string;
}

export function RecentlyViewedTile({
  title,
  url,
  icon,
  detailName,
}: RecentlyViewedTileProps) {
  return (
    <Link href={url} className="flex flex-col items-center">
      <Card className="w-[200px] h-[160px] bg-sidebar dark:bg-[#1d2c1d]">
        <CardContent>
          <div className="w-10 h-10 flex items-center justify-center text-primary">
            {icon}
          </div>
        </CardContent>
        <CardHeader className="flex flex-col items-start gap-1 ">
          <CardTitle>{title}</CardTitle>
          {detailName && (
            <span className="text-xs text-muted-foreground text-center truncate max-w-[160px]">
              {detailName}
            </span>
          )}
        </CardHeader>
      </Card>
    </Link>
  );
}
