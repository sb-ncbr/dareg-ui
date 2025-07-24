"use client";
import TableBoundingBox from "@/components/bounding-box/table-bounding-box";
import { Breadcrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import { DynamicDataTable } from "@/components/dynamic_table/dynamic-data-table";
import { TypographyH2 } from "@/components/typography/typography-h2";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import {
  useApiServiceGetApiV1Datasets,
  useApiServiceGetApiV1Projects,
} from "../../../openapi/queries";
import { SkeletonTable } from "@/components/dynamic_table/skeleton-table";
import { TypographyH3 } from "@/components/typography/typography-h3";
import { commonColumns } from "@/components/dynamic_table/columns/common-columns";
import { ListFilter, Save } from "lucide-react";
import {
  CommonFilters,
  CommonFilterState,
} from "@/components/tokenized-search/common-filters";
import { useParams, useSearchParams } from "next/navigation";
import { FilterDialog } from "@/components/tokenized-search/filter-dialog";

const DEFAULT_DATE_RANGE = {
  from: new Date("1000-01-01"),
  to: new Date("9999-12-31"),
};

export default function DashboardsPage() {
  const searchParams = useSearchParams();
  const myParam = searchParams.get("text-query");

  console.log("Query from params:", myParam);

  const { data: datasets, isLoading: isLoadingDatasets } =
    useApiServiceGetApiV1Datasets({ page: 1 });
  const { data: collections, isLoading: isLoadingCollections } =
    useApiServiceGetApiV1Projects({ page: 1 });

  const [filterState, setFilterState] = useState<CommonFilterState>({
    name: myParam || "",
    description: "",
    createdRange: DEFAULT_DATE_RANGE,
    modifiedRange: DEFAULT_DATE_RANGE,
  });

  function filterResults<
    T extends {
      name?: string;
      description?: string;
      created?: string;
      modified?: string;
    }
  >(items: T[] | undefined, filter: CommonFilterState): T[] {
    if (!items) return [];
    return items.filter((item) => {
      if (
        filter.name &&
        !item.name?.toLowerCase().includes(filter.name.toLowerCase())
      )
        return false;
      if (
        filter.description &&
        !item.description
          ?.toLowerCase()
          .includes(filter.description.toLowerCase())
      )
        return false;
      if (
        filter.createdRange?.from &&
        filter.createdRange?.to &&
        item.created
      ) {
        const createdDate = new Date(item.created);
        if (
          createdDate < filter.createdRange.from ||
          createdDate > filter.createdRange.to
        )
          return false;
      }
      if (
        filter.modifiedRange?.from &&
        filter.modifiedRange?.to &&
        item.modified
      ) {
        const modifiedDate = new Date(item.modified);
        if (
          modifiedDate < filter.modifiedRange.from ||
          modifiedDate > filter.modifiedRange.to
        )
          return false;
      }
      return true;
    });
  }

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<string>("dataset");
  const [dialogFilters, setDialogFilters] = useState({});

  const resultCount =
    filterResults(datasets?.results, filterState).length +
    filterResults(collections?.results, filterState).length;

  function handleDialogApply(type: string, filters: any) {
    setDialogType(type);
    setDialogFilters(filters);
    setIsDialogOpen(false);
  }

  const filteredDatasets = filterResults(datasets?.results, filterState).slice(
    0,
    10
  );
  const filteredCollections = filterResults(
    collections?.results,
    filterState
  ).slice(0, 10);

  return (
    <div>
      <Breadcrumbs />
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <TypographyH2 text={"Search Results:"} />
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="w-[160px]">
            <Save></Save> <span>Save Search</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <CommonFilters filterState={filterState} onChange={setFilterState} />
        <Button
          variant="default"
          onClick={() => setIsDialogOpen(!isDialogOpen)}
          className="w-[160px] mb-1"
          size={"xl"}
        >
          <ListFilter />
          <span>Extensive Filter</span>
        </Button>
      </div>
      <FilterDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onApply={handleDialogApply}
        resultCount={resultCount}
      />
      <TableBoundingBox className="h-1/3">
        <TypographyH3 text="Datasets" />
        {isLoadingDatasets ? (
          <SkeletonTable />
        ) : (
          <DynamicDataTable
            rowType="dataset"
            data={filteredDatasets || []}
            pageIndex={1}
            pageCount={1}
            pageSize={10}
            columns={commonColumns}
            onPageChange={() => {}}
          />
        )}
      </TableBoundingBox>
      <TableBoundingBox className="h-1/3">
        <TypographyH3 text="Collections" />
        {isLoadingCollections ? (
          <SkeletonTable />
        ) : (
          <DynamicDataTable
            rowType="collection"
            data={filteredCollections || []}
            pageIndex={1}
            pageSize={10}
            pageCount={1}
            columns={commonColumns}
            onPageChange={() => {}}
          />
        )}
      </TableBoundingBox>
    </div>
  );
}
