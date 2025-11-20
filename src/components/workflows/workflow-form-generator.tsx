"use client";

import { useState, useEffect, useRef, useMemo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Workflow, WorkflowFormData, WorkflowConfigField } from "@/components/workflows/types/workflows";
import { cn } from "@/lib/utils";
import {
    useApiServiceGetApiV1ProjectsById,
    useApiServiceGetApiV1DatasetsById,
    useApiServiceGetApiV1ExperimentsById,
    useApiServiceGetApiV1Projects,
    useApiServiceGetApiV1Datasets,
    useApiServiceGetApiV1Experiments,
} from "../../../openapi/queries";

type EntityType = "project" | "dataset" | "experiment";

interface WorkflowFormGeneratorProps {
    workflow: Workflow | null;
    onSubmit?: (formData: WorkflowFormData) => void;
    className?: string;
    entityId?: string;
    entityType?: EntityType;
}

function WorkflowFormSkeleton() {
    return (
        <Card className="w-full">
            <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-96" />
            </CardHeader>
            <CardContent className="space-y-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ))}
                <Skeleton className="h-10 w-32" />
            </CardContent>
        </Card>
    );
}

const SECTION_LABELS: Record<string, string> = {
    onedataInputStore: "Source",
    onedataOutputStore: "Output",
    appConfigDetails: "Config details",
};

function formatLabel(key: string): string {
    if (SECTION_LABELS[key]) {
        return SECTION_LABELS[key];
    }

    const humanized = key
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/[_\-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    if (!humanized) {
        return key;
    }

    return humanized.charAt(0).toUpperCase() + humanized.slice(1);
}

function isPlainObject(value: unknown): value is Record<string, any> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isWorkflowConfigField(value: unknown): value is WorkflowConfigField {
    return isPlainObject(value) && typeof value.type === "string";
}

function buildInitialFormData(config: Record<string, unknown>): WorkflowFormData {
    return Object.entries(config).reduce((acc, [key, rawValue]) => {
        if (isWorkflowConfigField(rawValue)) {
            if (rawValue.default !== undefined) {
                acc[key] = rawValue.default;
            }
            return acc;
        }

        if (isPlainObject(rawValue)) {
            const nestedDefaults = buildInitialFormData(rawValue);
            if (Object.keys(nestedDefaults).length > 0) {
                acc[key] = nestedDefaults;
            }
        }

        return acc;
    }, {} as WorkflowFormData);
}

function getValueAtPath(data: WorkflowFormData, path: string[]): any {
    return path.reduce<any>((current, segment) => {
        if (isPlainObject(current)) {
            return current[segment];
        }
        return undefined;
    }, data);
}

function updateValueAtPath(
    data: WorkflowFormData,
    path: string[],
    value: string | number | boolean | WorkflowFormData
): WorkflowFormData {
    if (path.length === 0) {
        return data;
    }

    const [head, ...rest] = path;

    if (rest.length === 0) {
        return {
            ...data,
            [head]: value,
        };
    }

    const current = data[head];
    const nextLevel = isPlainObject(current) ? (current as WorkflowFormData) : {};

    return {
        ...data,
        [head]: updateValueAtPath(nextLevel, rest, value),
    };
}

function RenderConfigInput({
    field,
    value,
    onChange,
    fieldId,
    label,
}: {
    field: WorkflowConfigField;
    value: string | number | boolean | undefined;
    onChange: (value: string | number | boolean) => void;
    fieldId: string;
    label: string;
}) {
    switch (field.type) {
        case "string": {
            if (field.options && field.options.length > 0) {
                return (
                    <div className="space-y-2">
                        <Select
                            value={(value as string) ?? ""}
                            onValueChange={(val) => onChange(val)}
                        >
                            <SelectTrigger id={fieldId}>
                                <SelectValue placeholder={`Select ${label.toLowerCase()}...`} />
                            </SelectTrigger>
                            <SelectContent>
                                {field.options.map((option) => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {field.description && (
                            <p className="text-xs text-muted-foreground">
                                {field.description}
                            </p>
                        )}
                    </div>
                );
            }

            return (
                <div className="space-y-2">
                    <Input
                        id={fieldId}
                        type="text"
                        value={(value as string) ?? ""}
                        onChange={(event) => onChange(event.target.value)}
                        placeholder={`Enter ${label.toLowerCase()}...`}
                        className="w-full"
                    />
                    {field.description && (
                        <p className="text-xs text-muted-foreground">
                            {field.description}
                        </p>
                    )}
                </div>
            );
        }

        case "number": {
            if (field.min !== undefined && field.max !== undefined) {
                const numericValue =
                    typeof value === "number"
                        ? value
                        : typeof field.default === "number"
                            ? field.default
                            : field.min;

                return (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{field.min}</span>
                            <span className="text-sm font-medium">{numericValue}</span>
                            <span className="text-sm text-muted-foreground">{field.max}</span>
                        </div>
                        <Slider
                            min={field.min}
                            max={field.max}
                            value={[numericValue]}
                            onValueChange={([val]) => onChange(val)}
                            step={1}
                            className="w-full"
                        />
                        {field.description && (
                            <p className="text-xs text-muted-foreground">
                                {field.description}
                            </p>
                        )}
                    </div>
                );
            }

            return (
                <div className="space-y-2">
                    <Input
                        id={fieldId}
                        type="number"
                        value={typeof value === "number" ? value : ""}
                        onChange={(event) => {
                            const inputValue = event.target.value;
                            const nextValue = inputValue === "" ? 0 : Number(inputValue);
                            onChange(Number.isNaN(nextValue) ? 0 : nextValue);
                        }}
                        placeholder={`Enter ${label.toLowerCase()}...`}
                        min={field.min}
                        max={field.max}
                        className="w-full"
                    />
                    {field.description && (
                        <p className="text-xs text-muted-foreground">
                            {field.description}
                        </p>
                    )}
                </div>
            );
        }

        case "boolean":
            return (
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id={fieldId}
                            checked={Boolean(value)}
                            onCheckedChange={(checked: boolean) => onChange(checked)}
                        />
                        <Label htmlFor={fieldId} className="text-sm">
                            {Boolean(value) ? "Enabled" : "Disabled"}
                        </Label>
                    </div>
                    {field.description && (
                        <p className="text-xs text-muted-foreground">
                            {field.description}
                        </p>
                    )}
                </div>
            );

        default:
            return (
                <div className="space-y-2">
                    <Input
                        id={fieldId}
                        type="text"
                        value={(value as string) ?? ""}
                        onChange={(event) => onChange(event.target.value)}
                        placeholder={`Enter ${label.toLowerCase()}...`}
                        className="w-full"
                    />
                    {field.description && (
                        <p className="text-xs text-muted-foreground">
                            {field.description}
                        </p>
                    )}
                </div>
            );
    }
}

export default function WorkflowFormGenerator({
    workflow,
    onSubmit,
    className,
    entityId,
    entityType,
}: WorkflowFormGeneratorProps) {
    const [formData, setFormData] = useState<WorkflowFormData>({});
    const [jobName, setJobName] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [selectedRootResourceId, setSelectedRootResourceId] = useState<string>("");
    const [selectedOutputResourceId, setSelectedOutputResourceId] = useState<string>("");
    const previousWorkflowIdRef = useRef<string | null>(null);

    // Fetch entity data based on entityId and entityType
    const { data: project } = useApiServiceGetApiV1ProjectsById(
        { id: entityId ?? "" },
        undefined,
        { enabled: Boolean(entityId && entityType === "project") }
    );

    const { data: dataset } = useApiServiceGetApiV1DatasetsById(
        { id: entityId ?? "" },
        undefined,
        { enabled: Boolean(entityId && entityType === "dataset") }
    );

    const { data: experiment } = useApiServiceGetApiV1ExperimentsById(
        { id: entityId ?? "" },
        undefined,
        { enabled: Boolean(entityId && entityType === "experiment") }
    );

    // Fetch lists of all entities for selection (for WriteData workflows)
    const { data: projectsList } = useApiServiceGetApiV1Projects(
        {},
        undefined,
        { enabled: workflow?.workflowType === 'WriteData' && entityType === 'project' }
    );

    const { data: datasetsList } = useApiServiceGetApiV1Datasets(
        {},
        undefined,
        { enabled: workflow?.workflowType === 'WriteData' && entityType === 'dataset' }
    );

    const { data: experimentsList } = useApiServiceGetApiV1Experiments(
        {},
        undefined,
        { enabled: workflow?.workflowType === 'WriteData' && entityType === 'experiment' }
    );

    // Compute the current entity name and onedata ID
    const entityInfo = useMemo(() => {
        if (entityType === "project" && project) {
            return {
                name: project.name,
                onedataId: project.onedata_space_id,
            };
        }
        if (entityType === "dataset" && dataset) {
            console.log('WORKFLOW FORM GENERATOR: Dataset:', dataset);
            return {
                name: dataset.name,
                onedataId: dataset.onedata_file_id,
            };
        }
        if (entityType === "experiment" && experiment) {
            console.log('WORKFLOW FORM GENERATOR: Experiment:', experiment);
            return {
                name: experiment.name ?? "Experiment",
                onedataId: experiment.onedata_file_id,
            };
        }
        return { name: undefined, onedataId: undefined };
    }, [entityType, project, dataset, experiment]);

    // Initialize form data with default values when workflow changes
    useEffect(() => {
        if (!workflow) {
            setFormData({});
            setJobName("");
            setJobDescription("");
            setSelectedRootResourceId("");
            setSelectedOutputResourceId("");
            previousWorkflowIdRef.current = null;
            return;
        }

        if (previousWorkflowIdRef.current !== workflow.id) {
            const initialData = buildInitialFormData(
                (workflow.appConfigDetails ?? {}) as Record<string, unknown>
            );
            setFormData(initialData);
            setJobName(`${workflow.name} - ${new Date().toLocaleDateString()}`);
            setJobDescription("");
            // Initialize with current entity - ensure it's a string
            const entityIdStr = entityId ? String(entityId) : "";
            console.log('Initializing selected resources with entityId:', entityIdStr);
            setSelectedRootResourceId(entityIdStr);
            setSelectedOutputResourceId(entityIdStr);
            previousWorkflowIdRef.current = workflow.id;
        }
    }, [workflow, entityId]);

    // Set onedata IDs when entity lists load and current entity is preselected
    useEffect(() => {
        if (!workflow || workflow.workflowType !== 'WriteData' || !entityId) {
            return;
        }

        // Wait until the appropriate list has loaded
        const listLoaded =
            (entityType === 'project' && projectsList?.results) ||
            (entityType === 'dataset' && datasetsList?.results) ||
            (entityType === 'experiment' && experimentsList?.results);

        if (!listLoaded) {
            console.log('Entity list not yet loaded, waiting...', { entityType });
            return;
        }

        const entityIdStr = String(entityId);
        console.log('Entity lists loaded, initializing onedata IDs:', {
            entityIdStr,
            selectedRootResourceId,
            selectedOutputResourceId,
            entityType,
            listLength: entityType === 'project'
                ? projectsList?.results?.length
                : entityType === 'dataset'
                    ? datasetsList?.results?.length
                    : experimentsList?.results?.length
        });

        // Set root resource onedata ID if entity is selected
        if (selectedRootResourceId === entityIdStr) {
            const onedataId = entityType === 'project'
                ? projectsList?.results?.find((p: any) => String(p.id) === entityIdStr)?.onedata_space_id
                : entityType === 'dataset'
                    ? datasetsList?.results?.find((d: any) => String(d.id) === entityIdStr)?.onedata_file_id
                    : experimentsList?.results?.find((e: any) => String(e.id) === entityIdStr)?.onedata_file_id;

            console.log('Setting onedataId for root resource:', { entityIdStr, onedataId });
            if (onedataId) {
                handleFieldChange(['rootResourceId'], entityIdStr);
                handleFieldChange(['rootResourceOnedataId'], onedataId);
            }
        }

        // Set output resource onedata ID if entity is selected
        if (selectedOutputResourceId === entityIdStr) {
            const onedataId = entityType === 'project'
                ? projectsList?.results?.find((p: any) => String(p.id) === entityIdStr)?.onedata_space_id
                : entityType === 'dataset'
                    ? datasetsList?.results?.find((d: any) => String(d.id) === entityIdStr)?.onedata_file_id
                    : experimentsList?.results?.find((e: any) => String(e.id) === entityIdStr)?.onedata_file_id;

            console.log('Setting onedataId for output resource:', { entityIdStr, onedataId });
            if (onedataId) {
                handleFieldChange(['outputResourceId'], entityIdStr);
                handleFieldChange(['outputResourceOnedataId'], onedataId);
            }
        }
    }, [workflow, entityId, entityType, selectedRootResourceId, selectedOutputResourceId, projectsList, datasetsList, experimentsList]);

    const handleFieldChange = (
        path: string[],
        value: string | number | boolean | WorkflowFormData
    ) => {
        setFormData((prev) => updateValueAtPath(prev, path, value));
    };

    const renderConfigurationItems = (
        entries: Record<string, unknown>,
        path: string[] = []
    ): ReactNode[] => {
        const items: ReactNode[] = [];

        Object.entries(entries).forEach(([key, rawValue]) => {
            const label = formatLabel(key);
            const entryKey = [...path, key].join(".");

            // Skip appConfig string - it's just a serialized version
            if (key === "appConfig" && typeof rawValue === "string") {
                return;
            }

            if (isWorkflowConfigField(rawValue)) {
                const fieldPath = [...path, key];
                const fieldId = `field-${fieldPath.join("-")}`;
                const fieldValue = getValueAtPath(formData, fieldPath) as
                    | string
                    | number
                    | boolean
                    | undefined;

                items.push(
                    <div key={entryKey} className="space-y-2">
                        <Label htmlFor={fieldId} className="text-sm font-medium">
                            {label}
                            {rawValue.required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        <RenderConfigInput
                            field={rawValue}
                            value={fieldValue}
                            onChange={(val) => handleFieldChange(fieldPath, val)}
                            fieldId={fieldId}
                            label={label}
                        />
                    </div>
                );

                return;
            }

            if (isPlainObject(rawValue)) {
                const nestedItems = renderConfigurationItems(
                    rawValue as Record<string, unknown>,
                    [...path, key]
                );

                if (nestedItems.length > 0) {
                    items.push(
                        <div key={entryKey} className="space-y-4">
                            <h4 className="text-base font-semibold">{label}</h4>
                            <div className="space-y-4">{nestedItems}</div>
                        </div>
                    );
                }
            }
        });

        return items;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit) {
            const submitData = {
                ...formData,
                jobName,
                jobDescription
            };
            console.log('=== FORM SUBMIT DEBUG ===');
            console.log('Form Data:', formData);
            console.log('Job Name:', jobName);
            console.log('Job Description:', jobDescription);
            console.log('Submit Data (merged):', submitData);
            console.log('Workflow:', workflow);
            console.log('Entity Info:', entityInfo);
            console.log('========================');
            onSubmit(submitData);
        }
    };

    if (!workflow) {
        return <WorkflowFormSkeleton />;
    }

    const configurationItems = renderConfigurationItems(
        (workflow.appConfigDetails ?? {}) as Record<string, unknown>
    );

    return (
        <Card className={cn("w-full h-full flex flex-col", className)}>
            <CardHeader className="shrink-0">
                <CardTitle className="text-xl">{workflow.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                    {workflow.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="bg-muted px-2 py-1 rounded">
                        {workflow.workflowType}
                    </span>
                    <span>Created: {new Date(workflow.created).toLocaleDateString()}</span>
                </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto max-h-126">
                <form onSubmit={handleSubmit} className="space-y-6 h-full flex flex-col">
                    <div className="flex-1 space-y-6 overflow-y-auto pr-2">
                        {/* Job Details */}
                        <div className="space-y-4 p-2">
                            <h3 className="text-lg font-semibold">Job Details</h3>
                            <div className="space-y-2">
                                <Label htmlFor="jobName">Job Name</Label>
                                <Input
                                    id="jobName"
                                    value={jobName}
                                    onChange={(e) => setJobName(e.target.value)}
                                    placeholder="Enter job name..."
                                    required
                                />
                            </div>
                            <div className="space-y-2 ">
                                <Label htmlFor="jobDescription">Job Description</Label>
                                <Textarea
                                    id="jobDescription"
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder="Enter job description..."
                                    rows={3}
                                />
                            </div>
                        </div>

                        {/* Resource Selection for WriteData workflows */}
                        {workflow.workflowType === 'WriteData' && (
                            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                                <h3 className="text-lg font-semibold">Resource Selection</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Configure the source and output resources for this workflow.
                                </p>

                                {/* Source Resource */}
                                <div className="space-y-2">
                                    <Label htmlFor="rootResourceSelect" className="text-base font-semibold">Source</Label>
                                    <Select
                                        value={selectedRootResourceId}
                                        onValueChange={(value) => {
                                            setSelectedRootResourceId(value);
                                            handleFieldChange(['rootResourceId'], value);
                                            // Also store the onedata ID
                                            const onedataId = entityType === 'project'
                                                ? projectsList?.results?.find((p: any) => String(p.id) === value)?.onedata_space_id
                                                : entityType === 'dataset'
                                                    ? datasetsList?.results?.find((d: any) => String(d.id) === value)?.onedata_file_id
                                                    : experimentsList?.results?.find((e: any) => String(e.id) === value)?.onedata_file_id;
                                            handleFieldChange(['rootResourceOnedataId'], onedataId || '');
                                        }}
                                    >
                                        <SelectTrigger id="rootResourceSelect">
                                            <SelectValue placeholder="Select entity..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {entityType === 'project' && projectsList?.results?.map((proj: any) => (
                                                <SelectItem key={proj.id} value={String(proj.id)}>
                                                    {proj.name} ({proj.id})
                                                </SelectItem>
                                            ))}
                                            {entityType === 'dataset' && datasetsList?.results?.map((ds: any) => (
                                                <SelectItem key={ds.id} value={String(ds.id)}>
                                                    {ds.name} ({ds.id})
                                                </SelectItem>
                                            ))}
                                            {entityType === 'experiment' && experimentsList?.results?.map((exp: any) => (
                                                <SelectItem key={exp.id} value={String(exp.id)}>
                                                    {exp.name} ({exp.id})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {selectedRootResourceId && (
                                        <div className="text-xs text-muted-foreground">
                                            Onedata {entityType === 'project' ? 'Space' : 'File'} ID: <span className="font-mono">
                                                {entityType === 'project'
                                                    ? projectsList?.results?.find((p: any) => String(p.id) === selectedRootResourceId)?.onedata_space_id
                                                    : entityType === 'dataset'
                                                        ? datasetsList?.results?.find((d: any) => String(d.id) === selectedRootResourceId)?.onedata_file_id
                                                        : experimentsList?.results?.find((e: any) => String(e.id) === selectedRootResourceId)?.onedata_file_id
                                                }
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Output Resource */}
                                <div className="space-y-2">
                                    <Label htmlFor="outputResourceSelect" className="text-base font-semibold">Output</Label>
                                    <Select
                                        value={selectedOutputResourceId}
                                        onValueChange={(value) => {
                                            setSelectedOutputResourceId(value);
                                            handleFieldChange(['outputResourceId'], value);
                                            // Also store the onedata ID
                                            const onedataId = entityType === 'project'
                                                ? projectsList?.results?.find((p: any) => String(p.id) === value)?.onedata_space_id
                                                : entityType === 'dataset'
                                                    ? datasetsList?.results?.find((d: any) => String(d.id) === value)?.onedata_file_id
                                                    : experimentsList?.results?.find((e: any) => String(e.id) === value)?.onedata_file_id;
                                            handleFieldChange(['outputResourceOnedataId'], onedataId || '');
                                        }}
                                    >
                                        <SelectTrigger id="outputResourceSelect">
                                            <SelectValue placeholder="Select entity..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {entityType === 'project' && projectsList?.results?.map((proj: any) => (
                                                <SelectItem key={proj.id} value={String(proj.id)}>
                                                    {proj.name} ({proj.id})
                                                </SelectItem>
                                            ))}
                                            {entityType === 'dataset' && datasetsList?.results?.map((ds: any) => (
                                                <SelectItem key={ds.id} value={String(ds.id)}>
                                                    {ds.name} ({ds.id})
                                                </SelectItem>
                                            ))}
                                            {entityType === 'experiment' && experimentsList?.results?.map((exp: any) => (
                                                <SelectItem key={exp.id} value={String(exp.id)}>
                                                    {exp.name} ({exp.id})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {selectedOutputResourceId && (
                                        <div className="text-xs text-muted-foreground">
                                            Onedata {entityType === 'project' ? 'Space' : 'File'} ID: <span className="font-mono">
                                                {entityType === 'project'
                                                    ? projectsList?.results?.find((p: any) => String(p.id) === selectedOutputResourceId)?.onedata_space_id
                                                    : entityType === 'dataset'
                                                        ? datasetsList?.results?.find((d: any) => String(d.id) === selectedOutputResourceId)?.onedata_file_id
                                                        : experimentsList?.results?.find((e: any) => String(e.id) === selectedOutputResourceId)?.onedata_file_id
                                                }
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* In-place Change Notice */}
                        {workflow.workflowType === 'In-placeChange' && (
                            <div className="space-y-4 p-2 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Resource Information</h3>
                                <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                                    This is an in-place change workflow. Both source and output resources are set to the current entity.
                                </p>

                                {/* Source = Output for In-place Change */}
                                <div className="space-y-2 p-3 bg-blue-100 dark:bg-blue-900 rounded border border-blue-200 dark:border-blue-800">
                                    <Label className="text-base font-semibold text-blue-900 dark:text-blue-100">Source & Output</Label>
                                    <div className="space-y-1">
                                        <div className="text-sm text-blue-900 dark:text-blue-100">
                                            <span className="font-medium">{entityType?.charAt(0).toUpperCase()}{entityType?.slice(1)}</span>
                                            {' '}{entityInfo?.name || 'Unknown'}
                                        </div>
                                        <div className="text-xs text-blue-700 dark:text-blue-300">
                                            Onedata File ID: <span className="font-mono">{entityInfo?.onedataId || entityId}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Workflow Configuration */}
                        {configurationItems.length > 0 ? (
                            <div className="space-y-6 p-2">
                                {configurationItems}
                            </div>
                        ) : (
                            <div className="space-y-4 p-2">
                                <h3 className="text-lg font-semibold">Workflow Configuration</h3>
                                <p className="text-sm text-muted-foreground">
                                    No additional configuration required for this workflow.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-4 sticky bottom-0 bg-background border-t mt-4 py-4">
                        <Button type="submit" className="w-full sm:w-auto">
                            Create Job
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
