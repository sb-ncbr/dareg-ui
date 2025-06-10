import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ReactNode } from "react";

interface RecentlyViewedTileProps {
  title: string;
  url: string;
  icon: ReactNode;
}

export function RecentlyViewedTile({
  title,
  url,
  icon,
}: RecentlyViewedTileProps) {
  return (
    <Link href={url} className="flex flex-col items-center">
      <Card className="w-[200px]">
        <CardContent>
          <div className="w-12 h-12 flex items-center justify-center text-primary">
            {icon}
          </div>
        </CardContent>
        <CardHeader className="flex flex-row items-center gap-4">
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
}
