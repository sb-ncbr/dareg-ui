"use client";

import { useParams, useRouter } from "next/navigation";
import { TypographyH2 } from "@/components/typography/typography-h2";
import { TypographyH2Ghost } from "@/components/typography/typography-h2-ghost";
import { TypographyH3 } from "@/components/typography/typography-h3";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Settings, Briefcase } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import WorkflowFormGenerator from "@/components/workflows/workflow-form-generator";
import Loading from "../../../loading";
import { useApiServiceGetApiV1DatasetsById } from "../../../../../../openapi/queries";
import BoundingBox from "@/components/bounding-box/bounding-box";
import { Workflow } from "@/components/workflows/types/workflows";
import { useApiServiceGetApiV1WorkflowByEntity } from "../../../../../../openapi/queries";
import { useApiServicePostApiV1Jobs } from "../../../../../../openapi/queries";
import { toast } from "react-toastify";

export default function DatasetJobsPage() {
    const { id, jobId } = useParams();
    const router = useRouter();

    const { data: dataset, isLoading } = useApiServiceGetApiV1DatasetsById({
        id: id as string,
    });

    const createJob = useApiServicePostApiV1Jobs();
    const { data: workflows, isLoading: isWfLoading } = useApiServiceGetApiV1WorkflowByEntity({ entity_id: id as string, entity_type: "dataset" }, undefined, { enabled: Boolean(id) });
    const workflow = (workflows as any[] | undefined)?.find((w) => w.id === jobId) as any as Workflow | undefined;

    if (isLoading) {
        return <Loading />;
    }

    if (!dataset) {
        return <div>Dataset not found.</div>;
    }
    if (isWfLoading) return <Loading />;
    if (!workflow) return <div>Workflow not found.</div>;

    const handleSubmit = async (formData: any) => {
        try {
            const { jobName, jobDescription, ...appConfig } = formData;
            const jobData = {
                name: jobName,
                description: jobDescription || "",
                workflow_template: workflow.id,
                app_config: appConfig,
            };

            await createJob.mutateAsync({
                requestBody: jobData as any, // Type assertion needed as API expects full Job but server will fill readonly fields
            });
            toast.success("Job created successfully!");
            router.push(`/datasets/${id}/jobs`);
        } catch (error) {
            toast.error("Failed to create job. Please try again.");
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <div>
                <Breadcrumbs detailName={dataset.name} />
            </div>
            <div className="w-full flex items-center max-w-full mb-6">
                <div className="flex items-center space-x-4">
                    <ChevronLeft
                        onClick={() => router.push(`/datasets/${id}/jobs`)}
                        className="h-10 w-10 hover:bg-zinc-100 rounded-xl dark:hover:bg-zinc-800 cursor-pointer"
                    />
                    <div className="flex items-center gap-4">
                        <TypographyH2 text="Create New Job: " />
                        <TypographyH2Ghost text={workflow.name} />
                    </div>
                </div>
                <div className="h-10 w-10 hover:bg-zinc-100 rounded-xl dark:hover:bg-zinc-800 cursor-pointer flex items-center justify-center ml-40">
                    <Settings
                        className="h-8 w-8"
                        onClick={() => {
                            router.push(`/datasets/${id}/settings`);
                        }}
                    />
                </div>
            </div>
            <BoundingBox>
                <div className="p-6">
                    <WorkflowFormGenerator
                        workflow={workflow as Workflow}
                        entityId={id as string}
                        entityType="dataset"
                        onSubmit={handleSubmit}
                    />
                </div>
            </BoundingBox>
        </div>
    );
}

