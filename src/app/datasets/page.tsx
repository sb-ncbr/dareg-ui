"use client";

import React, { useState } from "react";
import { useApiServiceGetApiV1Datasets } from "../../../openapi/queries";
import { DynamicDataTable } from "@/components/dynamic_table/dynamic-data-table";
import { TypographyH2 } from "@/components/typography/typography-h2";
import { SkeletonTable } from "@/components/dynamic_table/skeleton-table";
import { datasetColumns } from "@/components/dynamic_table/columns/dataset-columns";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import BoundingBox from "@/components/bounding-box/bounding-box";
import TableBoundingBox from "@/components/bounding-box/table-bounding-box";

const DatasetsPage = () => {
  const [pageIndex, setPageIndex] = useState(0);

  const { data: datasets, isLoading } = useApiServiceGetApiV1Datasets({
    page: pageIndex + 1,
  });

  const projectDataCount = datasets?.count || 0;
  const pageCount = Math.ceil(projectDataCount / 10) || 0;

  const dataToUse = datasets || {};

  const columns = datasetColumns;

  const router = useRouter();

  const [isCreatingDataset, setIsCreatingDataset] = useState(false);
  const handleCreate = () => {
    setIsCreatingDataset(true);
    router.push("/datasets/new");
  };

  if (isLoading) {
    return (
      <div>
        <TypographyH2 text={"Datasets"} />
        <TableBoundingBox>
          <SkeletonTable />
        </TableBoundingBox>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs />
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <TypographyH2 text={"Datasets"} />
        </div>
        <div className="flex items-center">
          <Button
            onClick={handleCreate}
            variant="default"
            className="w-[160px]"
          >
            {isCreatingDataset ? "Creating..." : "Create Dataset"}
          </Button>
        </div>
      </div>
      <TableBoundingBox>
        <DynamicDataTable
          rowType="dataset"
          data={dataToUse.results || []}
          pageIndex={pageIndex}
          pageCount={pageCount}
          onPageChange={setPageIndex}
          columns={columns}
        />
      </TableBoundingBox>
    </div>
  );
};

export default DatasetsPage;
