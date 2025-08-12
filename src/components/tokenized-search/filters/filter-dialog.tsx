import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AutoFilters, AutoFilterState } from "./auto-filters";
import {
  FilterOption,
  InputType,
  MODEL_MAP,
} from "@/components/tokenized-search/types/search-models";
import { useSearch } from "../providers/search-context";
import { Loader2 } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApiServiceGetApiV1Schemas } from "../../../../openapi/queries";

export function FilterDialog({
  open,
  onClose,
  onApply,
  resultCount,
}: {
  open: boolean;
  onClose: () => void;
  onApply: (type: string, filters: AutoFilterState, schemaId?: string) => void;
  resultCount?: number;
}) {
  const modelKeys = Object.keys(MODEL_MAP);
  const { setSelectedSchemaId } = useSearch();

  const [selectedModelKey, setSelectedModelKey] = useState<string | null>(null);
  const [filterState, setFilterState] = useState<AutoFilterState>({});
  const [selectedSchema, setSelectedSchema] = useState<string>("");
  const [schemaFilters, setSchemaFilters] = useState<FilterOption[]>([]);

  const modelsWithSchemaDropdown = ["Datasets"];

  const { data: schemasData, isLoading: isSchemasLoading } =
    useApiServiceGetApiV1Schemas();

  const availableSchemas =
    schemasData?.results?.map((schema) => schema.name) || [];

  const handleSelectModel = (modelKey: string | null) => {
    const newModelKey = selectedModelKey === modelKey ? null : modelKey;
    setSelectedModelKey(newModelKey);
    console.log("Selected model key:", newModelKey);
    setFilterState({});
    setSchemaFilters([]);
    setSelectedSchema("");
  };

  const handleSchemaSelection = (schemaName: string) => {
    setSelectedSchema(schemaName);

    const selectedSchema = schemasData?.results?.find(
      (schema) => schema.name === schemaName
    );

    if (selectedSchema) {
      const filters = mapSchemaToFilters(selectedSchema.schema);
      setSchemaFilters(filters);
      setSelectedSchemaId(selectedSchema.id);
    }
  };

  function recursiveMap(properties: any, prefix: string = ""): FilterOption[] {
    const filters: FilterOption[] = [];
    if (!properties) {
      return filters;
    }

    Object.keys(properties).forEach((key) => {
      const property = properties[key];
      const currentKey = prefix ? `${prefix}.${key}` : key;

      if (property.type === "object" && property.properties) {
        filters.push(...recursiveMap(property.properties, currentKey));
        return;
      }

      if (property.type === "array") {
        return;
      }

      const isDateString =
        property.type === "string" &&
        (property.format === "date" || property.format === "date-time");
      const isPrimitive = ["string", "integer", "number", "boolean"].includes(
        property.type
      );

      if (isPrimitive || isDateString) {
        filters.push({
          key: currentKey,
          label: property.title || currentKey.replace(/_/g, " "),
          inputType: mapSchemaPropertyToInputType(property),
        });
      }
    });

    return filters;
  }

  /**
   * Kicks off the recursive mapping of a schema to a flat list of filter options.
   * @param schema - The full JSON schema.
   * @returns An array of FilterOption objects.
   */
  function mapSchemaToFilters(schema: any): FilterOption[] {
    if (!schema || !schema.properties) return [];
    return recursiveMap(schema.properties);
  }

  function mapSchemaPropertyToInputType(property: any): InputType {
    if (
      property?.type === "string" &&
      (property?.format === "date" || property?.format === "date-time")
    ) {
      return "date";
    }
    switch (property?.type) {
      case "integer":
      case "number":
        return "number";
      case "boolean":
        return "boolean";
      case "string":
      default:
        return "string";
    }
  }

  const currentModelConfig = selectedModelKey
    ? MODEL_MAP[selectedModelKey]
    : null;
  const apiModel = currentModelConfig?.apiModel;

  const handleApply = () => {
    console.log("Applying filters:", filterState);
    if (apiModel) {
      const selectedSchemaId = schemasData?.results?.find(
        (schema) => schema.name === selectedSchema
      )?.id as string | undefined;

      onApply(apiModel, { ...filterState }, selectedSchemaId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-auto min-w-5xl max-w-[1200px]">
        <DialogHeader>
          <DialogTitle>All parameters</DialogTitle>
        </DialogHeader>
        <div className="flex min-h-[400px]">
          <div className="w-1/4 border-r pr-4">
            <ul className="flex flex-col gap-2">
              {modelKeys.map((key) => (
                <li key={key}>
                  <Button
                    variant={selectedModelKey === key ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleSelectModel(key)}
                  >
                    {MODEL_MAP[key].label}
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-3/4 pl-8">
            <Accordion type="single" collapsible className="w-full">
              {selectedModelKey &&
                modelsWithSchemaDropdown.includes(selectedModelKey) && (
                  <AccordionItem value="schema-selection">
                    <AccordionTrigger>Metadata Selection</AccordionTrigger>
                    <AccordionContent>
                      {isSchemasLoading ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="h-6 w-6 animate-spin" />
                          <span className="ml-2">Loading Templates...</span>
                        </div>
                      ) : (
                        <Select
                          onValueChange={handleSchemaSelection}
                          value={selectedSchema}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a schema" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableSchemas.map((schema) => (
                              <SelectItem key={schema} value={schema}>
                                {schema}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {schemaFilters.length > 0 && (
                        <div className="mt-4">
                          <AutoFilters
                            filters={schemaFilters}
                            filterState={filterState}
                            onChange={setFilterState}
                          />
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                )}

              {selectedModelKey && (
                <AccordionItem value="base-filters">
                  <AccordionTrigger>Base Filters</AccordionTrigger>
                  <AccordionContent>
                    {currentModelConfig ? (
                      <AutoFilters
                        filters={currentModelConfig.filters}
                        filterState={filterState}
                        onChange={setFilterState}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        Select a model to see available filters.
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>
        </div>
        <DialogFooter className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            onClick={() => {
              setFilterState({});
              setSchemaFilters([]);
              setSelectedSchema("");
            }}
          >
            Clear Filters
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleApply} disabled={!apiModel}>
            Show {resultCount ? `${resultCount} results` : "results"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
