import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { DoubleRangeCalendar } from "./double-calendar-range-picker";
import { formatDate } from "@/utils/date-formater";
import { Label } from "../ui/label";

const DEFAULT_DATE_RANGE: DateRange = {
  from: new Date("1000-01-01"),
  to: new Date("9999-12-31"),
};

function isDefaultFrom(date?: Date) {
  return !date || date.getTime() === DEFAULT_DATE_RANGE.from!.getTime();
}

function isDefaultTo(date?: Date) {
  return !date || date.getTime() === DEFAULT_DATE_RANGE.to!.getTime();
}
export function DoubleRangeCalendarPopover({
  value,
  onChange,
}: {
  value: DateRange;
  onChange: (range: DateRange) => void;
}) {
  const [open, setOpen] = React.useState(false);

  let display = "All dates";
  if (!isDefaultFrom(value.from) && !isDefaultTo(value.to)) {
    display = `${formatDate(value.from!.toISOString())} - ${formatDate(
      value.to!.toISOString()
    )}`;
  } else if (!isDefaultFrom(value.from) && isDefaultTo(value.to)) {
    display = `After ${formatDate(value.from!.toISOString())}`;
  } else if (isDefaultFrom(value.from) && !isDefaultTo(value.to)) {
    display = `Up to ${formatDate(value.to!.toISOString())}`;
  }

  return (
    <div>
      <Label className="block text-xs mb-1">Time Span</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-64 justify-between font-normal"
          >
            {display}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <div className="p-4">
            <DoubleRangeCalendar
              value={value}
              onChange={(range: DateRange) => {
                const safeRange: DateRange = {
                  from: range?.from ?? DEFAULT_DATE_RANGE.from,
                  to: range?.to ?? DEFAULT_DATE_RANGE.to,
                };
                onChange(safeRange);
                if (safeRange.from && safeRange.to) {
                  setOpen(false);
                }
              }}
              fromLabel="Date from"
              toLabel="Date to"
            />
            <div className="flex justify-end mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onChange(DEFAULT_DATE_RANGE);
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
