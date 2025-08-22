"use client";
import * as React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type ReusableSelectProps<T> = {
  items: T[];
  getItemLabel: (item: T) => string;
  getItemId: (item: T) => string;
  placeholder?: string;
  value?: string | null;
  onChange?: (item: T) => void;
};

export function ReusableSelect<T>({
  items,
  getItemLabel,
  getItemId,
  placeholder = "Select an item",
  value: controlledValue,
  onChange,
}: ReusableSelectProps<T>) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<
    string | null
  >(null);

  const value =
    controlledValue !== undefined ? controlledValue : uncontrolledValue;

  // Find the selected item to get its label for display
  const selectedItem = items.find((item) => getItemId(item) === value);
  const displayValue = selectedItem ? getItemLabel(selectedItem) : "";

  React.useEffect(() => {
    if (items.length > 0 && !value) {
      const firstId = getItemId(items[0]);
      if (controlledValue === undefined) {
        setUncontrolledValue(firstId);
      }
    }
  }, [items, value, controlledValue, getItemId]);

  return (
    <Select
      value={value ?? ""}
      onValueChange={(val) => {
        const selected = items.find((item) => getItemId(item) === val);
        if (controlledValue === undefined) {
          setUncontrolledValue(val);
        }
        if (selected && onChange) onChange(selected);
      }}
    >
      <SelectTrigger className="w-[320px]">
        <SelectValue placeholder={placeholder}>{displayValue}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={getItemId(item)} value={getItemId(item)}>
            {getItemLabel(item)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
