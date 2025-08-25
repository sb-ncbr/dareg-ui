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
import { AutoFilters } from "./auto-filters";
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
import {
  convertFormDataToFilters,
  mergeFormDataWithFilters,
} from "../utils/query-converter";
import TemplateSelectSSR from "@/components/select/template-select";
import ProjectSelectSSR from "@/components/select/project-select";
import { DoubleRangeCalendarPopover } from "@/components/time-picker/double-calendar-popover";
import FormsWrapped from "@/components/forms/form-wraper/forms-wraped";

import { useApiServiceGetApiV1Schemas } from "../../../../openapi/queries";
import type { AutoFilterState } from "../utils/query-converter";
import "./enhanced-filter-dialog.css";

export function EnhancedFilterDialog({
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
  const filterExcludeConfig = filterExcludeConfigJson as Record<
    string,
    string[]
  >;

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
  const [useFormsWrapped, setUseFormsWrapped] = useState(false);
  const [formsWrappedData, setFormsWrappedData] = useState<any>({});
  const [formsWrappedErrors, setFormsWrappedErrors] = useState<any>({});
  const [showFadeIn, setShowFadeIn] = useState(false);
  const [showModeFadeIn, setShowModeFadeIn] = useState(false);
  const [showSchemaFadeIn, setShowSchemaFadeIn] = useState(false);

  const modelsWithSchemaDropdown = ["Datasets"];

  const { data: schemasData, isLoading: isSchemasLoading } =
    useApiServiceGetApiV1Schemas();

  const availableSchemas =
    schemasData?.results?.map((schema) => schema.name) || [];

  useEffect(() => {
    if (schemaMetadata) {
      setShowFadeIn(true);
    }
  }, [schemaMetadata]);

  useEffect(() => {
    if (schemasData && !isSchemasLoading) {
      setShowSchemaFadeIn(true);
    }
  }, [schemasData, isSchemasLoading]);

  const getFieldDropdownType = (
    fieldKey: string
  ): "schema" | "project" | null => {
    if (fieldKey === "schema") return "schema";
    if (fieldKey === "project") return "project";
    if (fieldKey.includes("_id") || fieldKey === "reservationId")
      return "project";
    return null;
  };

  const handleSelectModel = (modelKey: string | null) => {
    const newModelKey = selectedModelKey === modelKey ? null : modelKey;
    setSelectedModelKey(newModelKey);
    setFilterState({});
    setSchemaMetadata(null);
    setSelectedSchema("");
    setSelectedSchemaId(null);
    setUseFormsWrapped(false);
    setFormsWrappedData({});
  };

  const handleSchemaSelection = (schemaName: string) => {
    setSelectedSchema(schemaName);

    setShowFadeIn(false);

    const selectedSchemaObj = schemasData?.results?.find(
      (schema) => schema.name === schemaName
    );

    if (selectedSchemaObj) {
      console.log("Selected schema object:", selectedSchemaObj);
      console.log(
        "Schema properties:",
        (selectedSchemaObj.schema as any)?.properties
      );

      const metadata = unwrapMetadata(selectedSchemaObj.schema);
      console.log("Unwrapped metadata:", metadata);

      setSchemaMetadata(metadata);
      setSelectedSchemaId(selectedSchemaObj.id);

      setFilterState((prev) => ({
        ...prev,
        schema: selectedSchemaObj.id,
      }));

      setTimeout(() => setShowFadeIn(true), 50);
    }
  };

  const handleFieldChange = (fieldKey: string, value: any) => {
    setFilterState((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  };

  const handleFormsWrappedDataChange = (data: any) => {
    setFormsWrappedData(data);
  };

  const renderMetadataField = (field: MetadataField) => {
    const value = filterState[field.key] ?? "";
    const dropdownType = getFieldDropdownType(field.key);

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

      let finalFilters: AutoFilterState;

      if (useFormsWrapped) {
        finalFilters = mergeFormDataWithFilters(formsWrappedData, filterState);
      } else {
        finalFilters = filterState;
      }

      onApply(apiModel, finalFilters, selectedSchemaId);
    }
  };

  const selectedSchemaObj = schemasData?.results?.find(
    (schema) => schema.name === selectedSchema
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-auto min-w-5xl max-w-[1200px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Advanced Search Filters</DialogTitle>
        </DialogHeader>
        <div className="flex min-h-[400px] max-h-[70vh] overflow-hidden">
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

          <div className="w-3/4 pl-8 overflow-y-auto max-h-[65vh] pr-2">
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
                        <div
                          className={`transition-all duration-300 ease-out ${
                            showSchemaFadeIn
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 translate-y-4"
                          }`}
                        >
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
                        </div>
                      )}

                      {/* Toggle between FormsWrapped and manual rendering */}
                      {selectedSchemaObj && (
                        <div
                          className={`mt-4 space-y-4 transition-all duration-300 ease-out ${
                            showFadeIn
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 translate-y-4"
                          }`}
                        >
                          <div
                            className={`flex items-center space-x-4 transition-all duration-300 ease-out ${
                              showFadeIn
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-4"
                            }`}
                          >
                            <Label className="text-sm font-medium">
                              Metadata Input Method:
                            </Label>
                            <div className="text-xs text-muted-foreground">
                              Choose how to input metadata fields
                            </div>
                            <Select
                              value={
                                useFormsWrapped ? "forms-wrapped" : "manual"
                              }
                              onValueChange={(value) => {
                                setShowModeFadeIn(false);

                                setUseFormsWrapped(value === "forms-wrapped");
                                if (value === "forms-wrapped") {
                                  setFormsWrappedData(filterState);
                                }

                                setTimeout(() => setShowModeFadeIn(true), 50);
                              }}
                            >
                              <SelectTrigger className="w-48">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="manual">
                                  Manual Fields (Simple types only)
                                </SelectItem>
                                <SelectItem value="forms-wrapped">
                                  Enhanced Form (All field types)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {useFormsWrapped ? (
                            <div
                              className={`border rounded-lg p-4 bg-white transition-all duration-300 ease-out ${
                                showFadeIn
                                  ? "opacity-100 translate-y-0"
                                  : "opacity-0 translate-y-4"
                              }`}
                            >
                              <div className="mb-4">
                                <h4 className="text-sm font-medium mb-2">
                                  Enhanced Metadata Form
                                </h4>
                                <p className="text-xs text-gray-600">
                                  This form automatically handles enum values,
                                  validation, and complex field types.
                                </p>
                              </div>
                              <div className="max-h-[60vh] overflow-y-auto pr-2">
                                <div className="bg-white  rounded enhanced-filter-jsonforms">
                                  <FormsWrapped
                                    schema={selectedSchemaObj.schema as object}
                                    uischema={
                                      selectedSchemaObj.uischema as object
                                    }
                                    data={formsWrappedData}
                                    setData={handleFormsWrappedDataChange}
                                    setErrors={setFormsWrappedErrors}
                                  />
                                </div>
                              </div>
                              {Object.keys(formsWrappedErrors).length > 0 && (
                                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                                  <strong>Validation Errors:</strong>
                                  <pre className="mt-1">
                                    {JSON.stringify(
                                      formsWrappedErrors,
                                      null,
                                      2
                                    )}
                                  </pre>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div
                              className={`border rounded-lg p-4 bg-white transition-all duration-300 ease-out ${
                                showFadeIn && showModeFadeIn
                                  ? "opacity-100 translate-y-0"
                                  : "opacity-0 translate-y-4"
                              }`}
                            >
                              <div className="mb-4">
                                <h4 className="text-sm font-medium mb-2">
                                  Manual Metadata Fields
                                </h4>
                              </div>
                              {schemaMetadata && (
                                <div className="max-h-[60vh] overflow-y-auto pr-2">
                                  {schemaMetadata.sections.length > 0 ||
                                  schemaMetadata.flatFields.length > 0 ? (
                                    <Accordion
                                      type="multiple"
                                      className="w-full"
                                    >
                                      {schemaMetadata.sections.map(
                                        renderMetadataSection
                                      )}

                                      {schemaMetadata.flatFields.length > 0 && (
                                        <AccordionItem value="other-fields">
                                          <AccordionTrigger className="text-sm font-medium">
                                            Other Fields
                                          </AccordionTrigger>
                                          <AccordionContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                              {schemaMetadata.flatFields.map(
                                                (field) => (
                                                  <div
                                                    key={field.key}
                                                    className="flex flex-col gap-1.5 text-sm"
                                                  >
                                                    {renderMetadataField(field)}
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          </AccordionContent>
                                        </AccordionItem>
                                      )}
                                    </Accordion>
                                  ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                      <p className="text-sm">
                                        No simple fields available for manual
                                        input.
                                      </p>
                                      <p className="text-xs mt-1">
                                        This schema contains only complex fields
                                        (arrays, objects, enums) that are best
                                        handled by the Enhanced Form.
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
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
                      <div
                        className={`max-h-[40vh] overflow-y-auto pr-2 transition-all duration-300 ease-out ${
                          showFadeIn
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
                        }`}
                      >
                        <AutoFilters
                          filters={getFilteredModelFilters(selectedModelKey)}
                          filterState={filterState}
                          onChange={setFilterState}
                          getFieldDropdownType={getFieldDropdownType}
                        />
                      </div>
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
              setUseFormsWrapped(false);
              setFormsWrappedData({});
              setFormsWrappedErrors({});
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
