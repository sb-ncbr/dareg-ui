"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Workflow, WorkflowTypeEnum } from "../types/workflows";
import { cn } from "@/lib/utils";
import { useJobsWorkflowsContext } from "@/components/workflows/contexts/jobs-workflows-context";

interface WorkflowSelectProps {
    value?: string;
    onChange?: (workflow: Workflow) => void;
    className?: string;
    placeholder?: string;
    redirectTo?: string;
    disabled?: boolean;
    entityId?: string;
    entityType?: "project" | "dataset" | "experiment";
}

// No mock workflows; data comes from context/API

function WorkflowSelectSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-full" />
        </div>
    );
}

export default function WorkflowSelect({
    value,
    onChange,
    className,
    redirectTo,
    placeholder = "Job templates ...",
    disabled = false,
    entityId,
    entityType,
}: WorkflowSelectProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const jobsWorkflowsContext = useJobsWorkflowsContext();

    const availableWorkflows: Workflow[] = useMemo(() => {
        if (jobsWorkflowsContext?.workflows?.length) {
            // Map API WorkflowTemplate to UI Workflow type shape minimally
            return jobsWorkflowsContext.workflows.map((w: any) => ({
                id: w.id,
                name: w.name,
                description: w.description,
                workflowType: (w.workflow_type ?? "Readonly") as WorkflowTypeEnum,
                appConfigDetails: (w.input_params ?? {}) as any,
                created: w.created,
                modified: w.modified,
            }));
        }
        return [];
    }, [jobsWorkflowsContext?.workflows]);

    // selected value prefers context selection, fall back to prop
    const selectedValue = jobsWorkflowsContext?.selectedWorkflow?.id ?? value;

    const selectedWorkflow = useMemo(
        () => availableWorkflows.find((workflow) => workflow.id === selectedValue),
        [availableWorkflows, selectedValue]
    );

    const handleWorkflowSelect = async (selectedWorkflow: Workflow) => {
        if (!selectedWorkflow) return;

        setIsLoading(true);

        // set the selected workflow in the provider
        if (jobsWorkflowsContext) {
            jobsWorkflowsContext.setSelectedWorkflow(selectedWorkflow);
        }

        // call onChange if provided
        try {
            if (onChange) {
                onChange(selectedWorkflow);
            } else {
                // fallback: navigate to redirect if provided
                if (redirectTo) router.push(redirectTo);
            }
        } catch (error) {
            console.error('Error handling workflow select:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <WorkflowSelectSkeleton className={className} />;
    }

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <Select
                value={selectedValue}
                onValueChange={(workflowId) => {
                    const selectedWorkflow = availableWorkflows.find((w) => w.id === workflowId);
                    if (selectedWorkflow) {
                        handleWorkflowSelect(selectedWorkflow);
                    }
                }}
                onOpenChange={(open) => {
                    setIsDropdownOpen(open);
                    if (open) {
                        if (jobsWorkflowsContext && (entityId || entityType)) {
                            jobsWorkflowsContext.setEntity({ entityId, entityType });
                        }
                        console.log('entityId', entityId);
                        console.log('entityType', entityType);
                        console.log('jobsWorkflowsContext', jobsWorkflowsContext?.workflows);
                        console.log("workflow context", jobsWorkflowsContext);
                        jobsWorkflowsContext?.triggerWorkflowsFetch();
                    }
                }}
                disabled={disabled}
            >
                <SelectTrigger className="h-14 w-full rounded-r-none ">
                    <SelectValue placeholder={placeholder}>
                        {selectedWorkflow ? (
                            <span className="text-foreground font-semibold">{selectedWorkflow.name}</span>
                        ) : (
                            <span className="text-muted-foreground">{placeholder}</span>
                        )}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-[700px] duration-300 animate-in fade-in-80">
                    {isDropdownOpen && jobsWorkflowsContext?.isLoadingWorkflows ? (
                        <div className="p-4 space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            ))}
                        </div>
                    ) : availableWorkflows.length > 0 ? (
                        availableWorkflows.map((workflow) => (
                            <SelectItem
                                key={workflow.id}
                                value={workflow.id}
                                className="py-4 px-4 cursor-pointer duration-300 animate-in fade-in-80"
                            >
                                <div className="flex flex-col gap-1 w-full">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-base">
                                            {workflow.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                            {workflow.workflowType}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {workflow.description}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span>Created: {new Date(workflow.created).toLocaleDateString()}</span>
                                        <span>Modified: {new Date(workflow.modified).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </SelectItem>
                        ))
                    ) : (
                        <div className="p-4 text-sm text-muted-foreground text-center">
                            No workflows available
                        </div>
                    )}
                </SelectContent>
            </Select>
        </div>
    );
}
