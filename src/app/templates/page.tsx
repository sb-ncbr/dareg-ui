"use client";

import React, { useState } from "react";
import { useApiServiceGetApiV1Schemas } from "../../../openapi/queries";
import { DynamicDataTable } from "@/components/dynamic_table/dynamic-data-table";
import { TypographyH2 } from "@/components/typography/typography-h2";
import { SkeletonTable } from "@/components/dynamic_table/skeleton-table";
import BoundingBox from "@/components/bounding-box/bounding-box";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { templateColumns } from "@/components/dynamic_table/columns/template-columns";
import TableBoundingBox from "@/components/bounding-box/table-bounding-box";

const TemplatesPage = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const router = useRouter();
  const { data: templates, isLoading } = useApiServiceGetApiV1Schemas();
  const [isCreatingDataset, setIsCreatingDataset] = useState(false);

  const handleCreate = () => {
    setIsCreatingDataset(true);
    router.push("/templates/new");
  };

  const templateCount = templates?.count || 0;
  const pageCount = Math.ceil(templateCount / 10) || 1;
  const dataToUse = templates?.results || [];

  return (
    <div>
      <Breadcrumbs />
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <TypographyH2 text={"Templates"} />
        </div>
        <div className="flex items-center">
          <Button
            onClick={handleCreate}
            variant="default"
            className="w-[160px]"
          >
            {isCreatingDataset ? "Creating..." : "Create Template"}
          </Button>
        </div>
      </div>

      <TableBoundingBox>
        <DynamicDataTable
          data={dataToUse || []}
          pageIndex={pageIndex}
          pageCount={pageCount}
          onPageChange={setPageIndex}
          columns={templateColumns}
        />
      </TableBoundingBox>
    </div>
  );
};

export default TemplatesPage;
