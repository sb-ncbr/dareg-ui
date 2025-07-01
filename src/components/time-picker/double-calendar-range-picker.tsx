"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { DateRange } from "react-day-picker";

export function DoubleRangeCalendar({
  fromLabel = "Date from",
  toLabel = "Date to",
  value,
  onChange,
}: {
  fromLabel?: string;
  toLabel?: string;
  value: DateRange;
  onChange: (range: DateRange) => void;
}) {
  return (
    <div className="flex gap-8">
      <div className="flex flex-col items-center">
        <Label className="mb-2 text-md">{fromLabel}</Label>
        <Calendar
          mode="single"
          captionLayout="dropdown"
          selected={value.from}
          onSelect={(date) => onChange({ ...value, from: date ?? undefined })}
          className="rounded-lg border shadow-sm"
        />
      </div>
      <div className="flex flex-col items-center">
        <Label className="mb-2 text-md">{toLabel}</Label>
        <Calendar
          mode="single"
          captionLayout="dropdown"
          selected={value.to}
          onSelect={(date) => onChange({ ...value, to: date ?? undefined })}
          className="rounded-lg border shadow-sm"
        />
      </div>
    </div>
  );
}
