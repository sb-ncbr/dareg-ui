"use client";
import TableBoundingBox from "@/components/bounding-box/table-bounding-box";
import { Breadcrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import { DynamicDataTable } from "@/components/dynamic_table/dynamic-data-table";
import { TypographyH2 } from "@/components/typography/typography-h2";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { TypographyH3 } from "@/components/typography/typography-h3";
import { searchResultColumns } from "@/components/dynamic_table/columns/search-result-columns";
import { ListFilter, Save, Loader2, X } from "lucide-react";
import { useSearch } from "@/components/tokenized-search/providers/search-context";
import { Badge } from "@/components/ui/badge";
import {
  CommonFilters,
  CommonFilterState,
} from "@/components/tokenized-search/filters/common-filters";
import { EnhancedFilterDialog } from "@/components/tokenized-search/filters/enhanced-filter-dialog";
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
import { TypographyH2Ghost } from "@/components/typography/typography-h2-ghost";
import {
  SavedSearch,
  savedSearchesService,
} from "@/services/saved-searches-service";
import { formatTokenDisplayValue } from "@/utils/token-display";
import { useApiServiceGetApiV1Schemas } from "../../../openapi/queries";
import { bootstrapSearchModels } from "@/components/tokenized-search/services/bootstrap-service";

export default function DashboardsPage() {
  const {
    tokens,
    freeTextQuery,
    setFreeTextQuery,
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
    isInitialized,
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

  // Force bootstrap search models when dashboard loads
  useEffect(() => {
    if (!isInitialized) {
      const forceBootstrap = async () => {
        console.log(
          "🔄 Force bootstrapping search models on dashboard load..."
        );
        try {
          await bootstrapSearchModels();
          console.log(
            "✅ Search models bootstrapped successfully on dashboard load"
          );
        } catch (error) {
          console.error(
            "❌ Failed to bootstrap search models on dashboard load:",
            error
          );
        }
      };
      // Small delay to ensure component is fully mounted
      const timer = setTimeout(forceBootstrap, 100);
      return () => clearTimeout(timer);
    } else {
      console.log("✅ Search models already initialized, skipping bootstrap");
    }
  }, [isInitialized]);

  // Additional bootstrap on mount to ensure models are available
  useEffect(() => {
    const immediateBootstrap = async () => {
      console.log("🚀 Immediate bootstrap on dashboard mount...");
      try {
        await bootstrapSearchModels();
        console.log("✅ Immediate bootstrap completed successfully");
      } catch (error) {
        console.error("❌ Immediate bootstrap failed:", error);
      }
    };
    immediateBootstrap();
  }, []); // Empty dependency array - runs once on mount

  const [savedSearch, setSavedSearch] = useState<SavedSearch | null>(null);

  const { data: schemasData } = useApiServiceGetApiV1Schemas();
  const availableSchemas = schemasData?.results || [];

  useEffect(() => {
    async function checkSavedSearch() {
      const existing = await savedSearchesService.isSearchSaved({
        tokens,
        freeText: freeTextQuery,
      });
      setSavedSearch(existing);
    }
    checkSavedSearch();
  }, [isSearching]);

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

      // Skip _name fields as they are only for display purposes
      if (key.endsWith("_name")) continue;

      let displayValue = String(value);

      // Handle schema fields specially - they should create tokens for display but not be processed as filters
      if (key === "schema") {
        // For schema fields, look up the name from available schemas
        const schemaName = availableSchemas?.find(
          (schema: any) => schema.id === value
        )?.name;
        if (schemaName) {
          displayValue = schemaName;
        }

        // Create a token for display purposes (schema is handled separately in query body)
        tokens.push({
          model: model || "Dataset",
          field: key,
          operator: "=",
          value: value,
          displayValue: displayValue,
          apiField: getApiField(model || "Dataset", key),
        });
        continue;
      }

      tokens.push({
        model: model || "Dataset",
        field: key,
        operator: typeof value === "string" ? "regex" : "=",
        value: value,
        displayValue: displayValue,
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
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        key !== "schema"
      ) {
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
          {savedSearch ? (
            <>
              <TypographyH2 text="Saved Search:" />
              <TypographyH2Ghost text={savedSearch.name} />
            </>
          ) : (
            <TypographyH2
              text={
                isShowingSearchResults
                  ? "Search Results"
                  : "Perform a search to see results"
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
                className="bg-blue-100 text-blue-800 border-blue-300 cursor-pointer hover:bg-blue-200 transition-colors"
                onClick={() => {
                  const newTokens = tokens.filter((_, index) => index !== i);
                  setTokens(newTokens);
                }}
                title={`Click to remove: ${token.model}.${token.field} ${
                  token.operator
                } ${formatTokenDisplayValue(token)}`}
              >
                {token.model}.{token.field} {token.operator}{" "}
                {formatTokenDisplayValue(token)}
                <X className="w-3 h-3 text-blue-400 hover:text-red-500 ml-1" />
              </Badge>
            ))}
            {freeTextQuery && (
              <Badge
                variant="outline"
                className="bg-white text-blue-700 border-blue-300 cursor-pointer hover:bg-blue-50 transition-colors"
                onClick={() => setFreeTextQuery("")}
                title={`Click to remove free text query: "${freeTextQuery}"`}
              >
                "{freeTextQuery}"
                <X className="w-3 h-3 text-blue-400 hover:text-red-500 ml-1" />
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

      <div className="flex flex-wrap gap-4 mt-2 mb-6 items-center">
        {/* <CommonFilters filterState={filterState} onChange={setFilterState} /> */}

        {isShowingSearchResults && (
          <>
            {" "}
            <Button
              variant="default"
              onClick={() => setIsDialogOpen(!isDialogOpen)}
              className="w-[160px] mb-1"
              size={"xl"}
            >
              <ListFilter />
              <span>Extensive Filter</span>
            </Button>
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
          </>
        )}
      </div>

      <EnhancedFilterDialog
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
          className={`flex flex-col justify-center items-center text-gray-500 transition-opacity duration-500 ${
            showLoading ? "opacity-100" : "opacity-0"
          }`}
        >
          <Lottie
            style={{ width: 450, height: 450 }}
            animationData={notFoundAnimation}
            loop={false}
          />
          {isShowingSearchResults ? (
            <p className="animate-pulse">Searching for results...</p>
          ) : (
            <div className="flex flex-col items-center transition-opacity duration-700 opacity-100">
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
