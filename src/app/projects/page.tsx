"use client";

import React, { useState } from "react";
import { useApiServiceGetApiV1Projects } from "../../../openapi/queries";
import { DynamicDataTable } from "@/components/dynamic_table/dynamic-data-table";
import {SkeletonTable} from "@/components/dynamic_table/skeleton-table";
import {TypographyH2} from "@/components/typography/typography-h2";

const mockedProjectsData = {
  count: 100,
  next: "http://api.example.org/accounts/?page=4",
  previous: "http://api.example.org/accounts/?page=2",
  results: [
    {
      id: "string",
      name: "string",
      created_by: {
        id: 0,
        full_name: "string",
      },
      perms: "string",
      shares: "string",
      facility: {
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        name: "string",
        abbreviation: "string",
        email: "user@example.com",
        web: "string",
        logo: "string",
      },
      default_dataset_schema: {
        name: "string",
        id: "string",
        created_by: {
          id: 0,
          full_name: "string",
        },
      },
      project_schema: {
        name: "string",
        id: "string",
        created_by: {
          id: 0,
          full_name: "string",
        },
      },
      created: "2025-04-28T09:05:04.815Z",
      modified: "2025-04-28T09:05:04.815Z",
      description: "string",
      onedata_space_id: "string",
      modified_by: 0,
    },
  ],
};

const ProjectsPage = () => {
  const [pageIndex, setPageIndex] = useState(0);

  const { data: projectsData, isLoading } = useApiServiceGetApiV1Projects();

  const projectDataCount = projectsData?.count || 0;
  const pageCount = Math.ceil(projectDataCount / 10) || 0;

  const dataToUse =
    projectsData && projectsData.results && projectsData.results.length > 0
      ? projectsData
      : mockedProjectsData;

  if (isLoading) {
    return <div>
        <TypographyH2 text={"Projects"} />
        <SkeletonTable></SkeletonTable></div>;
  }

  return (
      <div>
          <TypographyH2 text={"Projects"} />

    <DynamicDataTable
      data={dataToUse.results || []}
      pageIndex={pageIndex}
      pageCount={pageCount}
      onPageChange={setPageIndex}
        columns={[
            {
                accessorKey: "select",
                header: "Select",
            },
            {
            accessorKey: "name",
            header: "Name",
            },
            {
            accessorKey: "description",
            header: "Description",
            },
            {
            accessorKey: "created_by.full_name",
            header: "Created By",
            },
            {
            accessorKey: "created",
            header: "Created At",
            },
            {
                accessorKey: "actions",
                header: "Actions",
            },
        ]}
    />
      </div>
  );
};

export default ProjectsPage;
