"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
} from "@/components/ui/resizable";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ChevronLeft,
    CircleCheck,
    Notebook,
    Play,
    Square,
    FileText,
    Settings,
    Trash,
    User,
    Users,
    Database,
    FolderInput,
    FolderOutput,
    AlertCircle,
    Calendar,
    Clock,
} from "lucide-react";
import { formatDate, formatDateTime } from "@/utils/date-formater";
import {
    useApiServiceGetApiV1Jobs,
    useApiServiceGetApiV1DatasetsById,
    useApiServiceGetApiV1UsersById,
    useApiServicePostApiV1Jobs,
    useApiServiceDeleteApiV1JobsById,
} from "../../../openapi/queries";
import { getContentTypeId } from "@/utils/content-type-mapper";
import { TypographyH3 } from "@/components/typography/typography-h3";
import { TypographyH4 } from "@/components/typography/typography-h4";
import BoundingBox from "@/components/bounding-box/bounding-box";
import { ExperimentInfoRow } from "@/components/experiment/experiment-info-row";
import { Job } from "../../../openapi/requests";
import { TypographyH5 } from "@/components/typography/typography-h5";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ImperativePanelHandle } from "react-resizable-panels";
import WorkflowFormGenerator from "./workflow-form-generator";
import { Workflow, Workflow as WorkflowType } from "./types/workflows";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import Loading from "@/app/loading";
import { useJobsWorkflowsContext } from "@/components/workflows/contexts/jobs-workflows-context";
import JobNavigationButton from "./job-navigation-button";

// Job details component with data fetching
function JobDetails({ job }: { job: Job }) {
    // Fetch root resource dataset if it exists
    const { data: rootDataset } = useApiServiceGetApiV1DatasetsById(
        { id: job.root_resource_id || "" },
        undefined,
        {
            enabled: Boolean(job.root_resource_id),
            retry: false,
        }
    );

    // Fetch output resource dataset if it exists
    const { data: outputDataset } = useApiServiceGetApiV1DatasetsById(
        { id: job.output_resource_id || "" },
        undefined,
        {
            enabled: Boolean(job.output_resource_id),
            retry: false,
        }
    );

    // Fetch created by user profile
    const { data: createdByUser } = useApiServiceGetApiV1UsersById(
        { id: Number(job.created_by) || 0 },
        undefined,
        {
            enabled: Boolean(job.created_by),
            retry: false,
        }
    );

    // Fetch modified by user profile
    const { data: modifiedByUser } = useApiServiceGetApiV1UsersById(
        { id: Number(job.modified_by) || 0 },
        undefined,
        {
            enabled: Boolean(job.modified_by),
            retry: false,
        }
    );

    const createdByName = createdByUser
        ? `${createdByUser.first_name || ''} ${createdByUser.last_name || ''}`.trim() || createdByUser.username || String(job.created_by)
        : job.created_by ? String(job.created_by) : "-";

    const modifiedByName = modifiedByUser
        ? `${modifiedByUser.first_name || ''} ${modifiedByUser.last_name || ''}`.trim() || modifiedByUser.username || String(job.modified_by)
        : job.modified_by ? String(job.modified_by) : "-";

    return (
        <div className="space-y-4">
            {/* Status and Description */}
            <ExperimentInfoRow
                title={"Status:"}
                icon={<CircleCheck />}
                value={job.status ?? "Unknown"}
            />

            <ExperimentInfoRow
                title={"Description:"}
                icon={<Notebook />}
                value={job.description ?? "No description"}
            />

            {/* Timestamps */}
            <TypographyH4 text="Timeline" />
            <div className="flex items-center gap-8">
                <ExperimentInfoRow
                    title={"Created:"}
                    icon={<Calendar />}
                    value={formatDateTime(job.created ?? "")}
                />
                <ExperimentInfoRow
                    title={"Modified:"}
                    icon={<Clock />}
                    value={formatDateTime(job.modified ?? "")}
                />
            </div>

            {job.start_time && (
                <ExperimentInfoRow
                    title={"Start Time:"}
                    icon={<Play />}
                    value={formatDateTime(job.start_time)}
                />
            )}

            {job.end_time && (
                <ExperimentInfoRow
                    title={"End Time:"}
                    icon={<Square />}
                    value={formatDateTime(job.end_time)}
                />
            )}

            {/* Users */}
            <TypographyH4 text="Users" />
            <ExperimentInfoRow
                title={"Created By:"}
                icon={<User />}
                value={createdByName}
            />
            <ExperimentInfoRow
                title={"Modified By:"}
                icon={<Users />}
                value={modifiedByName}
            />

            {/* Resources - 2x2 Grid */}
            <TypographyH4 text="Resources" />
            <div className="grid grid-cols-2 gap-4">
                <ExperimentInfoRow
                    title={"Workflow Template:"}
                    icon={<FileText />}
                    value={job.workflow_template || "-"}
                />
                <ExperimentInfoRow
                    title={"Log Level:"}
                    icon={<AlertCircle />}
                    value={job.log_level || "-"}
                />
                <ExperimentInfoRow
                    title={"Root Resource:"}
                    icon={<FolderInput />}
                    value={rootDataset?.name || job.root_resource_id || "-"}
                />
                <ExperimentInfoRow
                    title={"Output Resource:"}
                    icon={<FolderOutput />}
                    value={outputDataset?.name || job.output_resource_id || "-"}
                />
            </div>

            {/* App Config */}
            {job.app_config && (
                <>
                    <TypographyH4 text="Configuration" />
                    <div className="mb-2">
                        <ExperimentInfoRow
                            title={"App Config:"}
                            icon={<Settings />}
                            value={""}
                        />
                        <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto">
                            {JSON.stringify(job.app_config, null, 2)}
                        </pre>
                    </div>
                </>
            )}
        </div>
    );
}

// Job filter state interface
interface JobFilterState {
    dateRange: {
        from: Date | undefined;
        to: Date | undefined;
    };
    sortOrder: "asc" | "desc";
    search: string;
    status: "all" | "pending" | "running" | "completed" | "failed" | "cancelled";
}

// Simple job filter component
function JobFilter({
    filterState,
    basePath,
    onChange,
}: {
    filterState: JobFilterState;
    basePath: string;
    onChange: (filter: JobFilterState) => void;
}) {
    return (
        <div className="flex items-center gap-4 p-4  dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Search:</label>
                <input
                    type="text"
                    placeholder="Search jobs..."
                    value={filterState.search}
                    onChange={(e) => onChange({ ...filterState, search: e.target.value })}
                    className="px-3 py-1 border rounded-md text-sm"
                />
            </div>
            <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Status:</label>
                <Select
                    value={filterState.status}
                    onValueChange={(value) =>
                        onChange({
                            ...filterState,
                            status: value as JobFilterState["status"],
                        })
                    }
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="running">Running</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Sort:</label>
                <Select
                    value={filterState.sortOrder}
                    onValueChange={(value) =>
                        onChange({
                            ...filterState,
                            sortOrder: value as "asc" | "desc",
                        })
                    }
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select sort" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="asc">Oldest First</SelectItem>
                        <SelectItem value="desc">Newest First</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <JobNavigationButton
                basePath={basePath ?? ""}
                browseButtonText="Create New Job"
            />
        </div>
    );
}

// Job status component
function JobStatusDot({
    status,
    size = 32,
}: {
    status: string;
    size?: number;
}) {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "bg-yellow-500";
            case "running":
                return "bg-blue-500";
            case "completed":
                return "bg-green-500";
            case "failed":
                return "bg-red-500";
            case "cancelled":
                return "bg-gray-500";
            default:
                return "bg-gray-400";
        }
    };

    return (
        <div
            className={`rounded-full ${getStatusColor(status)}`}
            style={{ width: size, height: size }}
        />
    );
}

interface JobViewerProps {
    selectedWorkflowId?: string | null;
    basePath?: string;
}

export default function JobViewer({
    basePath,
}: JobViewerProps = {}) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const createJob = useApiServicePostApiV1Jobs();
    const deleteJob = useApiServiceDeleteApiV1JobsById();
    const jobsWorkflowsContext = useJobsWorkflowsContext();
    const [workflow, setWorkflow] = useState<Workflow | null>(jobsWorkflowsContext?.selectedWorkflow ?? null);
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const [filter, setFilter] = useState<JobFilterState>({
        dateRange: {
            from: undefined,
            to: undefined,
        },
        sortOrder: "asc",
        search: "",
        status: "all",
    });

    const [jobs, setJobs] = useState<Job[]>([]);
    const [collapsed, setCollapsed] = useState(false);
    const panelRef = useRef<ImperativePanelHandle>(null);

    // Sync workflow from context selection if available
    useEffect(() => {
        const ctxWf = jobsWorkflowsContext?.selectedWorkflow as any;
        if (ctxWf) {
            setWorkflow({
                id: ctxWf.id,
                name: ctxWf.name ?? ctxWf.name,
                description: ctxWf.description ?? ctxWf.description,
                workflowType: (ctxWf.workflowType ?? ctxWf.workflow_type ?? "Readonly") as any,
                appConfigDetails: ctxWf.appConfigDetails ?? ctxWf.input_params ?? {},
                created: ctxWf.created,
                modified: ctxWf.modified,
            } as any);
        }
    }, [jobsWorkflowsContext?.selectedWorkflow]);

    // Create a draft job when workflow is selected
    useEffect(() => {
        const sourceJobs: Job[] | undefined =
            jobsWorkflowsContext?.jobs;
        if (workflow) {
            const draftJob: Job = {
                id: "draft-" + workflow.id,
                name: `draft - ${workflow.name} - ${new Date().toLocaleDateString("cs-CZ")}`,
                description: "",
                workflow_template: workflow.id,
                status: "draft",
                created: new Date().toISOString(),
                modified: new Date().toISOString(),
                created_by: null,
                modified_by: null,
                start_time: null,
                end_time: null,
            };

            // Add draft job at the beginning of the jobs list
            const updatedJobs: Job[] = [draftJob, ...(sourceJobs || [])];
            setJobs(updatedJobs);
            setSelectedJobId("draft-" + workflow.id);
        } else if (sourceJobs && jobs.length === 0) {
            // Only reset jobs from context if we don't have any jobs yet
            setJobs(sourceJobs);
            if (!selectedJobId && sourceJobs.length > 0) {
                setSelectedJobId(sourceJobs[0].id);
            }
        }
    }, [jobsWorkflowsContext?.jobs, workflow]);

    const selectedJob = jobs.find((job: Job) => job.id === selectedJobId);

    const filteredJobs = jobs
        .filter((job) => {
            // Always include draft jobs
            if (job.id.startsWith("draft-")) return true;

            const jobDate = new Date(job?.created ?? "");
            const from = filter.dateRange.from
                ? new Date(filter.dateRange.from)
                : null;
            const to = filter.dateRange.to ? new Date(filter.dateRange.to) : null;

            if (from && jobDate < from) return false;
            if (to && jobDate > to) return false;
            if (
                filter.status !== "all" &&
                job.status !== filter.status &&
                !job.id.startsWith("draft-")
            )
                return false;
            if (
                filter.search &&
                !job?.name?.toLowerCase().includes(filter.search.toLowerCase())
            )
                return false;
            return true;
        })
        .sort((a, b) => {
            const aTime = new Date(a.created ?? "").getTime();
            const bTime = new Date(b.created ?? "").getTime();
            return filter.sortOrder === "asc" ? aTime - bTime : bTime - aTime;
        });

    const togglePanel = () => {
        if (panelRef.current) {
            if (collapsed) {
                panelRef.current.expand();
            } else {
                panelRef.current.collapse();
            }
            setCollapsed(!collapsed);
        }
    };

    // create button no longer triggers local draft creation; selection in WorkflowSelect now drives draft add

    return (
        <div className="flex flex-col h-screen">
            <div className="flex items-center mb-4">
                <JobFilter filterState={filter} onChange={setFilter} basePath={basePath ?? ""}
                />

            </div>
            <ResizablePanelGroup direction="horizontal" className="grow duration-300 animate-in fade-in-80">
                <ResizablePanel
                    ref={panelRef}
                    defaultSize={20}
                    minSize={5}
                    maxSize={40}
                    collapsible={true}
                    collapsedSize={9}
                    className={`py-6 px-2 border-r transition-all duration-300`}
                >
                    <div className="h-full flex flex-col gap-4 duration-300 animate-in fade-in-80">
                        <div
                            className={`flex items-center ${collapsed ? "justify-center" : "justify-between"
                                }`}
                        >
                            {!collapsed && <TypographyH3 text={"Jobs:"} />}

                            <Button
                                variant="ghost"
                                size="icon"
                                className={collapsed ? "mr-4" : "ml-auto"}
                                onClick={togglePanel}
                                aria-label={collapsed ? "Expand panel" : "Collapse panel"}
                            >
                                <span
                                    className={`transition-transform duration-300  ${collapsed ? "rotate-180" : "rotate-0"
                                        }`}
                                    style={{ display: "inline-block" }}
                                >
                                    <ChevronLeft />
                                </span>
                            </Button>
                        </div>
                        <div
                            className={`h-full flex flex-col gap-2 overflow-y-auto ${collapsed ? "items-center px-0" : ""
                                }`}
                        >
                            {filteredJobs.length > 0 ? (
                                collapsed ? (
                                    <TooltipProvider>
                                        <div className="flex flex-col py-2 gap-2 items-center">
                                            {filteredJobs.map((job: Job) => (
                                                <Tooltip key={job.id}>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant={
                                                                selectedJobId === job.id ? "default" : "outline"
                                                            }
                                                            size="icon"
                                                            className={`flex flex-col items-center justify-center w-12 h-16 p-0 rounded-lg ${selectedJobId === job.id
                                                                ? "ring-2 ring-primary"
                                                                : ""
                                                                }`}
                                                            style={{ minWidth: 48, minHeight: 56 }}
                                                            onClick={() => setSelectedJobId(job.id)}
                                                        >
                                                            <JobStatusDot status={job.status} size={32} />
                                                            <span className="text-xs font-semibold mt-1 my-2 mb-2">
                                                                {job.name?.slice(0, 3) ?? "???"}
                                                            </span>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="right" className="max-w-xs">
                                                        <div className="flex flex-col gap-1 ">
                                                            <span className="font-semibold text-sm">
                                                                {job.status}
                                                            </span>
                                                            <span className="text-xs break-all text-white">
                                                                {job.name}
                                                            </span>
                                                            <span className="text-xs text-white">
                                                                {formatDate(job.created)}
                                                            </span>
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            ))}
                                        </div>
                                    </TooltipProvider>
                                ) : (
                                    filteredJobs.map((job: Job) => (
                                        <div
                                            key={job.id}
                                            className={`flex items-center gap-6 w-full p-4 rounded-lg border cursor-pointer transition-colors ${selectedJobId === job.id
                                                ? 'bg-primary text-primary-foreground border-primary'
                                                : 'bg-background border-input hover:bg-accent hover:text-accent-foreground'
                                                }`}
                                            onClick={() => setSelectedJobId(job.id)}
                                        >
                                            <div className="flex items-center gap-2 flex-1">
                                                <JobStatusDot status={job.status} size={15} />
                                                <TypographyH5 text={job.name} />
                                            </div>
                                            <TypographyH5
                                                text={formatDate(job.created)}
                                                variant="ghost"
                                            />
                                            {!job.id.startsWith('draft-') && (
                                                <Button
                                                    variant="outline"
                                                    size={"icon"}
                                                    className="shrink-0"
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        if (confirm(`Are you sure you want to delete "${job.name}"?`)) {
                                                            try {
                                                                await deleteJob.mutateAsync({ id: job.id });
                                                                // Remove from local state
                                                                setJobs((prev) => prev.filter((j) => j.id !== job.id));
                                                                if (selectedJobId === job.id) {
                                                                    const remainingJobs = jobs.filter((j) => j.id !== job.id);
                                                                    setSelectedJobId(remainingJobs[0]?.id || null);
                                                                }
                                                                toast.success('Job deleted successfully');
                                                            } catch (error: any) {
                                                                console.error('Error deleting job:', error);
                                                                // Check if it's a CORS error but the request was actually successful
                                                                if (error?.code === 'ERR_NETWORK' || error?.message === 'Network Error') {
                                                                    toast.warning('Job may have been deleted, but confirmation was blocked by CORS. Refreshing...');
                                                                    // Still remove from local state as it's likely deleted on backend
                                                                    setJobs((prev) => prev.filter((j) => j.id !== job.id));
                                                                    if (selectedJobId === job.id) {
                                                                        const remainingJobs = jobs.filter((j) => j.id !== job.id);
                                                                        setSelectedJobId(remainingJobs[0]?.id || null);
                                                                    }
                                                                } else {
                                                                    toast.error('Failed to delete job');
                                                                }
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <Trash className="text-black" />
                                                </Button>
                                            )}
                                        </div>
                                    ))
                                )
                            ) : (
                                !collapsed && (
                                    <div className="text-xs text-muted-foreground">
                                        No jobs found.
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={30} minSize={40} className="px-8 duration-300 animate-in fade-in-80">
                    <BoundingBox>
                        <div className="h-full flex flex-col gap-4 duration-300 animate-in fade-in-80">
                            {workflow ? (
                                <>
                                    <div className="flex gap-4">
                                        <TypographyH3 text={"Create New Job:"}></TypographyH3>
                                        <TypographyH3 text={workflow.name} variant="ghost" />
                                        <Button
                                            className="ml-auto mr-2"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                                setJobs(
                                                    jobs.filter(
                                                        (job) => job.id !== `draft-${workflow.id}`
                                                    )
                                                );
                                                setWorkflow(null);
                                                setSelectedJobId(jobs[1].id ?? null);
                                            }}
                                        >
                                            <Trash />
                                        </Button>
                                    </div>
                                    <div className="grow overflow-y-auto pr-2 ">
                                        <WorkflowFormGenerator
                                            workflow={workflow}
                                            entityId={jobsWorkflowsContext?.entityId}
                                            entityType={jobsWorkflowsContext?.entityType}
                                            onSubmit={async (formData) => {
                                                try {
                                                    console.log('Submitting form data:', formData);

                                                    // Get content type ID from entity type
                                                    const contentTypeId = getContentTypeId(jobsWorkflowsContext?.entityType);

                                                    if (!contentTypeId) {
                                                        throw new Error('Invalid entity type for content type mapping');
                                                    }

                                                    // Extract job name, description, resource selections, and filter out metadata fields
                                                    const {
                                                        jobName,
                                                        jobDescription,
                                                        appConfigDetails,
                                                        rootResourceId,
                                                        outputResourceId,
                                                        rootResourceOnedataId,
                                                        outputResourceOnedataId,
                                                        rootResourceContentType,
                                                        outputResourceContentType,
                                                        ...appConfigData
                                                    } = formData;

                                                    // Use appConfigDetails if it exists, otherwise use the rest of formData
                                                    const finalAppConfig = appConfigDetails || appConfigData;

                                                    console.log('Extracted app config data:', finalAppConfig);
                                                    console.log('Job name:', jobName);
                                                    console.log('Job description:', jobDescription);
                                                    console.log('Workflow type:', workflow?.workflowType);
                                                    console.log('Root resource onedata ID:', rootResourceOnedataId);
                                                    console.log('Output resource onedata ID:', outputResourceOnedataId);

                                                    // Get current entity's onedata ID
                                                    const currentEntityOnedataId = jobsWorkflowsContext?.entityType === 'project'
                                                        ? (jobsWorkflowsContext as any)?.entity?.onedata_space_id
                                                        : (jobsWorkflowsContext as any)?.entity?.onedata_file_id;

                                                    // Determine root and output resource IDs based on workflow type
                                                    let finalRootResourceId: string;
                                                    let finalOutputResourceId: string;
                                                    let finalRootContentType: number;
                                                    let finalOutputContentType: number;

                                                    if (workflow?.workflowType === 'In-placeChange') {
                                                        // IN_PLACE_CHANGE: Both resources use current entity's onedata ID
                                                        finalRootResourceId = currentEntityOnedataId || jobsWorkflowsContext?.entityId || '';
                                                        finalOutputResourceId = currentEntityOnedataId || jobsWorkflowsContext?.entityId || '';
                                                        finalRootContentType = contentTypeId;
                                                        finalOutputContentType = contentTypeId;
                                                    } else if (workflow?.workflowType === 'WriteData') {
                                                        // WRITE_DATA: Use selected onedata IDs from form, or default to current entity
                                                        finalRootResourceId = (rootResourceOnedataId as string) || currentEntityOnedataId || jobsWorkflowsContext?.entityId || '';
                                                        finalOutputResourceId = (outputResourceOnedataId as string) || currentEntityOnedataId || jobsWorkflowsContext?.entityId || '';
                                                        finalRootContentType = (rootResourceContentType as number) || contentTypeId;
                                                        finalOutputContentType = (outputResourceContentType as number) || contentTypeId;
                                                    } else {
                                                        // READONLY, EXPORT, or other: Default to current entity's onedata ID
                                                        finalRootResourceId = currentEntityOnedataId || jobsWorkflowsContext?.entityId || '';
                                                        finalOutputResourceId = currentEntityOnedataId || jobsWorkflowsContext?.entityId || '';
                                                        finalRootContentType = contentTypeId;
                                                        finalOutputContentType = contentTypeId;
                                                    }

                                                    // Build the job request according to API schema
                                                    const jobRequest = {
                                                        requestBody: {
                                                            workflow_template: workflow?.id || '',
                                                            root_resource_content_type: finalRootContentType,
                                                            root_resource_id: finalRootResourceId,
                                                            output_resource_content_type: finalOutputContentType,
                                                            output_resource_id: finalOutputResourceId,
                                                            name: (jobName as string) || 'Untitled Job',
                                                            description: (jobDescription as string) || '',
                                                            app_config: finalAppConfig,
                                                            log_level: 'debug' as const
                                                        } as Job
                                                    };

                                                    console.log('Job request payload:', jobRequest);

                                                    const response = await createJob.mutateAsync(jobRequest);

                                                    // Update jobs state: remove draft and add new job
                                                    setJobs((prev) => {
                                                        const withoutDraft = prev.filter(
                                                            (job) => job.id !== `draft-${workflow?.id}`
                                                        );
                                                        return [response, ...withoutDraft];
                                                    });

                                                    // Switch to the newly created job
                                                    setSelectedJobId(response.id);

                                                    // Clear the workflow to exit creation mode
                                                    setWorkflow(null);

                                                    toast.success('Job created successfully');
                                                } catch (error) {
                                                    console.error("Error creating job:", error);
                                                    toast.error('Failed to create job');
                                                }
                                            }}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex gap-4">
                                        <TypographyH3 text={"Job Details:"}></TypographyH3>
                                        <TypographyH3
                                            text={selectedJob?.name ?? ""}
                                            variant="ghost"
                                        />
                                    </div>
                                    <div className="grow overflow-y-auto pr-2">
                                        {selectedJob ? (
                                            <JobDetails job={selectedJob} />
                                        ) : (
                                            <span className="text-muted-foreground">
                                                Select a job to see details.
                                            </span>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </BoundingBox>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
