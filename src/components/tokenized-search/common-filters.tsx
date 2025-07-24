import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DoubleRangeCalendarPopover } from "@/components/time-picker/double-calendar-popover";
import { DateRange } from "react-day-picker";

export interface CommonFilterState {
  name: string;
  description: string;
  createdRange: DateRange;
  modifiedRange: DateRange;
}

const DEFAULT_DATE_RANGE = {
  from: new Date("1000-01-01"),
  to: new Date("9999-12-31"),
};

interface CommonFiltersProps {
  filterState: CommonFilterState;
  onChange: (value: CommonFilterState) => void;
}

export function CommonFilters({ filterState, onChange }: CommonFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 mx-4 mb-6 items-end">
      <div>
        <Label className="block text-xs mb-1">Search by Name</Label>
        <Input
          type="text"
          placeholder="Name"
          value={filterState.name}
          onChange={(e) => onChange({ ...filterState, name: e.target.value })}
          className="w-[200px]"
        />
      </div>
      <div>
        <Label className="block text-xs mb-1">Search by Description</Label>
        <Input
          type="text"
          placeholder="Description"
          value={filterState.description}
          onChange={(e) =>
            onChange({ ...filterState, description: e.target.value })
          }
          className="w-[200px]"
        />
      </div>
      <div>
        <Label className="block text-xs mb-1">Created Date Range</Label>
        <DoubleRangeCalendarPopover
          value={filterState.createdRange ?? DEFAULT_DATE_RANGE}
          onChange={(range: DateRange) =>
            onChange({
              ...filterState,
              createdRange: range ?? DEFAULT_DATE_RANGE,
            })
          }
        />
      </div>
      <div>
        <Label className="block text-xs mb-1">Modified Date Range</Label>
        <DoubleRangeCalendarPopover
          value={filterState.modifiedRange ?? DEFAULT_DATE_RANGE}
          onChange={(range: DateRange) =>
            onChange({
              ...filterState,
              modifiedRange: range ?? DEFAULT_DATE_RANGE,
            })
          }
        />
      </div>
    </div>
  );
}
