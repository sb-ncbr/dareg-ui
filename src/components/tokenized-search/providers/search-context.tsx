"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useMutation } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Token } from "@/components/tokenized-search/types/search-models";
import {
  SearchHistoryService,
  SearchHistoryEntry,
} from "@/services/search-history-service";
import {
  buildApiQueryParamsForSuggestions,
  searchApi,
  searchSuggestionsApi,
  buildApiQueryParamsFromTokens,
} from "@/components/tokenized-search/services/search-api-service";
import { bootstrapSearchModels } from "../services/bootstrap-service";

export type SearchContextType = {
  tokens: Token[];
  setTokens: React.Dispatch<React.SetStateAction<Token[]>>;
  freeTextQuery: string;
  setFreeTextQuery: React.Dispatch<React.SetStateAction<string>>;
  selectedSchemaId: string | null;
  setSelectedSchemaId: React.Dispatch<React.SetStateAction<string | null>>;
  isSearching: boolean;
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
  searchResults: any;
  setSearchResults: React.Dispatch<React.SetStateAction<any>>;
  lastSearchQuery: any;
  setLastSearchQuery: React.Dispatch<React.SetStateAction<any>>;
  performSearch: (params: {
    queryBody: any;
    navigate?: boolean;
    tokens?: Token[];
    freeText?: string;
  }) => void;
  buildApiQueryParams: (
    tokens: Token[],
    freeTextQuery: string
  ) => { q?: string; filters?: any; model?: string; schema?: string };
  buildApiQueryParamsForSuggestions: typeof buildApiQueryParamsForSuggestions;
  searchSuggestionsApi: typeof searchSuggestionsApi;
  navigateToSearchResults: (searchTokens: Token[], freeText: string) => void;
  addToHistory: (tokens: Token[], freeText: string) => void;
  clearHistory: () => void;
  getHistory: () => SearchHistoryEntry[];
  isInitialized: boolean;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [freeTextQuery, setFreeTextQuery] = useState<string>("");
  const [selectedSchemaId, setSelectedSchemaId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [lastSearchQuery, setLastSearchQuery] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const initialize = async () => {
      await bootstrapSearchModels();
      setIsInitialized(true);
    };
    initialize();
  }, []);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setTokens([]); // Clear tokens when route changes
  }, [pathname]);

  useEffect(() => {
    if (tokens.length === 0) {
      const qParam = searchParams.get("q");
      const tokensParam = searchParams.get("tokens");
      const freeTextParam = searchParams.get("freeText");

      let restoredTokens: Token[] = [];
      let restoredQueryBody: any = {};
      let restoredFreeText = "";

      if (tokensParam) {
        try {
          restoredTokens = JSON.parse(decodeURIComponent(tokensParam));
          setTokens(restoredTokens);
        } catch (e) {}
      }
      if (qParam) {
        try {
          restoredQueryBody = JSON.parse(decodeURIComponent(qParam));
          setLastSearchQuery(restoredQueryBody);
          if (restoredQueryBody && restoredQueryBody.schema) {
            setSelectedSchemaId(restoredQueryBody.schema);
          }
        } catch (e) {}
      }
      if (freeTextParam) {
        try {
          restoredFreeText = decodeURIComponent(freeTextParam);
          setFreeTextQuery(restoredFreeText);
        } catch (e) {}
      }

      if ((restoredTokens && restoredTokens.length > 0) || qParam) {
        performSearch({
          queryBody: restoredQueryBody,
          tokens: restoredTokens,
          freeText: restoredFreeText,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const buildApiQueryParams = useCallback(
    (tokens: Token[], freeTextQuery: string) => {
      const base = buildApiQueryParamsFromTokens(tokens, freeTextQuery);
      if (selectedSchemaId) {
        return { ...base, schema: selectedSchemaId } as typeof base & {
          schema: string;
        };
      }
      return base;
    },
    [selectedSchemaId]
  );

  const navigateToSearchResults = useCallback(
    (searchTokens: Token[], freeText: string) => {
      console.log("navigateToSearchResults called with:", {
        searchTokens,
        freeText,
      });
      const queryBody = buildApiQueryParams(searchTokens, freeText);
      console.log("Generated queryBody for navigation:", queryBody);
      const searchParams = new URLSearchParams();
      searchParams.set("q", encodeURIComponent(JSON.stringify(queryBody)));
      if (searchTokens.length > 0) {
        searchParams.set(
          "tokens",
          encodeURIComponent(JSON.stringify(searchTokens))
        );
      }
      if (freeText) {
        searchParams.set("freeText", encodeURIComponent(freeText));
      }
      searchParams.set("timestamp", Date.now().toString());
      const url = `/dashboards?${searchParams.toString()}`;
      console.log("Navigating to URL:", url);
      router.push(url);
    },
    [router, buildApiQueryParams]
  );

  const addToHistory = useCallback((tokens: Token[], freeText: string) => {
    SearchHistoryService.addSearch(tokens, freeText);
  }, []);
  const clearHistory = useCallback(() => {
    SearchHistoryService.clearHistory();
  }, []);
  const getHistory = useCallback(() => {
    const history = SearchHistoryService.getHistory();
    console.log("history", history);
    return history;
  }, []);

  const { mutate: performSearch } = useMutation({
    mutationFn: async (params: {
      queryBody: any;
      navigate?: boolean;
      tokens?: Token[];
      freeText?: string;
    }) => {
      setIsSearching(true);
      try {
        if (params.navigate) {
          navigateToSearchResults(params.tokens || [], params.freeText || "");
          return null;
        }
        const response = await searchApi(params.queryBody);
        if (response) {
          const resultsWithModel = (response.results || []).map(
            (item: any) => ({
              ...item,
              model: item.model || params.queryBody.model,
            })
          );
          setSearchResults({
            results: resultsWithModel,
            total: response.total || 0,
            next: response.next || null,
            previous: response.previous || null,
            page: response.page || 1,
            limit: response.limit || 20,
          });
          setLastSearchQuery(params.queryBody);
        }
        return response;
      } finally {
        setIsSearching(false);
      }
    },
    onError: (error) => {
      setIsSearching(false);
      setSearchResults(null);
      setLastSearchQuery(null);
      console.error("Search API Error:", error);
    },
  });

  const value: SearchContextType = {
    tokens,
    setTokens,
    freeTextQuery,
    setFreeTextQuery,
    selectedSchemaId,
    setSelectedSchemaId,
    isSearching,
    setIsSearching,
    searchResults,
    setSearchResults,
    lastSearchQuery,
    setLastSearchQuery,
    performSearch,
    buildApiQueryParams,
    buildApiQueryParamsForSuggestions,
    searchSuggestionsApi,
    navigateToSearchResults,
    addToHistory,
    clearHistory,
    getHistory,
    isInitialized,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) throw new Error("useSearch must be used within SearchProvider");
  return context;
}
