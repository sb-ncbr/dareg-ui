"use client";

import { JobsWorkflowsProvider } from "@/components/workflows/contexts/jobs-workflows-context";
import { useParams } from "next/navigation";

export default function CollectionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { id } = useParams();

    return (
        <JobsWorkflowsProvider entityId={id as string} entityType="project">
            {children}
        </JobsWorkflowsProvider>
    );
}