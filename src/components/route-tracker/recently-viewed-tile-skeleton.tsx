import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function RecentlyViewedTileSkeleton() {
  return (
    <Card className="w-[200px] h-[160px] bg-muted animate-pulse">
      <CardContent>
        <div className="w-10 h-10 rounded-full bg-muted-foreground/20 mx-auto my-2" />
      </CardContent>
      <CardHeader className="flex flex-col items-start gap-1">
        <div className="h-4 w-3/4 bg-muted-foreground/20 rounded mb-1" />
        <div className="h-3 w-1/2 bg-muted-foreground/10 rounded" />
      </CardHeader>
    </Card>
  );
}
