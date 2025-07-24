import { apiClient } from "@/utils/api-client";
import {
  API_OPERATOR_MAP,
  getApiModelName,
  getApiField,
  supportsTrigramSearch,
} from "@/types/search/search-models";

export interface SearchRequestBody {
  q?: string;
  filters?: { [key: string]: any };
  model?: string;
  schema?: string;
}

export interface SearchResponse {
  results: any[];
  count: number;
  next?: string | null;
  previous?: string | null;
}

export const searchApi = async (
  queryBody: SearchRequestBody
): Promise<SearchResponse> => {
  try {
    const response = await apiClient.instance.post("/api/v1/query/", queryBody);
    console.log("Search API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error during main API search:", error);
    throw error;
  }
};

// Updated function to properly handle tokenized suggestions
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
    }>; // Previously completed search tokens
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

  // Build filters array for combining completed tokens with current suggestion filter
  const allFilters: any[] = [];

  // Add completed tokens as exact filters
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

  // Handle current input for suggestions
  if (options?.fieldKey && inputValue.trim()) {
    // Field-specific suggestions - always use $regex for partial matching
    const apiField = getApiField(modelKey, options.fieldKey);

    allFilters.push({
      [apiField]: { $regex: inputValue.trim() },
    });
  } else if (inputValue.trim() && !options?.fieldKey) {
    // Free text search when no specific field is targeted
    queryBody.q = inputValue.trim();
  }

  // Combine all filters
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

// Function for building full search queries (not suggestions)
export function buildApiQueryParams(
  modelKey: string,
  searchConfig: {
    textQuery?: string; // For trigram search
    filters?: Array<{
      field: string;
      operator: string; // UI operator
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

  // Add trigram search if provided
  if (searchConfig.textQuery && searchConfig.textQuery.trim()) {
    queryBody.q = searchConfig.textQuery.trim();
  }

  // Build filters
  if (searchConfig.filters && searchConfig.filters.length > 0) {
    queryBody.filters = {};

    // Handle complex filter logic
    if (searchConfig.filters.length === 1) {
      // Single filter - simple case
      const filter = searchConfig.filters[0];
      const apiField = getApiField(modelKey, filter.field);
      const apiOperator =
        API_OPERATOR_MAP[filter.operator as keyof typeof API_OPERATOR_MAP] ||
        "$eq";

      queryBody.filters[apiField] = {
        [apiOperator]: filter.value,
      };
    } else {
      // Multiple filters - use $and
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

// New function specifically for handling tokenized search suggestions
export function buildTokenizedSuggestionQuery(
  modelKey: string,
  completedTokens: Array<{
    field: string;
    operator: string;
    value: any;
  }>,
  currentField: string | null, // null means free text search
  currentInput: string,
  schema?: string
): SearchRequestBody {
  return buildApiQueryParamsForSuggestions(modelKey, currentInput, {
    fieldKey: currentField || undefined,
    schema,
    completedTokens,
    useTrigramSearch: !currentField, // Use trigram only for free text
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
    return response.data;
  } catch (error) {
    console.error("Error during API suggestion search:", error);
    throw error;
  }
};

// Legacy convenience function for trigram-based suggestions (kept for compatibility)
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

// Legacy convenience function for field-specific suggestions (kept for compatibility)
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

// New convenience function for field-specific suggestions with completed tokens
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

// New convenience function for trigram suggestions with completed tokens
export const getTrigramSuggestionsWithTokens = async (
  modelKey: string,
  inputValue: string,
  completedTokens: Array<{ field: string; operator: string; value: any }> = [],
  schema?: string
): Promise<SearchResponse> => {
  const queryBody = buildTokenizedSuggestionQuery(
    modelKey,
    completedTokens,
    null, // null means free text search
    inputValue,
    schema
  );
  return searchSuggestionsApi(queryBody);
};

// Function for exact field searches (final search, not suggestions)
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

// Function for combined text and filter search
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

// New function for executing final tokenized search (when user hits enter/search)
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
