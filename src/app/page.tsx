"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import { TypographyH2 } from "@/components/typography/typography-h2";
import BoundingBox from "@/components/bounding-box/bounding-box";
import { RecentlyViewedList } from "@/components/route-tracker/recently-viewed-window";
import { DynamicDataTable } from "@/components/dynamic_table/dynamic-data-table";
import { useApiServiceGetApiV1Datasets } from "../../openapi/queries";
import { datasetColumns } from "@/components/dynamic_table/columns/dataset-columns";
import { SkeletonTable } from "@/components/dynamic_table/skeleton-table";

export default function DashboardPage() {
  const { data: datasets, isLoading } = useApiServiceGetApiV1Datasets();

  const sortedDatasets = (datasets?.results ?? [])
    .slice()
    .sort(
      (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
    )
    .slice(0, 5);

  return (
    <div>
      <Breadcrumbs />
      <div className="flex items-center gap-4 mb-6">
        <TypographyH2 text="Dashboard" />
      </div>
      <div className="flex items-center gap-4 mb-6"></div>
      <BoundingBox className="max-w-full w-full h-[80vh]">
        <div className="grid grid-rows-[1fr_2fr] grid-cols-4 gap-6 h-full">
          {/* Top left: Recently Viewed */}
          <Card className="col-span-3 row-span-1 h-full">
            <CardHeader>
              <CardTitle>Recently Viewed</CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              <RecentlyViewedList />
            </CardContent>
          </Card>
          {/* Top right: Side Info */}
          <Card className="col-span-1 row-span-1 h-full">
            <CardHeader>
              <CardTitle>Support</CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              {/* Your side info here */}
            </CardContent>
          </Card>
          {/* Bottom left: Bottom Left */}
          {/* <Card className="col-span-1 row-span-1 h-full">
            <CardHeader>
              <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent className="h-full">
            </CardContent>
          </Card> */}
          <Card className="col-span-4 row-span-1 h-full">
            <CardHeader>
              <CardTitle>Recent Datasets</CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              {isLoading ? (
                <SkeletonTable />
              ) : (
                <DynamicDataTable
                  data={sortedDatasets}
                  columns={datasetColumns}
                  pageSize={5}
                  pageIndex={0}
                  pageCount={1}
                  onPageChange={() => {}}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </BoundingBox>
    </div>
  );
}
