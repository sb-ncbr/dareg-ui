import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AutoFilters,
  AutoFilterState,
} from "@/components/tokenized-search/auto-filters";

const datasetSample = {
  id: "",
  name: "",
  description: "",
  created: "",
  modified: "",
  status: "",
  project: "",
  schema: "",
};
const projectSample = {
  id: "",
  name: "",
  description: "",
  created: "",
  modified: "",
  facility: "",
  default_dataset_schema: "",
};
const schemaSample = {
  id: "",
  name: "",
  description: "",
  created: "",
  modified: "",
  version: 1,
};

const TYPES = [
  { key: "dataset", label: "Dataset", sample: datasetSample },
  { key: "project", label: "Project", sample: projectSample },
  { key: "schema", label: "Schema", sample: schemaSample },
];

export function FilterDialog({
  open,
  onClose,
  onApply,
  resultCount,
}: {
  open: boolean;
  onClose: () => void;
  onApply: (type: string, filters: AutoFilterState) => void;
  resultCount?: number;
}) {
  const [selectedType, setSelectedType] = useState<string>("dataset");
  const [filterState, setFilterState] = useState<AutoFilterState>({});

  const currentSample = TYPES.find((t) => t.key === selectedType)?.sample ?? {};

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>All parameters</DialogTitle>
        </DialogHeader>
        <div className="flex min-h-[400px]">
          {/* Left side: type selector */}
          <div className="w-1/4 border-r pr-4">
            <ul className="flex flex-col gap-2">
              {TYPES.map((type) => (
                <li key={type.key}>
                  <Button
                    variant={selectedType === type.key ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedType(type.key)}
                  >
                    {type.label}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          {/* Right side: dynamic filters */}
          <div className="w-3/4 pl-8">
            <AutoFilters
              sample={currentSample}
              filterState={filterState}
              onChange={setFilterState}
            />
          </div>
        </div>
        <DialogFooter className="flex justify-between items-center mt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={() => onApply(selectedType, filterState)}
          >
            Show {resultCount ? `${resultCount} results` : "results"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
