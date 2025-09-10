"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { X, Search, Loader2, History, SearchIcon } from "lucide-react";
import {
  Token,
  FilterOption,
  Operator,
  MODEL_MAP,
  DEFAULT_DATE_RANGE,
} from "@/components/tokenized-search/types/search-models";
import suggestionFieldsConfig from "./configuration/search-suggestion-fields.json";
import { CommonFilterState } from "./filters/common-filters";
import { useSearch } from "./providers/search-context";
import { usePathname } from "next/navigation";
import { SearchHistoryService } from "@/services/search-history-service";
import { set } from "zod";
import { formatTokenDisplayValue } from "@/utils/token-display";
import TemplateSelectSSR from "@/components/select/template-select";
import ProjectSelectSSR from "@/components/select/project-select";

const OPERATORS: Operator[] = [
  "=",
  "!=",
  "<",
  ">",
  "<=",
  ">=",
  "contains",
  "regex",
];

function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
  let timeoutId: NodeJS.Timeout | null;
  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

export default function SearchBar() {
  const pathname = usePathname();
  const {
    tokens,
    setTokens,
    freeTextQuery,
    setFreeTextQuery,
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
    selectedSchemaId,
  } = useSearch();

  const [model, setModel] = useState<string | null>(null);
  const [field, setField] = useState<FilterOption | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverTriggerRef = useRef<HTMLDivElement>(null);
  const [popoverHistoryMode, setPopoverHistoryMode] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  const popoverContentState = !model
    ? "select_model"
    : !field
    ? "select_field"
    : !operator
    ? "select_operator"
    : "enter_value";

  const [currentFieldSuggestions, setCurrentFieldSuggestions] = useState<
    string[]
  >([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  // Helper function to determine if a field needs a dropdown
  const getFieldDropdownType = useCallback(
    (fieldKey: string): "schema" | "project" | null => {
      if (fieldKey === "schema") return "schema";
      if (fieldKey === "project") return "project";
      if (fieldKey.includes("_id") || fieldKey === "reservationId")
        return "project"; // Default to project for ID fields
      return null;
    },
    []
  );

  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const allModelNames = React.useMemo(
    () => Object.keys(MODEL_MAP).map((key) => MODEL_MAP[key].label),
    [MODEL_MAP]
  );
  const modelSuggestions = React.useMemo(() => {
    return inputValue.length > 0
      ? allModelNames.filter((name) =>
          name.toLowerCase().includes(inputValue.toLowerCase())
        )
      : allModelNames;
  }, [inputValue, allModelNames]);

  const suggestionFieldsConfigTyped = suggestionFieldsConfig as Record<
    string,
    string[]
  >;
  const getAllowedSuggestionFields = useCallback((m: string): string[] => {
    return suggestionFieldsConfigTyped[m.toLowerCase() ?? ""] || [];
  }, []);
  const allowedFields = React.useMemo(
    () => (model ? getAllowedSuggestionFields(model) : []),
    [model, getAllowedSuggestionFields]
  );
  const fieldOptions = React.useMemo(() => {
    if (!model) return [] as FilterOption[];
    return MODEL_MAP[model].filters.filter(
      (f) =>
        allowedFields.includes(f.key) &&
        f.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [model, allowedFields, inputValue]);

  useEffect(() => {
    let active = true;
    if (
      model &&
      field &&
      inputValue.length > 0 &&
      popoverContentState === "enter_value"
    ) {
      setIsLoadingSuggestions(true);
      const suggestionQueryBody = buildApiQueryParamsForSuggestions(
        model,
        inputValue,
        {
          fieldKey: field.key,
          completedTokens: tokens,
          schema: selectedSchemaId || undefined,
        }
      );
      searchSuggestionsApi(suggestionQueryBody)
        .then((response) => {
          if (!active) return;
          if (!response.results || response.results.length === 0) {
            setCurrentFieldSuggestions([]);
            setIsLoadingSuggestions(false);
            return;
          }
          const suggestions = response.results
            .flatMap((item: any) => {
              if (!item.highlights || !Array.isArray(item.highlights))
                return [];
              return item.highlights
                .map((highlight: string) => {
                  let fieldName: string;
                  let value: string;
                  if (highlight.includes(" → ")) {
                    const parts = highlight.split(" → ");
                    fieldName = parts[0].trim();
                    value = parts[1]?.trim() || "";
                  } else if (highlight.includes(": ")) {
                    const parts = highlight.split(": ");
                    fieldName = parts[0].trim();
                    value = parts[1]?.trim() || "";
                  } else {
                    return null;
                  }
                  if (fieldName === field.key) return value;
                  return null;
                })
                .filter(Boolean);
            })
            .filter(
              (value) => value !== null && value !== undefined && value !== ""
            )
            .filter((value, index, array) => array.indexOf(value) === index)
            .map(String)
            .filter((stringValue) =>
              stringValue.toLowerCase().includes(inputValue.toLowerCase())
            )
            .slice(0, 10);
          setCurrentFieldSuggestions(suggestions);
          setIsLoadingSuggestions(false);
        })
        .catch(() => {
          if (!active) return;
          setCurrentFieldSuggestions([]);
          setIsLoadingSuggestions(false);
        });
    } else {
      setCurrentFieldSuggestions([]);
      setIsLoadingSuggestions(false);
    }
    return () => {
      active = false;
    };
  }, [
    model,
    field,
    inputValue,
    popoverContentState,
    tokens,
    buildApiQueryParamsForSuggestions,
    searchSuggestionsApi,
    selectedSchemaId,
  ]);

  useEffect(() => {
    let listLength = 0;
    if (popoverContentState === "select_model")
      listLength = modelSuggestions.length;
    else if (popoverContentState === "select_field")
      listLength = fieldOptions.length;
    else if (popoverContentState === "select_operator")
      listLength = OPERATORS.length;
    else if (popoverContentState === "enter_value")
      // Add 1 for the free text option if there's input, plus API suggestions
      listLength =
        (inputValue.length > 0 ? 1 : 0) + currentFieldSuggestions.length;
    setHighlightedIndex(listLength > 0 ? 0 : -1);
    // eslint-disable-next-line
  }, [
    popoverContentState,
    modelSuggestions.length,
    fieldOptions.length,
    currentFieldSuggestions.length,
    inputValue.length,
    isPopoverOpen,
  ]);

  const resetFilterBuildingState = () => {
    setModel(null);
    setField(null);
    setOperator(null);
    setInputValue("");
  };

  const buildToken = useCallback(
    (v: string) => {
      if (!model || !field || !operator || v === "") return null;
      let castedValue: string | number | Date | boolean;
      if (field.inputType === "number") {
        const num = Number(v);
        castedValue = Number.isFinite(num) ? num : v;
      } else if (field.inputType === "date") {
        const d = new Date(v);
        castedValue = isNaN(d.getTime()) ? v : d;
      } else if (v.toLowerCase() === "true" || v.toLowerCase() === "false") {
        castedValue = v.toLowerCase() === "true";
      } else {
        castedValue = v;
      }
      return {
        model,
        field: field.key,
        operator,
        value: castedValue,
        displayValue: v,
      } as Token;
    },
    [model, field, operator]
  );

  const addFinalToken = (value: string = inputValue) => {
    const newToken = buildToken(value);
    if (!newToken) return;
    setTokens((prevTokens) => {
      const newTokens = [...prevTokens, newToken];
      debouncedMainSearch(newTokens, freeTextQuery);
      return newTokens;
    });
    resetFilterBuildingState();
    setIsPopoverOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const removeToken = (index: number) => {
    setTokens(tokens.filter((_, i) => i !== index));
    inputRef.current?.focus();
  };

  const handleBackspace = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && inputValue === "") {
      e.preventDefault();
      if (operator) setOperator(null);
      else if (field) setField(null);
      else if (model) setModel(null);
      else if (tokens.length > 0) setTokens(tokens.slice(0, -1));
      else if (freeTextQuery) setFreeTextQuery(""); // <-- Add this line
    }
  };

  const debouncedMainSearch = useCallback(
    debounce(
      (
        currentTokens: Token[],
        currentFreeTextQuery: string,
        shouldNavigate: boolean = false
      ) => {
        const queryBody = buildApiQueryParams(
          currentTokens,
          currentFreeTextQuery
        );
        if (
          Object.keys(queryBody).length > 0 &&
          (queryBody.q || queryBody.filters)
        ) {
          performSearch({
            queryBody,
            navigate: shouldNavigate,
            tokens: currentTokens,
            freeText: currentFreeTextQuery,
          });
        } else if (currentTokens.length === 0 && !currentFreeTextQuery) {
          setSearchResults(null);
          setLastSearchQuery(null);
          if (shouldNavigate) {
            performSearch({
              queryBody: {},
              navigate: shouldNavigate,
              tokens: currentTokens,
              freeText: currentFreeTextQuery,
            });
          } else {
            performSearch({ queryBody: {} });
          }
        }
      },
      500
    ),
    [performSearch, setSearchResults, setLastSearchQuery, buildApiQueryParams]
  );

  useEffect(() => {
    debouncedMainSearch(tokens, freeTextQuery);
  }, [tokens, freeTextQuery, debouncedMainSearch]);

  const getPlaceholder = () => {
    if (model && field && operator) {
      return `Enter value for ${field.label} ${operator}...`;
    }
    if (model && field) {
      return `Select operator for ${field.label}...`;
    }
    if (model) {
      return `Select field for ${MODEL_MAP[model].label}...`;
    }
    if (tokens.length > 0) {
      return `Add more filters or type free-text query...`;
    }
    return "Filter by property or type free-text query...";
  };

  useEffect(() => {
    if (popoverHistoryMode) setHistory(getHistory());
  }, [popoverHistoryMode, getHistory]);

  const triggerHistoryPopover = () => {
    setIsPopoverOpen(true);
    setPopoverHistoryMode(true);
  };

  const handleEnterPress = () => {
    let finalTokens = tokens;
    let finalFreeText = freeTextQuery;

    console.log("handleEnterPress called", {
      tokens: tokens.length,
      freeTextQuery,
      inputValue,
      model,
      field,
      operator,
    });

    if (model && field && operator && inputValue) {
      const newToken = buildToken(inputValue);
      if (newToken) {
        setTokens((prevTokens) => {
          const newTokens = [...prevTokens, newToken];
          debouncedMainSearch(newTokens, freeTextQuery);
          return newTokens;
        });
        resetFilterBuildingState();
        setIsPopoverOpen(false);

        const newTokens = [...tokens, newToken];
        const queryBody = buildApiQueryParams(newTokens, freeTextQuery);
        if (
          Object.keys(queryBody).length > 0 &&
          (queryBody.q || queryBody.filters)
        ) {
          performSearch({
            queryBody,
            navigate: true,
            tokens: newTokens,
            freeText: freeTextQuery,
          });
          addToHistory(newTokens, freeTextQuery);
        }
        return;
      }
    } else if (inputValue && inputValue.trim()) {
      // We're doing a free text search
      finalFreeText = inputValue.trim();
      setFreeTextQuery(inputValue.trim());
      setInputValue("");
    }

    console.log("After processing", {
      finalTokens: finalTokens.length,
      finalFreeText,
      willNavigate: finalTokens.length > 0 || finalFreeText,
    });

    if (finalTokens.length > 0 || finalFreeText) {
      const queryBody = buildApiQueryParams(finalTokens, finalFreeText);

      if (
        Object.keys(queryBody).length > 0 &&
        (queryBody.q || queryBody.filters)
      ) {
        performSearch({
          queryBody,
          navigate: true,
          tokens: finalTokens,
          freeText: finalFreeText,
        });
        addToHistory(finalTokens, finalFreeText);
      } else {
        console.log("Invalid query body, not navigating");
      }
    } else {
      console.log("No searchable content found");
    }

    setIsPopoverOpen(false);
    setPopoverHistoryMode(false);
    setHighlightedIndex(-1);
  };

  const handleSuggestionKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    let listLength = 0;
    if (popoverContentState === "select_model")
      listLength = modelSuggestions.length;
    else if (popoverContentState === "select_field")
      listLength = fieldOptions.length;
    else if (popoverContentState === "select_operator")
      listLength = OPERATORS.length;
    else if (popoverContentState === "enter_value")
      listLength =
        (inputValue.length > 0 ? 1 : 0) + currentFieldSuggestions.length;

    if (listLength === 0) return;

    if (e.key === "ArrowDown") {
      setHighlightedIndex((prev) => (prev < listLength - 1 ? prev + 1 : 0));
      e.preventDefault();
      return;
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : listLength - 1));
      e.preventDefault();
      return;
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && highlightedIndex < listLength) {
        if (popoverContentState === "select_model") {
          const modelLabel = modelSuggestions[highlightedIndex];
          const modelKey = Object.keys(MODEL_MAP).find(
            (key) => MODEL_MAP[key].label === modelLabel
          );
          if (modelKey) {
            setModel(modelKey);
            setInputValue("");
            inputRef.current?.focus();
          }
        } else if (popoverContentState === "select_field") {
          const f = fieldOptions[highlightedIndex];
          setField(f);
          setInputValue("");
          inputRef.current?.focus();
        } else if (popoverContentState === "select_operator") {
          const op = OPERATORS[highlightedIndex];
          setOperator(op);
          setInputValue("");
          inputRef.current?.focus();
        } else if (popoverContentState === "enter_value") {
          if (highlightedIndex === 0 && inputValue.length > 0) {
            // First option is the free text - use the current input value
            addFinalToken();
            setHighlightedIndex(-1);
          } else {
            // API suggestion - adjust index to account for free text option
            const suggestionIndex =
              highlightedIndex - (inputValue.length > 0 ? 1 : 0);
            const selected = currentFieldSuggestions[suggestionIndex];
            setInputValue(selected);
            addFinalToken(selected);
            setHighlightedIndex(-1);
          }
        }
        e.preventDefault();
        return;
      }
    }
  };

  useEffect(() => {
    if (isPopoverOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [isPopoverOpen]);

  useEffect(() => {
    const isDashboardPage = pathname.startsWith("/dashboards/");
    if (!isDashboardPage && (tokens.length > 0 || freeTextQuery)) {
      setTokens([]);
      setFreeTextQuery("");
      setSearchResults(null);
      setLastSearchQuery(null);
    }
  }, [pathname]);

  return (
    <div className="w-full mx-5 my-2 space-y-4 bg-background rounded-md">
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <div
            ref={popoverTriggerRef}
            className="border rounded-md px-3 py-2 flex flex-wrap items-center gap-2 min-h-[44px] cursor-text
                         focus-within:ring-2 focus-within:ring-blue-200 focus-within:border-blue-500 transition-all bg-background duration-200 z-0"
            onClick={(e) => {
              const target = e.target as HTMLElement;
              if (
                !target.closest("button") &&
                !target.closest(".token-remove-x") &&
                !target.closest(".badge")
              ) {
                inputRef.current?.focus();
              }
            }}
          >
            <Search className="h-5 w-5 text-gray-700 mr-1" />
            {tokens.slice(0, 3).map((token, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-800 border-blue-200 rounded-md text-sm whitespace-nowrap relative z-10"
              >
                <span className="font-medium">
                  {MODEL_MAP[token.model]?.label || token.model}
                </span>
                .<span className="font-medium">{token.field}</span>{" "}
                <span className="text-blue-600">{token.operator}</span>{" "}
                <span className="font-mono text-blue-900">
                  {formatTokenDisplayValue(token)}{" "}
                </span>
                <Button
                  variant="ghost"
                  className="token-remove-x w-4 h-2 cursor-pointer text-blue-400 hover:text-red-500 ml-1 transition-colors relative z-20 pointer-events-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeToken(i);
                  }}
                >
                  <X className="w-4 h-1" />
                </Button>
              </Badge>
            ))}
            {tokens.length > 3 && (
              <Badge
                variant="outline"
                className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 border-gray-300 rounded-md text-sm whitespace-nowrap relative z-10 cursor-default"
                title={`${
                  tokens.length - 3
                } more search criteria - see details below`}
              >
                +{tokens.length - 3} more
              </Badge>
            )}
            {freeTextQuery && (
              <Badge
                variant="outline"
                className="bg-gray-100 text-gray-700 px-2 py-1 border-gray-300 flex items-center rounded-md text-sm whitespace-nowrap"
              >
                <span>{freeTextQuery}</span>
                <Button
                  variant="ghost"
                  className="token-remove-x w-4 h-2 cursor-pointer text-blue-400 hover:text-red-500 ml-1 transition-colors relative z-20 pointer-events-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFreeTextQuery("");
                  }}
                >
                  <X />
                </Button>
              </Badge>
            )}
            {model && (
              <Badge className="bg-purple-50 text-purple-800 border-purple-200 flex items-center rounded-md text-sm whitespace-nowrap">
                Model: {MODEL_MAP[model]?.label || model}
                <X
                  className="w-4 h-4 cursor-pointer text-purple-400 hover:text-purple-600 ml-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setModel(null);
                    setField(null);
                    setOperator(null);
                    setInputValue("");
                  }}
                />
              </Badge>
            )}
            {field && (
              <Badge className="bg-green-50 text-green-800 border-green-200 flex items-center rounded-md text-sm whitespace-nowrap">
                Field: {field.label}
                <X
                  className="w-4 h-4 cursor-pointer text-green-400 hover:text-green-600 ml-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setField(null);
                    setOperator(null);
                    setInputValue("");
                  }}
                />
              </Badge>
            )}
            {operator && (
              <Badge className="bg-orange-50 text-orange-800 border-orange-200 flex items-center rounded-md text-sm whitespace-nowrap">
                Operator: {operator}
                <X
                  className="w-4 h-4 cursor-pointer text-orange-400 hover:text-orange-600 ml-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOperator(null);
                    setInputValue("");
                  }}
                />
              </Badge>
            )}
            <div className="flex-1 relative min-w-0">
              <input
                ref={inputRef}
                className="w-full focus:outline-none bg-background min-w-0 text-gray-800 placeholder-gray-400"
                placeholder={getPlaceholder()}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (e.target.value.length > 0 && !isPopoverOpen) {
                    setTimeout(() => setIsPopoverOpen(true), 0);
                  }
                  if (popoverHistoryMode) {
                    setPopoverHistoryMode(false);
                  }
                }}
                onFocus={() => setIsPopoverOpen(true)}
                onBlur={(e) => {
                  setTimeout(() => {
                    if (
                      !document.activeElement ||
                      !popoverTriggerRef.current?.contains(
                        document.activeElement
                      )
                    ) {
                      setIsPopoverOpen(false);
                      setPopoverHistoryMode(false);
                      setHighlightedIndex(-1);
                    }
                  }, 100);
                }}
                onKeyDown={(e) => {
                  handleBackspace(e);
                  if (isPopoverOpen) {
                    handleSuggestionKeyDown(e);
                  }
                  if (e.key === "Enter") {
                    console.log("Enter key pressed", {
                      highlightedIndex,
                      isPopoverOpen,
                      tokens: tokens.length,
                      freeTextQuery,
                      inputValue: inputValue.trim(),
                    });
                    if (isPopoverOpen && highlightedIndex >= 0) {
                      console.log("Suggestion highlighted, not handling Enter");
                      return;
                    }
                    console.log("Triggering handleEnterPress");
                    e.preventDefault();
                    handleEnterPress();
                  }
                }}
              />
              {/* Show hint when building a filter */}
              {model && field && operator && inputValue && (
                <div className="absolute -bottom-6 left-0 text-xs text-gray-500 flex items-center gap-1">
                  <span>Press Enter to create filter with</span>
                  <span className="font-medium text-blue-600">
                    "{inputValue}"
                  </span>
                </div>
              )}
            </div>
            {isSearching && (
              <Loader2 className="h-5 w-5 animate-spin text-blue-500 ml-2" />
            )}
            {/* Search button - only show when there are tokens or free text */}
            {(tokens.length > 0 || freeTextQuery) && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const queryBody = buildApiQueryParams(tokens, freeTextQuery);
                  performSearch({
                    queryBody,
                    navigate: true,
                    tokens: tokens,
                    freeText: freeTextQuery,
                  });
                }}
              >
                <Search className="h-4 w-4 mr-1" />
              </Button>
            )}

            {/* History button - always visible */}
            <Button
              size="sm"
              variant="outline"
              className={tokens.length > 0 || freeTextQuery ? "ml-2" : ""}
              onClick={triggerHistoryPopover}
            >
              <History className="h-4 w-4 mr-1" />
              History
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 z-50 popover-content"
          onMouseDown={(e) => e.preventDefault()}
          forceMount
          align="start"
        >
          {popoverHistoryMode ? (
            <div className="p-4">
              <div className="text-sm font-semibold mb-2 text-gray-700">
                Search History
              </div>
              {history.length === 0 && (
                <div className="text-gray-500 text-sm">
                  No search history yet.
                </div>
              )}
              <div className="space-y-4">
                {history.map((search, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between border-b-2 pb-2 mb-2"
                  >
                    <div className="flex flex-wrap gap-2 items-center ">
                      {search.tokens.map((token: any, i: number) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-800 border-blue-200 rounded-md text-sm whitespace-nowrap"
                        >
                          <span className="font-medium">
                            {MODEL_MAP[token.model]?.label || token.model}
                          </span>
                          .<span className="font-medium">{token.field}</span>{" "}
                          <span className="text-blue-600">
                            {token.operator}
                          </span>{" "}
                          <span className="font-mono text-blue-900">
                            {token.displayValue}
                          </span>
                        </Badge>
                      ))}
                      {search.freeTextQuery && (
                        <Badge
                          variant="outline"
                          className="bg-gray-100 text-gray-700 border-gray-300"
                        >
                          "{search.freeTextQuery}"
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setTokens(search.tokens);
                          setFreeTextQuery(search.freeTextQuery || "");
                          setIsPopoverOpen(false);
                          setPopoverHistoryMode(false);
                          setHighlightedIndex(-1);
                        }}
                      >
                        <SearchIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                className="mt-2"
                onClick={() => {
                  SearchHistoryService.clearHistory();
                  setHistory([]);
                }}
                variant="destructive"
                size="sm"
              >
                Clear History
              </Button>
              <Button
                className="mt-2 ml-2"
                onClick={() => setPopoverHistoryMode(false)}
                variant="outline"
                size="sm"
              >
                Close
              </Button>
            </div>
          ) : (
            <>
              {(!model || popoverContentState === "select_model") && (
                <div className="p-4">
                  <div className="text-sm font-semibold mb-2 text-gray-700">
                    Select Model
                  </div>
                  <Command className="p-0">
                    <CommandGroup>
                      {modelSuggestions.length > 0 ? (
                        modelSuggestions.map((modelLabel, idx) => (
                          <CommandItem
                            key={modelLabel}
                            autoFocus={false}
                            onSelect={() => {
                              const modelKey = Object.keys(MODEL_MAP).find(
                                (key) => MODEL_MAP[key].label === modelLabel
                              );
                              if (modelKey) {
                                setModel(modelKey);
                                setInputValue("");
                                inputRef.current?.focus();
                              }
                            }}
                            className={`cursor-pointer px-3 py-2 hover:bg-gray-50 rounded-md ${
                              highlightedIndex === idx ? "bg-blue-100" : ""
                            }`}
                            aria-selected={highlightedIndex === idx}
                            tabIndex={-1}
                            ref={(el) => {
                              if (highlightedIndex === idx && el) {
                                el.scrollIntoView({ block: "nearest" });
                              }
                            }}
                          >
                            {modelLabel}
                          </CommandItem>
                        ))
                      ) : (
                        <CommandEmpty className="py-2 text-center text-gray-500">
                          No models found.
                        </CommandEmpty>
                      )}
                    </CommandGroup>
                  </Command>
                </div>
              )}
              {model && popoverContentState === "select_field" && (
                <div className="p-4">
                  <div className="text-sm font-semibold mb-2 text-gray-700">
                    Select Field for{" "}
                    <span className="font-bold text-blue-600">
                      {MODEL_MAP[model!].label}
                    </span>
                  </div>
                  <Command className="p-0">
                    <CommandGroup>
                      {fieldOptions.length > 0 ? (
                        fieldOptions.map((f, idx) => (
                          <CommandItem
                            key={f.key}
                            onSelect={() => {
                              setField(f);
                              setInputValue("");
                              inputRef.current?.focus();
                            }}
                            className={`cursor-pointer px-3 py-2 hover:bg-gray-50 rounded-md ${
                              highlightedIndex === idx ? "bg-blue-100" : ""
                            }`}
                            aria-selected={highlightedIndex === idx}
                            tabIndex={-1}
                            ref={(el) => {
                              if (highlightedIndex === idx && el) {
                                el.scrollIntoView({ block: "nearest" });
                              }
                            }}
                          >
                            {f.label} ({f.inputType})
                          </CommandItem>
                        ))
                      ) : (
                        <CommandEmpty className="py-2 text-center text-gray-500">
                          {inputValue.length > 0
                            ? "No matching fields found."
                            : "No filterable fields for this model."}
                        </CommandEmpty>
                      )}
                    </CommandGroup>
                  </Command>
                </div>
              )}
              {field && popoverContentState === "select_operator" && (
                <div className="p-4">
                  <div className="text-sm font-semibold mb-2 text-gray-700">
                    Select Operator for{" "}
                    <span className="font-bold text-blue-600">
                      {field!.label}
                    </span>
                  </div>
                  <Command className="p-0">
                    <CommandGroup>
                      {OPERATORS.map((op, idx) => (
                        <CommandItem
                          key={op}
                          onSelect={() => {
                            setOperator(op);
                            setInputValue("");
                            inputRef.current?.focus();
                          }}
                          className={`cursor-pointer px-3 py-2 hover:bg-gray-50 rounded-md ${
                            highlightedIndex === idx ? "bg-blue-100" : ""
                          }`}
                          aria-selected={highlightedIndex === idx}
                          tabIndex={-1}
                          ref={(el) => {
                            if (highlightedIndex === idx && el) {
                              el.scrollIntoView({ block: "nearest" });
                            }
                          }}
                        >
                          {op}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </div>
              )}
              {operator && popoverContentState === "enter_value" && (
                <div className="p-4 space-y-3">
                  <div className="text-sm font-semibold text-gray-700">
                    Enter Value for{" "}
                    <span className="font-bold text-blue-600">
                      {field?.label} {operator}
                    </span>
                  </div>
                  <>
                    {isLoadingSuggestions && (
                      <div className="flex items-center justify-center text-sm text-gray-500 py-4">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Loading suggestions...
                      </div>
                    )}
                    {!isLoadingSuggestions && (
                      <div>
                        <div className="text-xs font-semibold mb-1 text-gray-600">
                          Suggestions:
                        </div>
                        <Command className="p-0 max-h-48 overflow-y-auto">
                          <CommandGroup>
                            {/* Always show the free text input as the first option */}
                            {inputValue.length > 0 && (
                              <CommandItem
                                key="free-text"
                                ref={(el) => {
                                  if (highlightedIndex === 0 && el) {
                                    el.scrollIntoView({ block: "nearest" });
                                  }
                                }}
                                onSelect={() => {
                                  addFinalToken();
                                  setHighlightedIndex(-1);
                                }}
                                className={`cursor-pointer px-3 py-2 hover:bg-gray-50 rounded-md border-l-4 border-l-blue-500 ${
                                  highlightedIndex === 0
                                    ? "bg-blue-100"
                                    : "bg-blue-50"
                                }`}
                                aria-selected={highlightedIndex === 0}
                                tabIndex={-1}
                              >
                                <div className="flex items-center justify-between w-full">
                                  <div>
                                    <span className="font-medium text-blue-700">
                                      "{inputValue}"
                                    </span>
                                    <span className="text-xs text-blue-600 ml-2 font-medium">
                                      (exact text)
                                    </span>
                                  </div>
                                  <span className="text-xs text-blue-500 bg-blue-100 px-2 py-1 rounded">
                                    Enter
                                  </span>
                                </div>
                              </CommandItem>
                            )}
                            {/* Show API suggestions after the free text */}
                            {currentFieldSuggestions &&
                              currentFieldSuggestions.length > 0 && (
                                <>
                                  {/* Separator between free text and API suggestions */}
                                  <div className="px-3 py-2 border-t border-gray-200">
                                    <span className="text-xs text-gray-500 font-medium">
                                      API Suggestions:
                                    </span>
                                  </div>
                                  {currentFieldSuggestions.map((sugg, idx) => (
                                    <CommandItem
                                      key={sugg}
                                      ref={(el) => {
                                        if (
                                          highlightedIndex ===
                                            idx +
                                              (inputValue.length > 0 ? 1 : 0) &&
                                          el
                                        ) {
                                          el.scrollIntoView({
                                            block: "nearest",
                                          });
                                        }
                                      }}
                                      onSelect={() => {
                                        setInputValue(sugg);
                                        addFinalToken(sugg);
                                        setHighlightedIndex(-1);
                                      }}
                                      className={`cursor-pointer px-3 py-2 hover:bg-gray-50 rounded-md ${
                                        highlightedIndex ===
                                        idx + (inputValue.length > 0 ? 1 : 0)
                                          ? "bg-blue-100"
                                          : ""
                                      }`}
                                      aria-selected={
                                        highlightedIndex ===
                                        idx + (inputValue.length > 0 ? 1 : 0)
                                      }
                                      tabIndex={-1}
                                    >
                                      {sugg}
                                    </CommandItem>
                                  ))}
                                </>
                              )}
                          </CommandGroup>
                        </Command>
                      </div>
                    )}
                    {!isLoadingSuggestions &&
                      currentFieldSuggestions?.length === 0 &&
                      inputValue.length > 0 && (
                        <div className="text-sm text-gray-500 py-2 text-center">
                          No suggestions found.
                        </div>
                      )}
                  </>
                  <Button
                    className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => addFinalToken()}
                    disabled={!inputValue}
                  >
                    Add Filter
                  </Button>
                </div>
              )}
            </>
          )}
        </PopoverContent>
      </Popover>

      {/* {freeTextQuery && (
        <div className="mt-2 p-3 border rounded-md bg-gray-50 text-sm text-gray-700 flex items-center justify-between shadow-sm">
          <span>
            Free-text query:{" "}
            <span className="font-semibold text-gray-900">
              "{freeTextQuery}"
            </span>
          </span>
          <X
            className="w-4 h-4 cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={() => setFreeTextQuery("")}
          />
        </div>
      )}
      <div className="mt-4 p-4 border rounded-md bg-gray-50 shadow-sm">
        <h3 className="font-semibold mb-2 text-gray-800">
          Generated API Query Body:
        </h3>
        <pre className="whitespace-pre-wrap text-sm bg-white p-3 rounded-md border text-gray-700">
          {JSON.stringify(buildApiQueryParams(tokens, freeTextQuery), null, 2)}
        </pre>
        {searchResults && (
          <>
            <h4 className="font-semibold mt-4 mb-2 text-gray-800">
              Current Search Results: ({searchResults.total} total)
            </h4>
            <div className="text-sm text-gray-600">
              Found {searchResults.results.length} results in current page
            </div>
          </>
        )}
      </div> */}
    </div>
  );
}
