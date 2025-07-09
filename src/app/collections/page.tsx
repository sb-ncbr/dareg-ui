"use client";

import React, { useState } from "react";
import { useApiServiceGetApiV1Projects } from "../../../openapi/queries";
import { DynamicDataTable } from "@/components/dynamic_table/dynamic-data-table";
import { SkeletonTable } from "@/components/dynamic_table/skeleton-table";
import { TypographyH2 } from "@/components/typography/typography-h2";
import { projectColumns } from "@/components/dynamic_table/columns/project-columnts";
import { Breadcrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import BoundingBox from "@/components/bounding-box/bounding-box";
import TableBoundingBox from "@/components/bounding-box/table-bounding-box";

const ProjectsPage = () => {
  const [pageIndex, setPageIndex] = useState(0);

  const { data: projectsData, isLoading } = useApiServiceGetApiV1Projects();

  const projectDataCount = projectsData?.count || 0;
  const pageCount = Math.ceil(projectDataCount / 10) || 0;

  const dataToUse = projectsData || {};
  const columns = projectColumns;

  if (isLoading) {
    return (
      <div>
        <TypographyH2 text={"Collections"} />
        <TableBoundingBox>
          <SkeletonTable></SkeletonTable>
        </TableBoundingBox>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs />
      <div>
        <TypographyH2 text={"Collections"} />
        <TableBoundingBox>
          <DynamicDataTable
            rowType="collection"
            data={dataToUse.results || []}
            pageIndex={pageIndex}
            pageCount={pageCount}
            onPageChange={setPageIndex}
            columns={columns}
          />
        </TableBoundingBox>
      </div>
    </div>
  );
};

export default ProjectsPage;
