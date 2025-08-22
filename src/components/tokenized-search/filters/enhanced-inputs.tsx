"use client";

import { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Search, Loader2 } from "lucide-react";
import {
  MetadataField,
  SuggestionConfig,
  MatrixConfig,
} from "../types/search-models";
import { useDebounce } from "../../../hooks/use-debounce";

// Matrix Input Component
interface MatrixInputProps {
  field: MetadataField;
  value: any;
  onChange: (value: any) => void;
}

export function MatrixInput({ field, value, onChange }: MatrixInputProps) {
  const matrix = field.matrix!;
  const [matrixData, setMatrixData] = useState<any[][]>(() => {
    if (value && Array.isArray(value)) {
      return value;
    }
    // Initialize empty matrix
    return Array.from({ length: matrix.rows }, () =>
      Array.from({ length: matrix.columns }, () =>
        matrix.cellType === "number"
          ? 0
          : matrix.cellType === "boolean"
          ? false
          : ""
      )
    );
  });

  const updateMatrix = useCallback(
    (rowIndex: number, colIndex: number, newValue: any) => {
      const newMatrix = matrixData.map((row, i) =>
        i === rowIndex
          ? row.map((cell, j) => (j === colIndex ? newValue : cell))
          : row
      );
      setMatrixData(newMatrix);
      onChange(newMatrix);
    },
    [matrixData, onChange]
  );

  const addRow = useCallback(() => {
    const newRow = Array.from({ length: matrix.columns }, () =>
      matrix.cellType === "number"
        ? 0
        : matrix.cellType === "boolean"
        ? false
        : ""
    );
    const newMatrix = [...matrixData, newRow];
    setMatrixData(newMatrix);
    onChange(newMatrix);
  }, [matrixData, matrix.columns, matrix.cellType, onChange]);

  const removeRow = useCallback(
    (rowIndex: number) => {
      if (matrixData.length > matrix.rows) {
        const newMatrix = matrixData.filter((_, i) => i !== rowIndex);
        setMatrixData(newMatrix);
        onChange(newMatrix);
      }
    },
    [matrixData, matrix.rows, onChange]
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{field.label}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addRow}
          disabled={matrixData.length >= 10} // Limit to 10 rows
        >
          Add Row
        </Button>
      </div>

      {field.description && (
        <p className="text-xs text-muted-foreground">{field.description}</p>
      )}

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              {matrix.columnLabels
                ? matrix.columnLabels.map((label, i) => (
                    <th
                      key={i}
                      className="px-3 py-2 text-left text-xs font-medium"
                    >
                      {label}
                    </th>
                  ))
                : Array.from({ length: matrix.columns }, (_, i) => (
                    <th
                      key={i}
                      className="px-3 py-2 text-left text-xs font-medium"
                    >
                      Col {i + 1}
                    </th>
                  ))}
              <th className="px-3 py-2 text-left text-xs font-medium w-16">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {matrixData.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t">
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="px-3 py-2">
                    {matrix.cellType === "boolean" ? (
                      <input
                        type="checkbox"
                        checked={cell}
                        onChange={(e) =>
                          updateMatrix(rowIndex, colIndex, e.target.checked)
                        }
                        className="h-4 w-4"
                      />
                    ) : matrix.cellType === "number" ? (
                      <Input
                        type="number"
                        value={cell}
                        onChange={(e) =>
                          updateMatrix(
                            rowIndex,
                            colIndex,
                            parseFloat(e.target.value) || 0
                          )
                        }
                        min={matrix.minValue}
                        max={matrix.maxValue}
                        step={matrix.step}
                        className="h-8 text-sm"
                      />
                    ) : (
                      <Input
                        type="text"
                        value={cell}
                        onChange={(e) =>
                          updateMatrix(rowIndex, colIndex, e.target.value)
                        }
                        placeholder={`${matrix.cellType} value`}
                        className="h-8 text-sm"
                      />
                    )}
                  </td>
                ))}
                <td className="px-3 py-2">
                  {matrixData.length > matrix.rows && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRow(rowIndex)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-muted-foreground">
        Matrix size: {matrixData.length} × {matrix.columns}
        {matrixData.length > matrix.rows && ` (${matrix.rows} minimum rows)`}
      </div>
    </div>
  );
}

// Suggestion Input Component
interface SuggestionInputProps {
  field: MetadataField;
  value: any;
  onChange: (value: any) => void;
}

export function SuggestionInput({
  field,
  value,
  onChange,
}: SuggestionInputProps) {
  const suggestions = field.suggestions!;
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestionsList, setSuggestionsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const debouncedSearch = useDebounce(
    searchTerm,
    suggestions.debounceMs || 300
  );

  // Fetch suggestions from API
  const fetchSuggestions = useCallback(
    async (query: string) => {
      if (!suggestions.endpoint || query.length < (suggestions.minChars || 1)) {
        setSuggestionsList([]);
        return;
      }

      setIsLoading(true);
      try {
        let url = suggestions.endpoint;
        if (suggestions.type === "ror") {
          url = `${suggestions.endpoint}?${
            suggestions.searchField
          }=${encodeURIComponent(query)}`;
        } else if (suggestions.type === "orcid") {
          url = `${suggestions.endpoint}?${
            suggestions.searchField
          }=${encodeURIComponent(query)}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        let results = [];
        if (suggestions.type === "ror") {
          results = data.items || [];
        } else if (suggestions.type === "orcid") {
          results = data.result || [];
        } else if (suggestions.type === "enum") {
          results = suggestions.enum || [];
        }

        setSuggestionsList(results);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        setSuggestionsList([]);
      } finally {
        setIsLoading(false);
      }
    },
    [suggestions]
  );

  useEffect(() => {
    if (debouncedSearch) {
      fetchSuggestions(debouncedSearch);
    } else {
      setSuggestionsList([]);
    }
  }, [debouncedSearch, fetchSuggestions]);

  const handleSelect = (item: any) => {
    const transformed = suggestions.transform
      ? suggestions.transform(item)
      : item;
    setSelectedItem(transformed);
    onChange(transformed.value);
    setSearchTerm(transformed.label);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedItem(null);
    setSearchTerm("");
    onChange("");
    setSuggestionsList([]);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{field.label}</Label>

      {field.description && (
        <p className="text-xs text-muted-foreground">{field.description}</p>
      )}

      <div className="relative">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder={`Search ${field.label.toLowerCase()}...`}
              className="pl-10"
            />
          </div>
          {selectedItem && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="h-8 px-2"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Suggestions dropdown */}
        {isOpen && searchTerm.length >= (suggestions.minChars || 1) && (
          <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Searching...
              </div>
            ) : suggestionsList.length > 0 ? (
              <div className="py-1">
                {suggestionsList.map((item, index) => {
                  const transformed = suggestions.transform
                    ? suggestions.transform(item)
                    : item;
                  return (
                    <button
                      key={index}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-muted/50 focus:bg-muted/50 focus:outline-none"
                      onClick={() => handleSelect(item)}
                    >
                      <div className="font-medium">{transformed.label}</div>
                      {suggestions.type === "ror" && item.acronyms && (
                        <div className="text-xs text-muted-foreground">
                          {item.acronyms.join(", ")}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : searchTerm && !isLoading ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No results found
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Selected item display */}
      {selectedItem && (
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-xs">
            Selected: {selectedItem.label}
          </Badge>
        </div>
      )}
    </div>
  );
}
