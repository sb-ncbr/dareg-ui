import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ExperimentsFilterState } from "../types/experiments-filter-state";
import { DateRange } from "react-day-picker";
import { DoubleRangeCalendarPopover } from "@/components/time-picker/double-calendar-popover";
import { Label } from "@/components/ui/label";
import { ExperimentStatusEnum } from "../../../../openapi/requests/types.gen";
import { StatusLottieDot } from "../status/status-lottie-dot";

// Default date range: from year 1000 to year 9999
const DEFAULT_DATE_RANGE = {
  from: new Date("1000-01-01"),
  to: new Date("9999-12-31"),
};

interface ExperimentsFilterProps {
  filterState: ExperimentsFilterState;
  onChange: (value: ExperimentsFilterState) => void;
}

const EXPERIMENT_STATUSES: ExperimentStatusEnum[] = [
  "new",
  "prepared",
  "running",
  "synchronizing",
  "success",
  "failure",
  "discarded",
];

export function ExperimentsFilter({
  filterState,
  onChange,
}: ExperimentsFilterProps) {
  return (
    <div className="flex flex-wrap gap-4 mx-4 mb-6 items-end">
      <DoubleRangeCalendarPopover
        value={filterState.dateRange ?? DEFAULT_DATE_RANGE}
        onChange={(range: DateRange) =>
          onChange({
            ...filterState,
            dateRange: range ?? DEFAULT_DATE_RANGE,
          })
        }
      />
      <div>
        <Label className="block text-xs mb-1">Sort by Time</Label>
        <Select
          value={filterState.sortOrder}
          onValueChange={(v) =>
            onChange({ ...filterState, sortOrder: v as "asc" | "desc" })
          }
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">
              {" "}
              Ascending <span className="text-muted-foreground">▲</span>
            </SelectItem>
            <SelectItem value="desc">
              {" "}
              Descending <span className="text-muted-foreground">▼</span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="block text-xs mb-1">Status</Label>
        <Select
          value={filterState.status}
          onValueChange={(v) => onChange({ ...filterState, status: v })}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {EXPERIMENT_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                <span className="flex items-center gap-2">
                  <StatusLottieDot status={status} size={20} />
                  <span className="capitalize">{status}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="block text-xs mb-1">Search by name</Label>
        <Input
          type="text"
          placeholder="Search by name"
          value={filterState.search}
          onChange={(e) => onChange({ ...filterState, search: e.target.value })}
          className="w-[200px]"
        />
      </div>
    </div>
  );
}
