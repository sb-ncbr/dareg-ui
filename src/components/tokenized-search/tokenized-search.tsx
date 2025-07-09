"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { X, Loader2, Search as SearchIcon, History, Save } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import {
  useApiServiceGetApiV1Projects,
  useApiServiceGetApiV1Schemas,
} from "../../../openapi/queries";
import {
  PaginatedProjectResponseList,
  PaginatedSchemaList,
} from "../../../openapi/requests";

import {
  FilterOption,
  MODEL_MAP,
  Operator,
  Token,
} from "../../types/search/search-models";
import { SearchHistoryService } from "@/services/search-history-service";

function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
  let timeoutId: NodeJS.Timeout | null;

  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}

const OPERATORS: Operator[] = ["=", "!=", "<", ">"];

function mapDataToSuggestions(
  data: any | undefined,
  dataSourceKey: FilterOption["dataSourceKey"]
): string[] {
  if (!data) return [];

  const resultsArray = Array.isArray(data) ? data : data.results || [];

  switch (dataSourceKey) {
    case "projects":
      return resultsArray
        .map((item: any) => item.name)
        .filter(Boolean) as string[];
    case "collections":
      return resultsArray
        .map((item: any) => item.name)
        .filter(Boolean) as string[];
    case "templates":
      return resultsArray
        .map((item: any) => item.name || item.template_name)
        .filter(Boolean) as string[];
    case "datasets_statuses":
      return ["draft", "published", "archived"].filter(
        (s) => typeof s === "string"
      ) as string[];
    default:
      return resultsArray.filter((s) => typeof s === "string") as string[];
  }
}

type SearchQueryParams = {
  [key: string]: string | number | (string | number)[];
};

function buildApiQueryParams(
  tokens: Token[],
  freeTextQuery: string
): SearchQueryParams {
  const params: SearchQueryParams = {};

  tokens.forEach((token) => {
    let key = `${token.model.toLowerCase()}__${token.field.toLowerCase()}`;

    let operatorSuffix = "";
    switch (token.operator) {
      case "=":
        operatorSuffix = "__eq";
        break;
      case "!=":
        operatorSuffix = "__ne";
        break;
      case ">":
        operatorSuffix = "__gt";
        break;
      case "<":
        operatorSuffix = "__lt";
        break;
      case ">=":
        operatorSuffix = "__gte";
        break;
      case "<=":
        operatorSuffix = "__lte";
        break;
    }

    key += operatorSuffix;

    let valueToAssign: string | number;
    if (token.value instanceof Date) {
      valueToAssign = token.value.toISOString().split("T")[0];
    } else {
      valueToAssign = token.value as string | number;
    }

    if (params[key]) {
      if (Array.isArray(params[key])) {
        (params[key] as (string | number)[]).push(valueToAssign);
      } else {
        params[key] = [params[key] as string | number, valueToAssign];
      }
    } else {
      params[key] = valueToAssign;
    }
  });

  if (freeTextQuery) {
    params.search = freeTextQuery;
  }

  for (const k in params) {
    if (params.hasOwnProperty(k) && Array.isArray(params[k])) {
      params[k] = (params[k] as (string | number)[]).join(",");
    }
  }

  return params;
}

export default function SearchBar() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [model, setModel] = useState<string | null>(null);
  const [field, setField] = useState<FilterOption | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [freeTextQuery, setFreeTextQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverTriggerRef = useRef<HTMLDivElement>(null);
  const [popoverHistoryMode, setPopoverHistoryMode] = useState(false);
  const [history, setHistory] = useState<SearchHistoryEntry[]>([]);

  const shouldFetchProjects = !!MODEL_MAP["Datasets"]?.filters.find(
    (f) => f.key === "project"
  )?.dataSourceKey;
  const shouldFetchTemplates = !!MODEL_MAP["Templates"]?.filters.find(
    (f) => f.key === "template_name"
  )?.dataSourceKey;
  const shouldFetchCollections = !!MODEL_MAP["Collections"]?.filters.find(
    (f) => f.key === "name"
  )?.dataSourceKey;

  let projectsPaginatedData: PaginatedProjectResponseList | undefined;
  if (shouldFetchProjects) {
    const { data } = useApiServiceGetApiV1Projects({});
    projectsPaginatedData = data;
  }

  let templatesPaginatedData: PaginatedSchemaList | undefined;
  if (shouldFetchTemplates) {
    const { data } = useApiServiceGetApiV1Schemas({});
    templatesPaginatedData = data;
  }

  let collectionData: PaginatedProjectResponseList | undefined;
  let isCollectionLoading: boolean = false;
  if (shouldFetchCollections) {
    const { data, isLoading } = useApiServiceGetApiV1Projects({});
    collectionData = data;
    isCollectionLoading = isLoading;
  }
  const collectionsPaginatedData = collectionData;

  const popoverContentState = !model
    ? "select_model"
    : !field
    ? "select_field"
    : !operator
    ? "select_operator"
    : "enter_value";

  const { data: currentFieldSuggestions, isLoading: isLoadingSuggestions } =
    useQuery<string[]>({
      queryKey: ["fieldSuggestions", model, field?.key, inputValue],
      queryFn: async () => {
        if (model && field && field.dataSourceKey && inputValue.length > 0) {
          let sourceData: any | undefined;
          switch (field.dataSourceKey) {
            case "projects":
              sourceData = projectsPaginatedData;
              break;
            case "collections":
              sourceData = collectionsPaginatedData;
              break;
            case "templates":
              sourceData = templatesPaginatedData;
              break;
            case "datasets_statuses":
              sourceData = ["draft", "published", "archived"];
              break;
            default:
              sourceData = undefined;
          }

          const mappedSuggestions = mapDataToSuggestions(
            sourceData,
            field.dataSourceKey
          );
          return mappedSuggestions.filter((sugg) =>
            sugg.toLowerCase().includes(inputValue.toLowerCase())
          );
        }
        return [];
      },
      enabled:
        !!model &&
        !!field?.dataSourceKey &&
        inputValue.length > 0 &&
        popoverContentState === "enter_value",
      staleTime: 0,
    });

  const allModelNames = Object.keys(MODEL_MAP).map(
    (key) => MODEL_MAP[key].label
  );
  const modelSuggestions =
    inputValue.length > 0
      ? allModelNames.filter((name) =>
          name.toLowerCase().includes(inputValue.toLowerCase())
        )
      : allModelNames;

  const resetFilterBuildingState = () => {
    setModel(null);
    setField(null);
    setOperator(null);
    setInputValue("");
  };

  const addFinalToken = (displayValue: string = inputValue) => {
    if (model && field && operator && inputValue !== "") {
      const castedValue =
        field.inputType === "number"
          ? Number(inputValue)
          : field.inputType === "date"
          ? new Date(inputValue)
          : inputValue;

      setTokens([
        ...tokens,
        { model, field: field.key, operator, value: castedValue, displayValue },
      ]);
      resetFilterBuildingState();
      setIsPopoverOpen(false);

      inputRef.current?.focus();
    }
  };

  const removeToken = (index: number) => {
    setTokens(tokens.filter((_, i) => i !== index));
    inputRef.current?.focus();
  };

  const fieldOptions = model
    ? MODEL_MAP[model].filters.filter((f) =>
        f.label.toLowerCase().includes(inputValue.toLowerCase())
      )
    : [];

  const handleBackspace = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && inputValue === "") {
      e.preventDefault();
      if (operator) {
        setOperator(null);
      } else if (field) {
        setField(null);
      } else if (model) {
        setModel(null);
      } else if (tokens.length > 0) {
        setTokens(tokens.slice(0, -1));
      }
    }
  };

  useEffect(() => {
    if (isPopoverOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isPopoverOpen]);

  const debouncedMainSearch = useCallback(
    debounce((currentTokens: Token[], currentFreeTextQuery: string) => {
      const queryParams = buildApiQueryParams(
        currentTokens,
        currentFreeTextQuery
      );
      console.log("--- Main Search Triggered ---");
      console.log("API Query Params:", queryParams);
      //TODO: API CALL PLACEHOLDER
      console.log("--- End Main Search Trigger ---");
    }, 500),
    []
  );

  useEffect(() => {
    if (tokens.length > 0 || freeTextQuery) {
      debouncedMainSearch(tokens, freeTextQuery);
    } else {
      console.log(
        "No filters or free-text query, showing all results (or clearing search state)."
      );
      debouncedMainSearch([], "");
    }
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
    if (popoverHistoryMode) {
      setHistory(SearchHistoryService.getHistory());
    }
  }, [popoverHistoryMode]);

  const triggerHistoryPopover = () => {
    setIsPopoverOpen(true);
    setPopoverHistoryMode(true);
  };

  console.log("Current tokens:", tokens);

  return (
    <div className="w-full max-w-4xl lg:w-full mx-5 my-2 sm:w-20 space-y-4 bg-background rounded-md">
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <div
            ref={popoverTriggerRef}
            className="relative border rounded-md px-3 py-2 flex flex-wrap items-center gap-2 min-h-[44px] cursor-text
                       focus-within:ring-2 focus-within:ring-blue-200 focus-within:border-blue-500 transition-all bg-background duration-200"
            onClick={() => inputRef.current?.focus()}
          >
            <SearchIcon className="h-5 w-5 text-gray-700 mr-1" />

            {tokens.map((token, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-800 border-blue-200 rounded-md text-sm whitespace-nowrap"
              >
                <span className="font-medium">
                  {MODEL_MAP[token.model]?.label || token.model}
                </span>
                .<span className="font-medium">{token.field}</span>{" "}
                <span className="text-blue-600">{token.operator}</span>{" "}
                <span className="font-mono text-blue-900">
                  {token.displayValue}
                </span>
                <X
                  className="w-4 h-4 cursor-pointer text-blue-400 hover:text-blue-600 transition-colors ml-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeToken(i);
                  }}
                />
              </Badge>
            ))}

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

            <input
              ref={inputRef}
              className="flex-grow focus:outline-none bg-background min-w-[100px] text-gray-800 placeholder-gray-400"
              placeholder={getPlaceholder()}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (e.target.value.length > 0 && !isPopoverOpen) {
                  setIsPopoverOpen(true);
                }
                if (popoverHistoryMode) {
                  setPopoverHistoryMode(false); // <-- Hide history when typing starts
                }
              }}
              onFocus={() => setIsPopoverOpen(true)}
              onBlur={(e) => {
                setTimeout(() => {
                  if (
                    !document.activeElement ||
                    (!popoverTriggerRef.current?.contains(
                      document.activeElement
                    ) &&
                      !document.activeElement.closest(".popover-content"))
                  ) {
                    setIsPopoverOpen(false);
                    setPopoverHistoryMode(false);
                  }
                }, 100);
              }}
              onKeyDown={(e) => {
                handleBackspace(e);
                if (e.key === "Enter") {
                  console.log("Enter pressed with inputValue:", inputValue);
                  e.preventDefault();
                  if (tokens.length > 0) {
                    addFinalToken();
                    setInputValue("");
                    SearchHistoryService.addSearch(tokens);
                    setTokens([]);
                    setIsPopoverOpen(false);
                  } else if (!model && !field && !operator && inputValue) {
                    setFreeTextQuery(inputValue);
                    setInputValue("");
                    setIsPopoverOpen(false);
                  }
                }
              }}
            />
            <History
              className="h-5 w-5 text-gray-700 mr-1 hover:opacity-70 cursor-pointer"
              onClick={triggerHistoryPopover}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 z-50 popover-content"
          onMouseDown={(e) => e.preventDefault()}
          align="start"
        >
          {popoverHistoryMode ? (
            // --- HISTORY MODE ---
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
                    <div className="flex flex-wrap gap-2 s items-center ">
                      {search.map((token, i) => (
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
                    </div>

                    <div className=" flex items-center justify-center">
                      <Save className="h-6 w-6 text-gray-700 mr-1 hover:opacity-70 cursor-pointer" />
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
            // --- NORMAL MODE ---
            <>
              {(!model || popoverContentState === "select_model") && (
                <div className="p-4">
                  <div className="text-sm font-semibold mb-2 text-gray-700">
                    Select Model
                  </div>
                  <Command className="p-0">
                    <CommandGroup>
                      {modelSuggestions.length > 0 ? (
                        modelSuggestions.map((modelLabel) => (
                          <CommandItem
                            key={modelLabel}
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
                            className="cursor-pointer px-3 py-2 hover:bg-gray-50 rounded-md"
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
                        fieldOptions.map((f) => (
                          <CommandItem
                            key={f.key}
                            onSelect={() => {
                              setField(f);
                              setInputValue("");
                              inputRef.current?.focus();
                            }}
                            className="cursor-pointer px-3 py-2 hover:bg-gray-50 rounded-md"
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
                      {OPERATORS.map((op) => (
                        <CommandItem
                          key={op}
                          onSelect={() => {
                            setOperator(op);
                            setInputValue("");
                            inputRef.current?.focus();
                          }}
                          className="cursor-pointer px-3 py-2 hover:bg-gray-50 rounded-md"
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

                  {field?.dataSourceKey && (
                    <>
                      {isLoadingSuggestions && (
                        <div className="flex items-center justify-center text-sm text-gray-500 py-4">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                          Loading suggestions...
                        </div>
                      )}
                      {!isLoadingSuggestions &&
                        currentFieldSuggestions &&
                        currentFieldSuggestions.length > 0 && (
                          <div>
                            <div className="text-xs font-semibold mb-1 text-gray-600">
                              Suggestions:
                            </div>
                            <Command className="p-0 max-h-48 overflow-y-auto">
                              <CommandGroup>
                                {currentFieldSuggestions.map((sugg) => (
                                  <CommandItem
                                    key={sugg}
                                    onSelect={() => {
                                      setInputValue(sugg);
                                      addFinalToken(sugg);
                                    }}
                                    className="cursor-pointer px-3 py-2 hover:bg-gray-50 rounded-md"
                                  >
                                    {sugg}
                                  </CommandItem>
                                ))}
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
                  )}

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

      {freeTextQuery && (
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

      {/* <div className="mt-4 p-4 border rounded-md bg-gray-50 shadow-sm">
        <h3 className="font-semibold mb-2 text-gray-800">
          Current Search State:
        </h3>
        {tokens.length === 0 && !freeTextQuery ? (
          <p className="text-gray-500">No active filters or queries.</p>
        ) : (
          <pre className="whitespace-pre-wrap text-sm bg-white p-3 rounded-md border text-gray-700">
            {JSON.stringify({ tokens, freeTextQuery }, null, 2)}
          </pre>
        )}
      </div> */}
    </div>
  );
}
