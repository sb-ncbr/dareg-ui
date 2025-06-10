import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface ReusableDropdownProps<T> {
  fetchData: () => { data: T[] | undefined; isLoading: boolean; error: any };
  getItemLabel: (item: T) => string;
  getItemId: (item: T) => string;
  placeholder?: string;
  selectedItem?: string | null;
  onChange?: (item: T) => void;
}

const ReusableDropdown = <T,>({
  fetchData,
  getItemLabel,
  getItemId,
  placeholder = "Select an item",
  selectedItem: controlledSelectedItem,
  onChange,
}: ReusableDropdownProps<T>) => {
  const { data, isLoading, error } = fetchData();
  const [uncontrolledSelectedItem, setUncontrolledSelectedItem] = useState<
    string | null
  >(null);
  const [isOpen, setIsOpen] = useState(false);

  const selectedItem =
    controlledSelectedItem !== undefined
      ? controlledSelectedItem
      : uncontrolledSelectedItem;

  useEffect(() => {
    if (data && data.length > 0 && !selectedItem) {
      const firstId = getItemId(data[0]);
      if (controlledSelectedItem === undefined) {
        setUncontrolledSelectedItem(firstId);
      }
    }
  }, [data, selectedItem, getItemId, controlledSelectedItem]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data.</div>;

  return (
    <div>
      <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center justify-between"
          >
            {selectedItem
              ? getItemLabel(
                  data?.find((item) => getItemId(item) === selectedItem)!
                )
              : placeholder}
            <ChevronDown
              className={`ml-2 transition-transform ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {data?.map((item) => (
            <DropdownMenuItem
              key={getItemId(item)}
              onClick={() => {
                if (controlledSelectedItem === undefined) {
                  setUncontrolledSelectedItem(getItemId(item));
                }
                onChange?.(item);
              }}
            >
              {getItemLabel(item)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ReusableDropdown;
