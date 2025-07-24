import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DoubleRangeCalendarPopover } from "@/components/time-picker/double-calendar-popover";
import { DateRange } from "react-day-picker";
import React from "react";

// Helper to guess field type for input rendering
function getFieldType(
  value: any,
  key: string
): "date" | "number" | "string" | "boolean" {
  if (
    key === "created" ||
    key === "modified" ||
    key.endsWith("_date") ||
    key.endsWith("_time")
  )
    return "date";
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  return "string";
}

export type AutoFilterState = Record<string, any>;

interface AutoFiltersProps<T extends object> {
  sample: T;
  filterState: AutoFilterState;
  onChange: (value: AutoFilterState) => void;
}

const DEFAULT_DATE_RANGE = {
  from: new Date("1000-01-01"),
  to: new Date("9999-12-31"),
};

export function AutoFilters<T extends object>({
  sample,
  filterState,
  onChange,
}: AutoFiltersProps<T>) {
  return (
    <div className="flex flex-wrap gap-4 mx-4 mb-6 items-end">
      {Object.entries(sample).map(([key, value]) => {
        const type = getFieldType(value, key);

        if (type === "string" || type === "number") {
          return (
            <div key={key}>
              <Label className="block text-xs mb-1">{key}</Label>
              <Input
                type={type}
                placeholder={key}
                value={filterState[key] ?? ""}
                onChange={(e) =>
                  onChange({ ...filterState, [key]: e.target.value })
                }
                className="w-[200px]"
              />
            </div>
          );
        }
        if (type === "date") {
          return (
            <div key={key}>
              <Label className="block text-xs mb-1">{key} Range</Label>
              <DoubleRangeCalendarPopover
                value={filterState[key] ?? DEFAULT_DATE_RANGE}
                onChange={(range: DateRange) =>
                  onChange({
                    ...filterState,
                    [key]: range ?? DEFAULT_DATE_RANGE,
                  })
                }
              />
            </div>
          );
        }
        if (type === "boolean") {
          return (
            <div key={key}>
              <Label className="block text-xs mb-1">{key}</Label>
              <input
                type="checkbox"
                checked={!!filterState[key]}
                onChange={(e) =>
                  onChange({ ...filterState, [key]: e.target.checked })
                }
              />
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
