"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { TypographyH2 } from "@/components/typography/typography-h2";
import { TypographyH2Ghost } from "@/components/typography/typography-h2-ghost";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Settings } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import JobViewer from "@/components/workflows/job-viewer";
import { useApiServiceGetApiV1ProjectsById } from "../../../../../openapi/queries";
import Loading from "../../loading";


export default function CollectionJobsPage() {
    const { id } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const workflowId = searchParams?.get('workflow');

    const { data: project, isLoading } = useApiServiceGetApiV1ProjectsById({
        id: id as string,
    });

    if (isLoading) {
        return <Loading />;
    }

    if (!project) {
        return <div>Collection not found.</div>;
    }

    return (
        <div className="flex flex-col h-screen">
            <div>
                <Breadcrumbs detailName={project.name ?? ""} />
            </div>
            <div className="w-full flex items-center max-w-full mb-6">
                <div className="flex items-center space-x-4">
                    <ChevronLeft
                        onClick={() => router.push(`/collections/${id}`)}
                        className="h-10 w-10 hover:bg-zinc-100 rounded-xl dark:hover:bg-zinc-800 cursor-pointer"
                    />
                    <div className="flex items-center gap-4">
                        <TypographyH2 text="Jobs for Collection: " />
                        <TypographyH2Ghost text={project.name ?? ""} />
                    </div>
                </div>
                <div className="h-10 w-10 hover:bg-zinc-100 rounded-xl dark:hover:bg-zinc-800 cursor-pointer flex items-center justify-center ml-40">
                    <Settings
                        className="h-8 w-8"
                        onClick={() => {
                            router.push(`/collections/${id}/settings`);
                        }}
                    />
                </div>
            </div>
            <div className="grow">
                <JobViewer selectedWorkflowId={workflowId} basePath={`/collections/${id}`} />
            </div>
        </div>
    );
}

