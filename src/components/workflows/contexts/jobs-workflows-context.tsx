"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { WorkflowTemplate, Job } from "../../../../openapi/requests/types.gen";
import { useApiServiceGetApiV1WorkflowByEntity, useApiServiceGetApiV1JobsByEntity } from "../../../../openapi/queries";
import { Workflow } from "../types/workflows";

type EntityType = "project" | "dataset" | "experiment";

interface JobsWorkflowsContextValue {
    entityId?: string;
    entityType?: EntityType;
    workflows: Workflow[];
    jobs: Job[];
    selectedWorkflow?: Workflow | null;
    setSelectedWorkflow: (wf: Workflow | null) => void;
    /** Convenience: set selected workflow by id. Will trigger workflows fetch if needed and resolve when available. */
    setSelectedWorkflowById: (id: string | null) => void;
    triggerWorkflowsFetch: () => void;
    setEntity: (params: { entityId?: string; entityType?: EntityType }) => void;
    isLoadingWorkflows: boolean;
}

const JobsWorkflowsContext = createContext<JobsWorkflowsContextValue | undefined>(undefined);

export function JobsWorkflowsProvider({ entityId, entityType, children }: { entityId?: string; entityType?: EntityType; children: React.ReactNode; }) {
    const [workflowsFetchEnabled, setWorkflowsFetchEnabled] = useState(false);
    const [currentEntityId, setCurrentEntityId] = useState<string | undefined>(entityId);
    const [currentEntityType, setCurrentEntityType] = useState<EntityType | undefined>(entityType);

    const { data: workflowsResp, isLoading: isLoadingWorkflows } = useApiServiceGetApiV1WorkflowByEntity(
        currentEntityId && currentEntityType ? { entity_id: currentEntityId, entity_type: currentEntityType } : { entity_id: "", entity_type: "project" as EntityType },
        undefined,
        { enabled: Boolean(currentEntityId && currentEntityType && workflowsFetchEnabled) }
    );

    const { data: jobsResp } = useApiServiceGetApiV1JobsByEntity(
        currentEntityId ? { entity_id: currentEntityId } : { entity_id: "" },
        undefined,
        { enabled: Boolean(currentEntityId) }
    );

    const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
    // store a pending id if someone wants selection by id before workflowsResp arrives
    const [pendingSelectedWorkflowId, setPendingSelectedWorkflowId] = useState<string | null>(null);

    // When workflowsResp arrives, resolve any pending selected workflow id
    useEffect(() => {
        if (!workflowsResp || !pendingSelectedWorkflowId) return;
        const list = (workflowsResp as Workflow[]) || [];
        const found = list.find((w) => w.id === pendingSelectedWorkflowId);
        if (found) {
            setSelectedWorkflow(found);
            setPendingSelectedWorkflowId(null);
        }
    }, [workflowsResp, pendingSelectedWorkflowId]);

    const value = useMemo<JobsWorkflowsContextValue>(() => ({
        entityId: currentEntityId,
        entityType: currentEntityType,
        workflows: (workflowsResp as Workflow[]) || [],
        jobs: (jobsResp as Job[]) || [],
        selectedWorkflow,
        setSelectedWorkflow,
        setSelectedWorkflowById: (id: string | null) => {
            if (!id) {
                setPendingSelectedWorkflowId(null);
                setSelectedWorkflow(null);
                return;
            }
            // If workflows are already loaded, try to resolve immediately
            const list = (workflowsResp as Workflow[] | undefined) || [];
            const found = list.find((w) => w.id === id);
            if (found) {
                setSelectedWorkflow(found);
                setPendingSelectedWorkflowId(null);
                return;
            }
            // otherwise set pending and trigger fetch
            setPendingSelectedWorkflowId(id);
            setWorkflowsFetchEnabled(true);
        },
        triggerWorkflowsFetch: () => setWorkflowsFetchEnabled(true),
        setEntity: ({ entityId, entityType }) => {
            if (entityId !== undefined) setCurrentEntityId(entityId);
            if (entityType !== undefined) setCurrentEntityType(entityType);
        },
        isLoadingWorkflows,
    }), [currentEntityId, currentEntityType, workflowsResp, jobsResp, selectedWorkflow, pendingSelectedWorkflowId, isLoadingWorkflows]);

    return (
        <JobsWorkflowsContext.Provider value={value}>{children}</JobsWorkflowsContext.Provider>
    );
}

export function useJobsWorkflowsContext(): JobsWorkflowsContextValue | undefined {
    const ctx = useContext(JobsWorkflowsContext);
    if (!ctx) {
        // Make the developer error explicit to help debugging provider boundaries
        throw new Error("useJobsWorkflowsContext must be used within a JobsWorkflowsProvider");
    }
    return ctx;
}


