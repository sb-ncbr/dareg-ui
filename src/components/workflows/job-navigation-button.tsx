"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TypographyH5 } from "@/components/typography/typography-h5";
import WorkflowSelect from "./workflow-select/workflow-select";
import { Workflow } from "./types/workflows";
import { Briefcase } from "lucide-react";

interface JobNavigationButtonProps {
    basePath: string; // e.g., "/datasets/123" or "/collections/456"
    showBrowseButton?: boolean;
    browseButtonText?: string;
    entityId?: string;
    entityType?: "project" | "dataset" | "experiment";
}

export default function JobNavigationButton({
    basePath,
    showBrowseButton = true,
    browseButtonText = "Browse Jobs",
    entityId,
    entityType,
}: JobNavigationButtonProps) {
    const router = useRouter();
    // WorkflowSelect will set the selected workflow in context and redirect when selection happens

    const handleBrowseJobs = () => {
        router.push(`${basePath}/jobs`);
    };

    return (
        <div className="flex items-center">
            <WorkflowSelect
                className="rounded-r-none focus-visible:border-ring focus-visible:ring-ring/50"
                redirectTo={`${basePath}/jobs`}
                entityId={entityId}
                entityType={entityType}
            />
            {showBrowseButton && (
                <Button
                    variant={"default"}
                    className="bg-lime-600 rounded-l-none flex items-center justify-between focus-visible:border-ring focus-visible:ring-ring/50"
                    onClick={handleBrowseJobs}
                >
                    <div className="flex items-center gap-2">
                        <Briefcase className="h-8 w-8" />
                        <TypographyH5 text={browseButtonText} />
                    </div>
                </Button>
            )}
        </div>
    );
}

