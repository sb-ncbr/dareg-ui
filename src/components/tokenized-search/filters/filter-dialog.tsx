import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { AutoFilters, AutoFilterState } from "./auto-filters";
import {
  FilterOption,
  InputType,
  MODEL_MAP,
  MetadataField,
  MetadataSection,
  UnwrappedMetadata,
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
import filterExcludeConfigJson from "../configuration/extended-search-restrictions.json";
import {
  unwrapMetadata,
  createFlatFilterOptions,
} from "../utils/metadata-unwrapper";
import TemplateSelectSSR from "@/components/select/template-select";
import ProjectSelectSSR from "@/components/select/project-select";
import { DoubleRangeCalendarPopover } from "@/components/time-picker/double-calendar-popover";

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
  // Type assertion for imported JSON config
  const filterExcludeConfig = filterExcludeConfigJson as Record<
    string,
    string[]
  >;

  // Helper to filter out excluded fields for a model
  function getFilteredModelFilters(modelKey: string) {
    const lowerKey = modelKey.toLowerCase();
    const excluded = [
      ...(filterExcludeConfig[lowerKey] ?? []),
      ...(filterExcludeConfig["common"] ?? []),
    ];
    return MODEL_MAP[modelKey].filters.filter((f) => !excluded.includes(f.key));
  }

  const modelKeys = Object.keys(MODEL_MAP);
  const { setSelectedSchemaId } = useSearch();

  const [selectedModelKey, setSelectedModelKey] = useState<string | null>(null);
  const [filterState, setFilterState] = useState<AutoFilterState>({});
  const [selectedSchema, setSelectedSchema] = useState<string>("");
  const [schemaMetadata, setSchemaMetadata] =
    useState<UnwrappedMetadata | null>(null);

  const modelsWithSchemaDropdown = ["Datasets"];

  const { data: schemasData, isLoading: isSchemasLoading } =
    useApiServiceGetApiV1Schemas();

  const availableSchemas =
    schemasData?.results?.map((schema) => schema.name) || [];

  // Helper function to determine if a field needs a dropdown
  const getFieldDropdownType = (
    fieldKey: string
  ): "schema" | "project" | null => {
    if (fieldKey === "schema") return "schema";
    if (fieldKey === "project") return "project";
    if (fieldKey.includes("_id") || fieldKey === "reservationId")
      return "project"; // Default to project for ID fields
    return null;
  };

  const handleSelectModel = (modelKey: string | null) => {
    const newModelKey = selectedModelKey === modelKey ? null : modelKey;
    setSelectedModelKey(newModelKey);
    setFilterState({});
    setSchemaMetadata(null);
    setSelectedSchema("");
    setSelectedSchemaId(null);
  };

  const handleSchemaSelection = (schemaName: string) => {
    setSelectedSchema(schemaName);

    const selectedSchemaObj = schemasData?.results?.find(
      (schema) => schema.name === schemaName
    );

    if (selectedSchemaObj) {
      console.log("Selected schema object:", selectedSchemaObj);
      console.log(
        "Schema properties:",
        (selectedSchemaObj.schema as any)?.properties
      );

      // Use the new enhanced metadata unwrapping
      const metadata = unwrapMetadata(selectedSchemaObj.schema);
      console.log("Unwrapped metadata:", metadata);

      setSchemaMetadata(metadata);
      setSelectedSchemaId(selectedSchemaObj.id);

      // Add the schema to the filter state so it gets included in the tokens and query body
      setFilterState((prev) => ({
        ...prev,
        schema: selectedSchemaObj.id,
      }));
    }
  };

  const handleFieldChange = (fieldKey: string, value: any) => {
    setFilterState((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  };

  const renderMetadataField = (field: MetadataField) => {
    const value = filterState[field.key] ?? "";
    const dropdownType = getFieldDropdownType(field.key);

    // Handle ID fields with dropdowns
    if (dropdownType === "schema") {
      const displayValue =
        (filterState[`${field.key}_name`] as string) || (value as string);
      return (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={field.key}>{field.label}</Label>
          <TemplateSelectSSR
            value={value as string}
            onChange={(schema) =>
              setFilterState((prev) => ({
                ...prev,
                [field.key]: schema.id,
                [`${field.key}_name`]: schema.name,
              }))
            }
          />
        </div>
      );
    }

    if (dropdownType === "project") {
      const displayValue =
        (filterState[`${field.key}_name`] as string) || (value as string);
      return (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={field.key}>{field.label}</Label>
          <ProjectSelectSSR
            value={value as string}
            onChange={(project) =>
              setFilterState((prev) => ({
                ...prev,
                [field.key]: project.id,
                [`${field.key}_name`]: project.name,
              }))
            }
          />
        </div>
      );
    }

    // Handle regular input types
    switch (field.inputType) {
      case "number":
        return (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={field.key}>{field.label}</Label>
            <div className="flex flex-col gap-2 pt-2">
              <Slider
                min={field.min ?? 1970}
                max={field.max ?? 2030}
                value={[typeof value === "number" ? value : field.min ?? 1970]}
                onValueChange={([val]) => handleFieldChange(field.key, val)}
                step={field.step || 1}
                className="w-full h-full"
              />
            </div>
          </div>
        );
      case "date":
        return (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={field.key}>{field.label}</Label>
            <DoubleRangeCalendarPopover
              value={value as { from: Date | undefined; to: Date | undefined }}
              onChange={(range) => handleFieldChange(field.key, range)}
            />
          </div>
        );
      case "boolean":
        return (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={field.key}>{field.label}</Label>
            <Select
              value={value === "" ? "" : String(value)}
              onValueChange={(val) =>
                handleFieldChange(field.key, val === "" ? "" : val === "true")
              }
            >
              <SelectTrigger id={field.key}>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any</SelectItem>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case "string":
      default:
        return (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={field.key}>{field.label}</Label>
            <Input
              id={field.key}
              type="text"
              value={value as string}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.placeholder || `e.g. ${field.label}...`}
            />
          </div>
        );
    }
  };

  const renderMetadataSection = (section: MetadataSection) => (
    <AccordionItem key={section.key} value={section.key}>
      <AccordionTrigger className="text-sm font-medium">
        {section.label}
        {section.description && (
          <span className="text-xs text-muted-foreground ml-2">
            {section.description}
          </span>
        )}
      </AccordionTrigger>
      <AccordionContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 max-h-[50vh] overflow-y-auto pr-2">
          {section.fields.map((field) => (
            <div key={field.key} className="flex flex-col gap-1.5 text-sm">
              {renderMetadataField(field)}
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );

  const currentModelConfig = selectedModelKey
    ? MODEL_MAP[selectedModelKey]
    : null;
  const apiModel = currentModelConfig?.apiModel;

  const handleApply = () => {
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

                      {/* Enhanced metadata rendering with sections */}
                      {schemaMetadata && (
                        <div className="mt-4">
                          <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
                            <strong>Debug Info:</strong>
                            <br />
                            Sections: {schemaMetadata.sections.length}
                            <br />
                            Flat Fields: {schemaMetadata.flatFields.length}
                            <br />
                            Matrix Fields: {schemaMetadata.matrixFields.length}
                            <br />
                            Suggestion Fields:{" "}
                            {schemaMetadata.suggestionFields.length}
                          </div>

                          <Accordion type="multiple" className="w-full">
                            {/* Render sections */}
                            {schemaMetadata.sections.map(renderMetadataSection)}

                            {/* Render flat fields */}
                            {schemaMetadata.flatFields.length > 0 && (
                              <AccordionItem value="other-fields">
                                <AccordionTrigger className="text-sm font-medium">
                                  Other Fields
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 max-h-[50vh] overflow-y-auto pr-2">
                                    {schemaMetadata.flatFields.map((field) => (
                                      <div
                                        key={field.key}
                                        className="flex flex-col gap-1.5 text-sm"
                                      >
                                        {renderMetadataField(field)}
                                      </div>
                                    ))}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            )}
                          </Accordion>
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
                        filters={getFilteredModelFilters(selectedModelKey)}
                        filterState={filterState}
                        onChange={setFilterState}
                        getFieldDropdownType={getFieldDropdownType}
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
              setSchemaMetadata(null);
              setSelectedSchema("");
              setSelectedSchemaId(null);
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
