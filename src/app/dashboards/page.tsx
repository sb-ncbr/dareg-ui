"use client";
import TableBoundingBox from "@/components/bounding-box/table-bounding-box";
import { Breadcrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import { DynamicDataTable } from "@/components/dynamic_table/dynamic-data-table";
import { TypographyH2 } from "@/components/typography/typography-h2";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { TypographyH3 } from "@/components/typography/typography-h3";
import { searchResultColumns } from "@/components/dynamic_table/columns/search-result-columns";
import { ListFilter, Save, Loader2 } from "lucide-react";
import { useSearch } from "@/components/tokenized-search/providers/search-context";
import { Badge } from "@/components/ui/badge";
import {
  CommonFilters,
  CommonFilterState,
} from "@/components/tokenized-search/filters/common-filters";
import { FilterDialog } from "@/components/tokenized-search/filters/filter-dialog";
import Lottie from "lottie-react";
import notFoundAnimation from "../../../public/lottie/not-found.json";
import {
  fetchSearchPageByUrl,
  SearchResultItem,
} from "@/components/tokenized-search/services/search-api-service";
import {
  DEFAULT_DATE_RANGE,
  getApiField,
  Token,
} from "@/components/tokenized-search/types/search-models";
import { SaveSearchDialog } from "@/components/saved-searches/save-search-dialog";

export default function DashboardsPage() {
  const {
    tokens,
    freeTextQuery,
    isSearching,
    searchResults,
    setSearchResults,
    lastSearchQuery,
    buildApiQueryParams,
    setTokens,
    performSearch,
    addToHistory,
    selectedSchemaId,
    setSelectedSchemaId,
  } = useSearch();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [filterState, setFilterState] = useState<CommonFilterState>({
    name: "",
    description: "",
    createdRange: DEFAULT_DATE_RANGE,
    modifiedRange: DEFAULT_DATE_RANGE,
  });

  const typeMap: Record<string, string> = {
    schema: "template",
    project: "collection",
    dataset: "dataset",
  };

  const parsedResults =
    searchResults?.results?.map((item: SearchResultItem) => ({
      id: item.id,
      type: typeMap[item.model?.toLowerCase() || ""] || "",
      name: item.text || "",
    })) ?? [];

  const [showLoading, setShowLoading] = useState(isSearching);
  const [showNoResults, setShowNoResults] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (isSearching) {
      timeout = setTimeout(() => {
        setShowNoResults(true);
      }, 3000);
    } else {
      setShowNoResults(false);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isSearching]);

  useEffect(() => {
    if (
      isSearching ||
      (isSearching &&
        (!searchResults?.results || searchResults.results.length === 0)) ||
      (tokens.length === 0 && !freeTextQuery)
    ) {
      setShowLoading(true);
    } else {
      const timeout = setTimeout(() => setShowLoading(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [isSearching, searchResults, tokens, freeTextQuery]);

  const isShowingSearchResults =
    !!searchResults && (tokens.length > 0 || freeTextQuery);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  function dialogFiltersToTokens(
    filters: Record<string, any>,
    model?: string
  ): Token[] {
    const tokens: Token[] = [];
    for (const key in filters) {
      const value = filters[key];
      if (value === undefined || value === null || value === "") continue;
      tokens.push({
        model: model || "Dataset",
        field: key,
        operator: typeof value === "string" ? "regex" : "=",
        value: value,
        displayValue: String(value),
        apiField: getApiField(model || "Dataset", key),
      });
    }
    return tokens;
  }

  function mapDateRangeToAndFilters(
    field: string,
    range: { from?: Date; to?: Date }
  ): object[] {
    const isDefaultFrom =
      !range.from ||
      range.from.getTime() === DEFAULT_DATE_RANGE.from!.getTime();
    const isDefaultTo =
      !range.to || range.to.getTime() === DEFAULT_DATE_RANGE.to!.getTime();
    const filters: object[] = [];
    if (!isDefaultFrom) {
      filters.push({ [field]: { $gte: range.from!.toISOString() } });
    }
    if (!isDefaultTo) {
      filters.push({ [field]: { $lte: range.to!.toISOString() } });
    }
    return filters;
  }
  function handleDialogApply(type: string, filters: any, schemaId?: string) {
    setIsDialogOpen(false);

    const dialogTokens = dialogFiltersToTokens(filters, type);
    setTokens(dialogTokens);

    const filterArray = [];

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        filterArray.push({
          [`metadata.${key}`]:
            typeof value === "string" ? { $regex: value } : { $eq: value },
        });
      }
    });

    filterArray.push(
      ...mapDateRangeToAndFilters("modified", filterState.modifiedRange)
    );
    filterArray.push(
      ...mapDateRangeToAndFilters("created", filterState.createdRange)
    );

    const filtersObject =
      filterArray.length > 1 ? { $and: filterArray } : filterArray[0] || {};

    if (schemaId) setSelectedSchemaId(schemaId);
    const queryBody = buildApiQueryParams(dialogTokens, freeTextQuery);
    queryBody.filters = filtersObject;
    if (type) queryBody.model = type;
    if (schemaId) queryBody.schema = schemaId;

    performSearch({
      queryBody,
      navigate: true,
      tokens: dialogTokens,
      freeText: freeTextQuery,
    });

    addToHistory(dialogTokens, freeTextQuery);
  }

  const actualTotal = searchResults?.total ?? 0;
  const resultCount = actualTotal;

  return (
    <div>
      <Breadcrumbs />
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <TypographyH2
            text={
              isShowingSearchResults
                ? "Search Results"
                : "Perform a search to see results"
            }
          />
        </div>
        <div className="flex items-center gap-4">
          {isShowingSearchResults && (
            <SaveSearchDialog
              tokens={tokens}
              freeTextQuery={freeTextQuery}
              queryBody={buildApiQueryParams(tokens, freeTextQuery)}
              currentUrl={window.location.href}
              trigger={
                <Button variant="outline" className="w-[160px]">
                  <Save className="h-4 w-4 mr-2" />
                  <span>Save Search</span>
                </Button>
              }
            />
          )}
        </div>
      </div>

      {isShowingSearchResults && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-sm font-medium text-blue-800">
              Search Criteria:
            </span>
            {tokens.map((token, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="bg-blue-100 text-blue-800 border-blue-300"
              >
                {token.model}.{token.field} {token.operator}{" "}
                {token.displayValue}
              </Badge>
            ))}
            {freeTextQuery && (
              <Badge
                variant="outline"
                className="bg-white text-blue-700 border-blue-300"
              >
                "{freeTextQuery}"
              </Badge>
            )}
          </div>
          {searchResults && (
            <div className="text-sm text-blue-700">
              Found {actualTotal} total results.
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-6 items-center">
        {/* <CommonFilters filterState={filterState} onChange={setFilterState} /> */}
        <Button
          variant="default"
          onClick={() => setIsDialogOpen(!isDialogOpen)}
          className="w-[160px] mb-1"
          size={"xl"}
        >
          <ListFilter />
          <span>Extensive Filter</span>
        </Button>
        {isShowingSearchResults && (
          <SaveSearchDialog
            tokens={tokens}
            freeTextQuery={freeTextQuery}
            queryBody={buildApiQueryParams(tokens, freeTextQuery)}
            currentUrl={window.location.href}
            trigger={
              <Button variant="outline" className="w-[160px]" size={"xl"}>
                <Save className="h-4 w-4 mr-2" />
                <span>Save Search</span>
              </Button>
            }
          />
        )}
      </div>

      <FilterDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onApply={handleDialogApply}
        resultCount={resultCount}
      />

      {isShowingSearchResults && !showLoading && parsedResults?.length > 0 && (
        <TableBoundingBox>
          <div className="flex justify-between items-center mb-4">
            <TypographyH3 text="All Results" />
            <span className="text-sm text-gray-500">
              {(() => {
                const start =
                  actualTotal === 0
                    ? 0
                    : pagination.pageIndex * pagination.pageSize + 1;
                const end = Math.min(
                  pagination.pageIndex * pagination.pageSize +
                    parsedResults.length,
                  actualTotal
                );
                return `Showing ${start}-${end} of ${actualTotal} results`;
              })()}
            </span>
          </div>
          <DynamicDataTable
            rowType="search-result"
            data={parsedResults}
            columns={searchResultColumns}
            pageIndex={pagination.pageIndex}
            pageSize={pagination.pageSize}
            showSearch={false}
            onPageChange={async (pageIndex) => {
              const offset = pageIndex * pagination.pageSize;
              await fetchSearchPageByUrl(
                lastSearchQuery,
                offset,
                pagination.pageSize,
                setSearchResults
              );
              setPagination((prev) => ({
                ...prev,
                pageIndex,
              }));
            }}
            pageCount={Math.ceil(actualTotal / pagination.pageSize)}
          />
        </TableBoundingBox>
      )}
      {showLoading && (
        <div
          className={`flex flex-col justify-center items-center py-8 text-gray-500 transition-opacity duration-500 ${
            showLoading ? "opacity-100" : "opacity-0"
          }`}
        >
          <Lottie animationData={notFoundAnimation} loop={false} />
          {!showNoResults ? (
            <p className="animate-pulse">Searching for results...</p>
          ) : (
            <div className="flex flex-col items-center transition-opacity duration-700 opacity-100">
              <p className="animate-pulse mb-2">No results found.</p>
              <Button
                variant="default"
                onClick={() => setIsDialogOpen(!isDialogOpen)}
                className="w-[160px] mb-1 transition-opacity duration-700 opacity-100"
                size={"xl"}
              >
                <ListFilter />
                <span>Extensive Filter</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
