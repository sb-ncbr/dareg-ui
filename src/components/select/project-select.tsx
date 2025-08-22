"use client";
import { useApiServiceGetApiV1Projects } from "../../../openapi/queries";
import { ApiService, ProjectResponse } from "../../../openapi/requests";
import { Skeleton } from "../ui/skeleton";
import { ReusableSelect } from "./common/reusable-select";

type ProjectSelectSSRProps = {
  value?: string | null;
  onChange?: (project: ProjectResponse) => void;
};

export default function ProjectSelectSSR({
  value,
  onChange,
}: ProjectSelectSSRProps) {
  const { data: projects, isLoading } = useApiServiceGetApiV1Projects({
    page: 1,
  });

  if (isLoading || !projects) {
    return <Skeleton className="h-10 w-[200px]" />;
  }

  return (
    <ReusableSelect<ProjectResponse>
      items={projects?.results ?? []}
      getItemLabel={(p) => p.name}
      getItemId={(p) => p.id}
      placeholder="Select a project"
      value={value}
      onChange={onChange}
    />
  );
}
