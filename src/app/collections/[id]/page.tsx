"use client";
import React, { useEffect, useState } from "react";
import { CircularProgress, TextField } from "@mui/material";
import {
  useApiServiceGetApiV1Datasets,
  useApiServiceGetApiV1ProjectsById,
  useApiServicePatchApiV1ProjectsById,
} from "../../../../openapi/queries";
import { useParams, useRouter } from "next/navigation";
import { TypographyH2 } from "@/components/typography/typography-h2";
import { DynamicDataTable } from "@/components/dynamic_table/dynamic-data-table";
import { TypographyH3 } from "@/components/typography/typography-h3";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Settings } from "lucide-react";
import { ProjectsData } from "@/types/global";
import { SkeletonTable } from "@/components/dynamic_table/skeleton-table";
import { TypographyH2Ghost } from "@/components/typography/typography-h2-ghost";
import { ToastContainer, toast } from "react-toastify";
import { Breadcrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import BoundingBox from "@/components/bounding-box/bounding-box";
import { datasetColumns } from "@/components/dynamic_table/columns/dataset-columns";
import Loading from "../loading";

export type ProjectShare = {
  id: number;
  name: string;
  perms: string;
  last_login: string;
};

const ProjectDetails: React.FC = () => {
  const { id } = useParams();
  const {
    data: project,
    isLoading,
    error,
  } = useApiServiceGetApiV1ProjectsById({
    id: id as string,
  }) as { data?: ProjectsData; isLoading: boolean; error: any };

  const { data: datasets } = useApiServiceGetApiV1Datasets({
    project: id as string,
  });

  const [originalName, setOriginalName] = useState<string>(project?.name || "");
  const [originalDescription, setOriginalDescription] = useState<string>(
    project?.description || ""
  );

  const [name, setName] = useState<string>(project?.name || "");
  const [description, setDescription] = useState<string>(
    project?.description || ""
  );

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description);
      setOriginalName(project.name);
      setOriginalDescription(project.description);
    }
  }, [project]);

  const [isEditing, setIsEditing] = useState<{
    name: boolean;
    description: boolean;
  }>({
    name: false,
    description: false,
  });
  const [hasChanges, setHasChanges] = useState(false);

  const [pageIndex, setPageIndex] = useState(0);

  const patchProject = useApiServicePatchApiV1ProjectsById();
  const router = useRouter();

  const handleDoubleClick = (field: "name" | "description") => {
    setIsEditing((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (field: "name" | "description", value: string) => {
    if (field === "name") setName(value);
    if (field === "description") setDescription(value);
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      const updatedFields: { name?: string; description?: string } = {};
      if (name !== project?.name) updatedFields.name = name;
      if (description !== project?.description)
        updatedFields.description = description;

      if (Object.keys(updatedFields).length === 0) {
        toast.warning("No changes to save.");
        return;
      }

      await patchProject.mutateAsync({
        id: id as string,
        requestBody: updatedFields,
      });

      setOriginalName(name);
      setOriginalDescription(description);

      setHasChanges(false);
      setIsEditing({ name: false, description: false });
      toast.success("Project updated successfully!");
    } catch (error: any) {
      toast.error(
        "Failed to update project. Please try again. Error: \r\n" +
          error.message
      );
    }
  };

  const handleRevert = () => {
    setName(originalName);
    setDescription(originalDescription);
    setHasChanges(false);
    setIsEditing({ name: false, description: false });
  };

  const projectDataCount = datasets?.count || 0;
  const pageCount = Math.ceil(projectDataCount / 10) || 0;
  const dataToUse = datasets || {};

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error loading project details. Please try again later.</div>;
  }

  if (!project) {
    return <div>No project found.</div>;
  }

  return (
    <div>
      <Breadcrumbs detailName={project.name ?? ""} />
      <div className="flex items-center space-x-4">
        <ChevronLeft
          onClick={() => router.push(`/collections`)}
          className="h-10 w-10 hover:bg-zinc-100 rounded-xl dark:hover:bg-zinc-800 cursor-pointer"
        />
        <div className="flex items-center gap-4">
          <TypographyH2 text="Collection Details: " />
          {project?.name && <TypographyH2Ghost text={project.name} />}
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
      <BoundingBox>
        <div className="mb-10">
          <TextField
            label="Name"
            value={name}
            onChange={(e) => handleChange("name", e.target.value)}
            onClick={() => handleDoubleClick("name")}
            InputProps={{
              readOnly: !isEditing.name,
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => handleChange("description", e.target.value)}
            onClick={() => handleDoubleClick("description")}
            InputProps={{
              readOnly: !isEditing.description,
            }}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
        </div>

        <TypographyH3 text="Collection Datasets" />
        <div className="pl-8">
          <div className="w-full max-w-full overflow-x-auto">
            <div className="min-w-[600px] max-w-[120%]">
              {datasets?.results ? (
                <DynamicDataTable
                  columns={datasetColumns}
                  data={dataToUse.results || []}
                  pageIndex={pageIndex}
                  pageCount={pageCount}
                  onPageChange={setPageIndex}
                />
              ) : (
                <SkeletonTable />
              )}
            </div>
          </div>
        </div>
      </BoundingBox>

      {hasChanges && (
        <div className="fixed bottom-4 right-4 flex space-x-4">
          <Button
            variant="destructive"
            size="xl"
            onClick={handleRevert}
            disabled={patchProject.isPending}
          >
            Revert Changes
          </Button>
          <Button
            variant="default"
            size="xl"
            onClick={handleSave}
            disabled={patchProject.isPending}
          >
            {patchProject.isPending ? (
              <>
                <span className="animate-pulse ml-1">...</span>
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ProjectDetails;
