"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterOption } from "../types/search-models";
import { DoubleRangeCalendarPopover } from "@/components/time-picker/double-calendar-popover";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import TemplateSelectSSR from "@/components/select/template-select";
import ProjectSelectSSR from "@/components/select/project-select";

export type AutoFilterState = Record<
  string,
  string | number | boolean | Date | { from?: Date; to?: Date }
>;

const DEFAULT_SLIDER_MIN = 1970;
const DEFAULT_SLIDER_MAX = 2030;

interface AutoFiltersProps {
  filters: FilterOption[];
  filterState: AutoFilterState;
  onChange: (newState: AutoFilterState) => void;
  getFieldDropdownType?: (fieldKey: string) => "schema" | "project" | null;
}

export function AutoFilters({
  filters,
  filterState,
  onChange,
  getFieldDropdownType,
}: AutoFiltersProps) {
  const handleChange = (key: string, value: any) => {
    const newFilterState = { ...filterState };
    if (value === "" || value === null || value === undefined) {
      delete newFilterState[key];
    } else {
      newFilterState[key] = value;
    }
    onChange(newFilterState);
  };

  const renderInput = (filter: FilterOption) => {
    const value = filterState[filter.key] ?? "";
    const dropdownType = getFieldDropdownType?.(filter.key);

    // Handle ID fields with dropdowns
    if (dropdownType === "schema") {
      const displayValue =
        (filterState[`${filter.key}_name`] as string) || (value as string);
      return (
        <TemplateSelectSSR
          value={value as string} // Pass the ID, not the display name
          onChange={(schema) =>
            onChange({
              ...filterState,
              [filter.key]: schema.id, // Store the ID for search
              [`${filter.key}_name`]: schema.name, // Store the name for display
            })
          }
        />
      );
    }

    if (dropdownType === "project") {
      const displayValue =
        (filterState[`${filter.key}_name`] as string) || (value as string);
      return (
        <ProjectSelectSSR
          value={value as string} // Pass the ID, not the display name
          onChange={(project) =>
            onChange({
              ...filterState,
              [filter.key]: project.id, // Store the ID for search
              [`${filter.key}_name`]: project.name, // Store the name for display
            })
          }
        />
      );
    }

    switch (filter.inputType) {
      case "number":
        return (
          <div className="flex flex-col gap-2 pt-2">
            <Slider
              min={filter.min ?? DEFAULT_SLIDER_MIN}
              max={filter.max ?? DEFAULT_SLIDER_MAX}
              value={[typeof value === "number" ? value : DEFAULT_SLIDER_MIN]}
              onValueChange={([val]) => handleChange(filter.key, val)}
              step={1}
              className="w-full h-full"
            />
          </div>
        );
      case "date":
        // --- Use DoubleRangeCalendarPopover like in CommonFilters ---
        let dateRange: { from: Date | undefined; to: Date | undefined } = {
          from: undefined,
          to: undefined,
        };
        if (
          typeof value === "object" &&
          value !== null &&
          "from" in value &&
          "to" in value
        ) {
          dateRange = {
            from: value.from ? new Date(value.from) : undefined,
            to: value.to ? new Date(value.to) : undefined,
          };
        } else if (value instanceof Date) {
          dateRange = { from: value, to: undefined };
        } else if (typeof value === "string" && value) {
          dateRange = { from: new Date(value), to: undefined };
        }

        return (
          <DoubleRangeCalendarPopover
            value={dateRange}
            onChange={(range) => handleChange(filter.key, range)}
          />
        );
      case "boolean":
        return (
          <Select
            value={value === "" ? "" : String(value)}
            onValueChange={(val) =>
              handleChange(filter.key, val === "" ? "" : val === "true")
            }
          >
            <SelectTrigger id={filter.key}>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any</SelectItem>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        );
      case "string":
      default:
        return (
          <Input
            id={filter.key}
            type="text"
            value={value as string}
            onChange={(e) => handleChange(filter.key, e.target.value)}
            placeholder={`e.g. ${filter.label}...`}
          />
        );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 max-h-[50vh] overflow-y-auto pr-2">
      {filters.map((filter) => (
        <div key={filter.key} className="flex flex-col gap-1.5 text-sm">
          <Label htmlFor={filter.key}>{filter.label}</Label>
          {renderInput(filter)}
        </div>
      ))}
    </div>
  );
}
