"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { ControlProps, isStringControl, RankedTester } from "@jsonforms/core";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    CommandList,
} from "@/components/ui/command";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearch } from "@/components/tokenized-search/providers/search-context";
import { useSuggestions } from "@/components/forms/form-wraper/contexts/suggestions-context";
import {
    buildApiQueryParamsForSuggestions,
    searchSuggestionsApi,
    SearchResponse,
} from "@/components/tokenized-search/services/search-api-service";
import { Loader2 } from "lucide-react";

const MIN_CHARS_FOR_SUGGESTIONS = 2;
const DEFAULT_MODEL = "Datasets";
const DEBOUNCE_MS = 300;

function extractSuggestionsFromResponse(
    response: SearchResponse,
    fieldKey: string,
    inputValue: string
): string[] {
    if (!response.results || response.results.length === 0) {
        return [];
    }

    return (
        response.results
            .flatMap((item: any) => {
                if (!item.highlights || !Array.isArray(item.highlights)) return [];
                return item.highlights
                    .map((highlight: string) => {
                        let highlightFieldName: string;
                        let value: string;
                        if (highlight.includes(" → ")) {
                            const parts = highlight.split(" → ");
                            highlightFieldName = parts[0].trim();
                            value = parts[1]?.trim() || "";
                        } else if (highlight.includes(": ")) {
                            const parts = highlight.split(": ");
                            highlightFieldName = parts[0].trim();
                            value = parts[1]?.trim() || "";
                        } else {
                            return null;
                        }
                        if (highlightFieldName === fieldKey) return value;
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
            .slice(0, 10)
    );
}

function SuggestionTextRenderer(props: ControlProps) {
    const {
        data,
        handleChange,
        path,
        label,
        description,
        errors,
        required,
        enabled,
        visible,
        id,
        uischema,
    } = props;

    const { suggestionsEnabled } = useSuggestions();
    const { searchSuggestionsApi: contextSearchSuggestionsApi, selectedSchemaId } =
        useSearch();

    const model =
        (uischema as any)?.options?.model ||
        (uischema as any)?.options?.searchModel ||
        DEFAULT_MODEL;

    const [inputValue, setInputValue] = useState<string>(
        typeof data === "string" ? data : ""
    );
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [hasError, setHasError] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const debouncedValue = useDebounce(inputValue, DEBOUNCE_MS);

    useEffect(() => {
        if (typeof data === "string" && data !== inputValue) {
            setInputValue(data);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const fetchSuggestions = useCallback(
        async (query: string) => {
            if (query.length < MIN_CHARS_FOR_SUGGESTIONS) {
                setSuggestions([]);
                setHasError(false);
                return;
            }

            setIsLoading(true);
            setHasError(false);

            try {
                const suggestionQueryBody = buildApiQueryParamsForSuggestions(
                    model,
                    query,
                    {
                        fieldKey: path,
                        schema: selectedSchemaId || undefined,
                    }
                );

                const apiFn = contextSearchSuggestionsApi || searchSuggestionsApi;
                const response = await apiFn(suggestionQueryBody);

                const extracted = extractSuggestionsFromResponse(
                    response,
                    path,
                    query
                );
                setSuggestions(extracted);
            } catch {
                setSuggestions([]);
                setHasError(true);
            } finally {
                setIsLoading(false);
            }
        },
        [model, path, selectedSchemaId, contextSearchSuggestionsApi]
    );

    useEffect(() => {
        let active = true;

        if (debouncedValue.length >= MIN_CHARS_FOR_SUGGESTIONS && enabled !== false) {
            fetchSuggestions(debouncedValue).then(() => {
                if (!active) return;
            });
        } else {
            setSuggestions([]);
            setHasError(false);
        }

        return () => {
            active = false;
        };
    }, [debouncedValue, fetchSuggestions, enabled]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        handleChange(path, value);
        if (value.length >= MIN_CHARS_FOR_SUGGESTIONS) {
            setIsOpen(true);
        }
    };

    const handleSelectSuggestion = (value: string) => {
        setInputValue(value);
        handleChange(path, value);
        setIsOpen(false);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape") {
            setIsOpen(false);
        }
    };

    const handleBlur = () => {
        setTimeout(() => {
            setIsOpen(false);
        }, 150);
    };

    if (visible === false) {
        return null;
    }

    if (!suggestionsEnabled) {
        return (
            <div className="space-y-1.5">
                {label && (
                    <Label htmlFor={id} className="text-sm font-medium">
                        {label}
                        {required && <span className="text-destructive ml-0.5">*</span>}
                    </Label>
                )}
                <Input
                    ref={inputRef}
                    id={id}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    disabled={enabled === false}
                    aria-invalid={!!errors}
                    aria-describedby={
                        description ? `${id}-description` : undefined
                    }
                    className="w-full"
                />
                {description && !errors && (
                    <p
                        id={`${id}-description`}
                        className="text-xs text-muted-foreground"
                    >
                        {description}
                    </p>
                )}
                {errors && (
                    <p className="text-xs text-destructive font-medium">{errors}</p>
                )}
            </div>
        );
    }

    const showSuggestions =
        isOpen &&
        debouncedValue.length >= MIN_CHARS_FOR_SUGGESTIONS &&
        (isLoading || suggestions.length > 0 || hasError);

    return (
        <div className="space-y-1.5">
            {label && (
                <Label htmlFor={id} className="text-sm font-medium">
                    {label}
                    {required && <span className="text-destructive ml-0.5">*</span>}
                </Label>
            )}

            <Popover open={showSuggestions} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Input
                        ref={inputRef}
                        id={id}
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={() => {
                            if (inputValue.length >= MIN_CHARS_FOR_SUGGESTIONS) {
                                setIsOpen(true);
                            }
                        }}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        disabled={enabled === false}
                        aria-invalid={!!errors}
                        aria-describedby={
                            description ? `${id}-description` : undefined
                        }
                        className="w-full"
                    />
                </PopoverTrigger>
                <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-0"
                    align="start"
                    sideOffset={4}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                >
                    <Command>
                        <CommandList className="max-h-[240px]">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-4 px-2">
                                    <Loader2 className="h-4 w-4 animate-spin mr-2 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                        Loading suggestions...
                                    </span>
                                </div>
                            ) : hasError ? (
                                <CommandEmpty className="py-4 text-destructive">
                                    Failed to load suggestions
                                </CommandEmpty>
                            ) : suggestions.length === 0 ? (
                                <CommandEmpty className="py-4">
                                    No suggestions found
                                </CommandEmpty>
                            ) : (
                                <CommandGroup heading="Suggestions">
                                    {suggestions.map((suggestion, index) => (
                                        <CommandItem
                                            key={`${suggestion}-${index}`}
                                            value={suggestion}
                                            onSelect={() => handleSelectSuggestion(suggestion)}
                                            className="cursor-pointer"
                                        >
                                            <span className="truncate">{suggestion}</span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {description && !errors && (
                <p
                    id={`${id}-description`}
                    className="text-xs text-muted-foreground"
                >
                    {description}
                </p>
            )}

            {errors && (
                <p className="text-xs text-destructive font-medium">{errors}</p>
            )}
        </div>
    );
}

export const SuggestionTextControl = withJsonFormsControlProps(
    SuggestionTextRenderer
);

export const suggestionTextControlTester: RankedTester = (
    uischema,
    schema,
    context
) => {
    if (!isStringControl(uischema, schema, context)) {
        return -1;
    }

    const options = (uischema as any)?.options;
    if (options && options.suggest === false) {
        return -1;
    }

    return 10;
};
