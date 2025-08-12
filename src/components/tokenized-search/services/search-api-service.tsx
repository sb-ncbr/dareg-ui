import { apiClient } from "@/utils/api-client";
import {
  API_OPERATOR_MAP,
  getApiModelName,
  getApiField,
  supportsTrigramSearch,
} from "@/components/tokenized-search/types/search-models";
import { Token } from "@/components/tokenized-search/types/search-models";
import { useQuery } from "@tanstack/react-query";

export interface SearchRequestBody {
  q?: string;
  filters?: { [key: string]: any };
  model?: string;
  schema?: string;
}

export interface SearchResponse {
  results: any[];
  total: number;
  count: number;
  next?: string | null;
  previous?: string | null;
  page?: number;
  limit?: number;
}

export const searchApi = async (
  queryBody: SearchRequestBody
): Promise<SearchResponse> => {
  try {
    const response = await apiClient.instance.post("/api/v1/query/", queryBody);

    return {
      results: response.data.results || [],
      total: response.data.count || response.data.total || 0,
      count: response.data.count || response.data.total || 0,
      next: response.data.next || null,
      previous: response.data.previous || null,
      page: response.data.page || 1,
      limit: response.data.limit || 20,
    };
  } catch (error) {
    console.error("Error during main API search:", error);
    throw error;
  }
};

export function buildApiQueryParamsForSuggestions(
  modelKey: string,
  inputValue: string,
  options?: {
    fieldKey?: string;
    operator?: string;
    schema?: string;
    completedTokens?: Array<{
      field: string;
      operator: string;
      value: any;
    }>;
    useTrigramSearch?: boolean;
  }
): SearchRequestBody {
  const apiModel = getApiModelName(modelKey);
  const queryBody: SearchRequestBody = {
    model: apiModel,
  };

  if (options?.schema) {
    queryBody.schema = options.schema;
  }

  const allFilters: any[] = [];

  if (options?.completedTokens && options.completedTokens.length > 0) {
    options.completedTokens.forEach((token) => {
      const apiField = getApiField(modelKey, token.field);
      const apiOperator =
        API_OPERATOR_MAP[token.operator as keyof typeof API_OPERATOR_MAP] ||
        "$eq";

      allFilters.push({
        [apiField]: { [apiOperator]: token.value },
      });
    });
  }

  if (options?.fieldKey && inputValue.trim()) {
    const apiField = getApiField(modelKey, options.fieldKey);

    allFilters.push({
      [apiField]: { $contains: inputValue.trim() },
    });
  } else if (inputValue.trim() && !options?.fieldKey) {
    queryBody.q = inputValue.trim();
  }

  if (allFilters.length > 0) {
    if (allFilters.length === 1) {
      queryBody.filters = allFilters[0];
    } else {
      queryBody.filters = {
        $and: allFilters,
      };
    }
  }

  return queryBody;
}

export function buildApiQueryParams(
  modelKey: string,
  searchConfig: {
    textQuery?: string;
    filters?: Array<{
      field: string;
      operator: string;
      value: any;
    }>;
    schema?: string;
  }
): SearchRequestBody {
  const apiModel = getApiModelName(modelKey);
  const queryBody: SearchRequestBody = {
    model: apiModel,
  };

  if (searchConfig.schema) {
    queryBody.schema = searchConfig.schema;
  }

  if (searchConfig.textQuery && searchConfig.textQuery.trim()) {
    queryBody.q = searchConfig.textQuery.trim();
  }

  if (searchConfig.filters && searchConfig.filters.length > 0) {
    queryBody.filters = {};

    if (searchConfig.filters.length === 1) {
      const filter = searchConfig.filters[0];
      const apiField = getApiField(modelKey, filter.field);
      const apiOperator =
        API_OPERATOR_MAP[filter.operator as keyof typeof API_OPERATOR_MAP] ||
        "$eq";

      queryBody.filters[apiField] = {
        [apiOperator]: filter.value,
      };
    } else {
      queryBody.filters = {
        $and: searchConfig.filters.map((filter) => {
          const apiField = getApiField(modelKey, filter.field);
          const apiOperator =
            API_OPERATOR_MAP[
              filter.operator as keyof typeof API_OPERATOR_MAP
            ] || "$eq";

          return {
            [apiField]: {
              [apiOperator]: filter.value,
            },
          };
        }),
      };
    }
  }

  return queryBody;
}

export function buildApiQueryParamsFromTokens(
  tokens: Token[],
  freeTextQuery: string
): SearchRequestBody {
  const requestBody: SearchRequestBody = {};

  const uniqueModels = new Set(tokens.map((t) => t.model));
  if (uniqueModels.size === 1) {
    const modelKey = uniqueModels.values().next().value as string;
    requestBody.model = getApiModelName(modelKey);
  }

  const andFilters = tokens.map((token) => {
    const apiOperator =
      API_OPERATOR_MAP[token.operator as keyof typeof API_OPERATOR_MAP] ||
      "$eq";
    const apiField = getApiField(token.model, token.field);

    // Date range object support: expand to $gte/$lte
    if (
      token.value &&
      typeof token.value === "object" &&
      ("from" in (token.value as any) || "to" in (token.value as any))
    ) {
      const range = token.value as { from?: Date | string; to?: Date | string };
      const parts: any[] = [];
      if (range.from) {
        const fromIso =
          range.from instanceof Date
            ? range.from.toISOString()
            : new Date(range.from).toISOString();
        parts.push({ [apiField]: { $gte: fromIso } });
      }
      if (range.to) {
        const toIso =
          range.to instanceof Date
            ? range.to.toISOString()
            : new Date(range.to).toISOString();
        parts.push({ [apiField]: { $lte: toIso } });
      }
      return parts;
    }

    let valueToAssign: any;
    if (token.value instanceof Date) {
      valueToAssign = token.value.toISOString();
    } else if (
      typeof token.value === "string" &&
      (token.value.toLowerCase() === "true" ||
        token.value.toLowerCase() === "false")
    ) {
      valueToAssign = token.value.toLowerCase() === "true";
    } else {
      valueToAssign = token.value as any;
    }
    return { [apiField]: { [apiOperator]: valueToAssign } };
  });

  const flatFilters: any[] = ([] as any[]).concat(
    ...andFilters.map((f) => (Array.isArray(f) ? f : [f]))
  );

  if (flatFilters.length === 1) {
    requestBody.filters = flatFilters[0];
  } else if (flatFilters.length > 1) {
    requestBody.filters = { $and: flatFilters } as any;
  }

  if (freeTextQuery) {
    requestBody.q = freeTextQuery;
  }

  return requestBody;
}

export function buildTokenizedSuggestionQuery(
  modelKey: string,
  completedTokens: Array<{
    field: string;
    operator: string;
    value: any;
  }>,
  currentField: string | null,
  currentInput: string,
  schema?: string
): SearchRequestBody {
  return buildApiQueryParamsForSuggestions(modelKey, currentInput, {
    fieldKey: currentField || undefined,
    schema,
    completedTokens,
    useTrigramSearch: !currentField,
  });
}

export const searchSuggestionsApi = async (
  queryBody: SearchRequestBody
): Promise<SearchResponse> => {
  console.log(
    "searchSuggestionsApi called with:",
    JSON.stringify(queryBody, null, 2)
  );
  try {
    const response = await apiClient.instance.post("/api/v1/query/", queryBody);
    console.log("Suggestions API response:", response.data);

    return {
      results: response.data.results || [],
      total: response.data.count || response.data.total || 0,
      count: response.data.count || response.data.total || 0,
      next: response.data.next || null,
      previous: response.data.previous || null,
      page: response.data.page || 1,
      limit: response.data.limit || 20,
    };
  } catch (error) {
    console.error("Error during API suggestion search:", error);
    throw error;
  }
};

export const getTrigramSuggestions = async (
  modelKey: string,
  inputValue: string,
  schema?: string
): Promise<SearchResponse> => {
  const queryBody = buildApiQueryParamsForSuggestions(modelKey, inputValue, {
    schema,
    useTrigramSearch: true,
  });
  return searchSuggestionsApi(queryBody);
};

export const getFieldSuggestions = async (
  modelKey: string,
  fieldKey: string,
  inputValue: string,
  operator: string = "contains",
  schema?: string
): Promise<SearchResponse> => {
  const queryBody = buildApiQueryParamsForSuggestions(modelKey, inputValue, {
    fieldKey,
    operator,
    schema,
    useTrigramSearch: false,
  });
  return searchSuggestionsApi(queryBody);
};

export const getFieldSuggestionsWithTokens = async (
  modelKey: string,
  fieldKey: string,
  inputValue: string,
  completedTokens: Array<{ field: string; operator: string; value: any }> = [],
  schema?: string
): Promise<SearchResponse> => {
  const queryBody = buildTokenizedSuggestionQuery(
    modelKey,
    completedTokens,
    fieldKey,
    inputValue,
    schema
  );
  return searchSuggestionsApi(queryBody);
};

export const getTrigramSuggestionsWithTokens = async (
  modelKey: string,
  inputValue: string,
  completedTokens: Array<{ field: string; operator: string; value: any }> = [],
  schema?: string
): Promise<SearchResponse> => {
  const queryBody = buildTokenizedSuggestionQuery(
    modelKey,
    completedTokens,
    null,
    inputValue,
    schema
  );
  return searchSuggestionsApi(queryBody);
};

export const searchExactField = async (
  modelKey: string,
  fieldKey: string,
  inputValue: string,
  operator: string = "=",
  schema?: string
): Promise<SearchResponse> => {
  const queryBody = buildApiQueryParams(modelKey, {
    filters: [
      {
        field: fieldKey,
        operator: operator,
        value: inputValue,
      },
    ],
    schema,
  });

  return searchApi(queryBody);
};

export const searchWithTextAndFilters = async (
  modelKey: string,
  textQuery: string,
  filters: Array<{ field: string; operator: string; value: any }>,
  schema?: string
): Promise<SearchResponse> => {
  const queryBody = buildApiQueryParams(modelKey, {
    textQuery,
    filters,
    schema,
  });

  return searchApi(queryBody);
};

export const executeTokenizedSearch = async (
  modelKey: string,
  completedTokens: Array<{ field: string; operator: string; value: any }>,
  freeTextQuery?: string,
  schema?: string
): Promise<SearchResponse> => {
  const queryBody = buildApiQueryParams(modelKey, {
    textQuery: freeTextQuery,
    filters: completedTokens,
    schema,
  });

  return searchApi(queryBody);
};

export interface SearchResultItem {
  id: string;
  text: string;
  model: "Dataset" | "Project" | "Schema";
  highlights: string[];
}

export interface OrganizedSearchResults {
  datasets: SearchResultItem[];
  projects: SearchResultItem[];
  schemas: SearchResultItem[];
}

export function organizeSearchResults(
  results: SearchResultItem[]
): OrganizedSearchResults {
  const organized: OrganizedSearchResults = {
    datasets: [],
    projects: [],
    schemas: [],
  };

  results.forEach((result) => {
    switch (result.model) {
      case "Dataset":
        organized.datasets.push(result);
        break;
      case "Project":
        organized.projects.push(result);
        break;
      case "Schema":
        organized.schemas.push(result);
        break;
      default:
        organized.datasets.push(result);
    }
  });

  return organized;
}

export const fetchSearchPageByUrl = async (
  lastSearchQuery: any,
  offset: number,
  limit: number = 10,
  setSearchResults?: (results: SearchResponse) => void
): Promise<SearchResponse> => {
  try {
    console.log("Fetching search page by URL with body:", lastSearchQuery);
    const response = await apiClient.instance.post(
      "/api/v1/query/?limit=" + limit + "&offset=" + offset,
      lastSearchQuery
    );
    const result: SearchResponse = {
      results: response.data.results || [],
      total: response.data.count || response.data.total || 0,
      count: response.data.count || response.data.total || 0,
      next: response.data.next || null,
      previous: response.data.previous || null,
      page: response.data.page || Math.floor(offset / limit) + 1,
      limit: response.data.limit || limit,
    };
    if (setSearchResults) setSearchResults(result);
    return result;
  } catch (error) {
    console.error("Error fetching paginated search:", error);
    throw error;
  }
};

export const fetchSearchPageByNumber = async (
  lastSearchQuery: any,
  page: number,
  setSearchResults?: (results: SearchResponse) => void
): Promise<SearchResponse> => {
  try {
    // Clone and set page/offset/limit as needed
    const queryBody = { ...lastSearchQuery, page };
    const response = await apiClient.instance.post("/api/v1/query/", queryBody);
    const result: SearchResponse = {
      results: response.data.results || [],
      total: response.data.count || response.data.total || 0,
      count: response.data.count || response.data.total || 0,
      next: response.data.next || null,
      previous: response.data.previous || null,
      page: response.data.page || page,
      limit: response.data.limit || 20,
    };
    if (setSearchResults) setSearchResults(result);
    return result;
  } catch (error) {
    console.error("Error fetching page by number:", error);
    throw error;
  }
};

// export function useDatasetsById(ids: string[], enabled: boolean = true) {
//   return useQuery({
//     queryKey: ["datasets", "by-ids", ids.sort()],
//     queryFn: async () => {
//       if (ids.length === 0) return { results: [] };

//       const idsParam = ids.join(",");

//       const response = await apiClient.instance.get(
//         `/api/v1/datasets/?id__in=${idsParam}`
//       );

//       return response.data;
//     },
//     enabled: enabled && ids.length > 0,
//     staleTime: 5 * 60 * 1000,
//     gcTime: 10 * 60 * 1000,
//   });
// }

// export function useProjectsById(ids: string[], enabled: boolean = true) {
//   return useQuery({
//     queryKey: ["projects", "by-ids", ids.sort()],
//     queryFn: async () => {
//       if (ids.length === 0) return { results: [] };

//       const idsParam = ids.join(",");

//       const response = await apiClient.instance.get(
//         `/api/v1/projects/?id__in=${idsParam}`
//       );

//       return response.data;
//     },
//     enabled: enabled && ids.length > 0,
//     staleTime: 5 * 60 * 1000,
//     gcTime: 10 * 60 * 1000,
//   });
// }

// export function useSchemasById(ids: string[], enabled: boolean = true) {
//   return useQuery({
//     queryKey: ["schemas", "by-ids", ids.sort()],
//     queryFn: async () => {
//       if (ids.length === 0) return { results: [] };

//       const idsParam = ids.join(",");

//       const response = await apiClient.instance.get(
//         `/api/v1/schemas/?id__in=${idsParam}`
//       );

//       return response.data;
//     },
//     enabled: enabled && ids.length > 0,
//     staleTime: 5 * 60 * 1000,
//     gcTime: 10 * 60 * 1000,
//   });
// }

export function useSearchResultQueries(
  organizedResults: OrganizedSearchResults,
  enabled: boolean = true
) {
  // Placeholder hook until entity fetching hooks are wired.
  // Keeps API stability for callers without introducing missing imports.
  const datasetIds = organizedResults.datasets.map((d) => d.id);
  const projectIds = organizedResults.projects.map((p) => p.id);
  const schemaIds = organizedResults.schemas.map((s) => s.id);

  console.log("Using search result queries with IDs:", {
    datasetIds,
    projectIds,
    schemaIds,
  });

  return {
    datasets: {
      query: null as any,
      isLoading: false,
      data: [] as any[],
      error: null as any,
      isError: false,
    },
    projects: {
      query: null as any,
      isLoading: false,
      data: [] as any[],
      error: null as any,
      isError: false,
    },
    schemas: {
      query: null as any,
      isLoading: false,
      data: [] as any[],
      error: null as any,
      isError: false,
    },
    isLoading: false,
    isError: false,
    errors: [],
  };
}
