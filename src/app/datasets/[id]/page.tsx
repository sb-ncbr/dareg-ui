"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CircularProgress, InputAdornment, TextField } from "@mui/material";
import { TypographyH2 } from "@/components/typography/typography-h2";
import { TypographyH3 } from "@/components/typography/typography-h3";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import {
  ChevronLeft,
  ClipboardCopy,
  FlaskConical,
  Settings,
  TestTubeDiagonal,
} from "lucide-react";
import {
  useApiServiceDeleteApiV1ProjectsById,
  useApiServiceGetApiV1DatasetsById,
  useApiServiceGetApiV1ProjectsById,
  useApiServiceGetApiV1SchemasById,
  useApiServicePatchApiV1DatasetsById,
} from "../../../../openapi/queries";
import { z, ZodTypeAny, ZodString } from "zod";
import { SkeletonTable } from "@/components/dynamic_table/skeleton-table";
import { TypographyH2Ghost } from "@/components/typography/typography-h2-ghost";
import FormsWrapped from "@/components/forms/form-wraper/forms-wraped";
import { Breadcrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import BoundingBox from "@/components/bounding-box/bounding-box";
import { formatDate } from "@/utils/date-formater";
import { TypographyH4 } from "@/components/typography/typography-h4";
import { TypographyP } from "@/components/typography/typography-p";
import { TypographyH5 } from "@/components/typography/typography-h5";
import Loading from "../loading";

const DATASET_SHARE_URL = "https://onedata.e-infra.cz/share/";

const DatasetDetails: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();

  const {
    data: dataset,
    isLoading,
    error,
  } = useApiServiceGetApiV1DatasetsById({ id: id as string });

  const patchDataset = useApiServicePatchApiV1DatasetsById();

  const { data: schemaData, isLoading: isSchemaLoading } =
    useApiServiceGetApiV1SchemasById({
      id: dataset?.schema ?? "",
    });

  const { data: projectData, isLoading: isProjectLoading } =
    useApiServiceGetApiV1ProjectsById({
      id: dataset?.project.id ?? "",
    });

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [originalName, setOriginalName] = useState<string>("");
  const [originalDescription, setOriginalDescription] = useState<string>("");
  const [formData, setFormData] = useState<any>({});

  const [metadata, setMetadata] = useState<Record<string, any>>({});
  const [originalMetadata, setOriginalMetadata] = useState<Record<string, any>>(
    {}
  );

  // const staticSchema = z.object({
  //   name: z.string().min(1, "Name is required"),
  //   description: z.string().optional(),
  // });

  // // 2. Build dynamic Zod schema for metadata (if schemaData?.schema is available)
  // let metadataZodSchema = z.object({});
  // if (schemaData?.schema) {
  //   try {
  //     metadataZodSchema = jsonSchemaToZod(schemaData.schema).;
  //   } catch (e) {
  //     metadataZodSchema = z.object({});
  //   }
  // }

  // const fullSchema = staticSchema.extend({
  //   metadata: metadataZodSchema,
  // });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [isEditing, setIsEditing] = useState<{
    name: boolean;
    description: boolean;
  }>({
    name: false,
    description: false,
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (dataset) {
      setName(dataset.name || "");
      setDescription(dataset.description || "");
      setOriginalName(dataset.name || "");
      setOriginalDescription(dataset.description || "");

      const meta = dataset?.metadata || {};
      setMetadata(meta);
      setOriginalMetadata(meta);
      setFormData(meta);
    }
  }, [dataset]);

  useEffect(() => {
    const metaChanged =
      JSON.stringify(metadata) !== JSON.stringify(originalMetadata);
    setHasChanges(
      name !== originalName ||
        description !== originalDescription ||
        metaChanged
    );
  }, [
    name,
    description,
    metadata,
    originalName,
    originalDescription,
    originalMetadata,
  ]);

  const handleDoubleClick = (field: "name" | "description") => {
    setIsEditing((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (inputId: string, value: any) => {
    if (inputId === "metadata") {
      setFormData(value);
      setMetadata(value);
    }
  };

  const handleMetadataChange = (key: string, value: any) => {
    setMetadata((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    const updatedFields: any = {};
    if (name !== originalName) updatedFields.name = name;
    if (description !== originalDescription)
      updatedFields.description = description;
    if (JSON.stringify(metadata) !== JSON.stringify(originalMetadata)) {
      updatedFields.metadata = metadata;
    }

    if (Object.keys(updatedFields).length === 0) {
      toast.info("No changes to save.");
      return;
    }

    try {
      await patchDataset.mutateAsync({
        id: id as string,
        requestBody: updatedFields,
      });

      setOriginalName(name);
      setOriginalDescription(description);
      setOriginalMetadata(metadata);
      setHasChanges(false);
      setIsEditing({ name: false, description: false });
      toast.success("Changes saved successfully!");
    } catch (error) {
      toast.error("Failed to update project. Please try again.");
    }
  };

  const handleRevert = () => {
    setName(originalName);
    setDescription(originalDescription);
    setMetadata(originalMetadata);
    setHasChanges(false);
    setIsEditing({ name: false, description: false });
    setErrors({});
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const renderMetadataFields = () => {
    return (
      <>
        <div className="flex items-center justify-between mb-4 mt-2">
          <TypographyH2 text="Metadata" />
        </div>
        <FormsWrapped
          setErrors={setErrors}
          schema={schemaData?.schema as object}
          uischema={schemaData?.uischema as object}
          data={formData}
          setData={(value) => handleChange("metadata", value)}
        />
      </>
    );
  };

  if (isLoading) {
    return <Loading></Loading>;
  }

  if (error) {
    return <div>Error loading dataset details. Please try again later.</div>;
  }

  if (!dataset) {
    return <div>No dataset found.</div>;
  }

  return (
    <div>
      <div>
        <Breadcrumbs detailName={dataset.name} />
      </div>
      <div className="w-full flex items-center max-w-full">
        <div className="flex items-center space-x-4">
          <ChevronLeft
            onClick={() => router.push(`/datasets`)}
            className="h-10 w-10 hover:bg-zinc-100 rounded-xl dark:hover:bg-zinc-800 cursor-pointer"
          />
          <div className="flex items-center gap-4">
            <TypographyH2 text="Dataset Details: " />
            {dataset?.name && <TypographyH2Ghost text={dataset.name} />}
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
        <div className="mb-10 max-w-xl ">
          <div>
            <Button
              variant={"default"}
              className="flex items-center justify-between mb-4"
              onClick={() => router.push(`/datasets/${id}/experiments`)}
            >
              <div className="flex items-center gap-2">
                <FlaskConical size={46} className="h-8 w-8" />
                <TypographyH5
                  text={
                    `Browse Experiments (` + dataset.experiments.length + ")"
                  }
                />
              </div>
            </Button>
          </div>

          <TextField
            label="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setHasChanges(true);
            }}
            onClick={() => handleDoubleClick("name")}
            InputProps={{ readOnly: !isEditing.name }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Collection Name"
            value={dataset.project?.name || ""}
            margin="normal"
            fullWidth
            disabled
          />
          <TextField
            label="Facility Abbreviation"
            value={projectData?.facility.abbreviation || ""}
            margin="normal"
            fullWidth
            disabled
          />
          <TextField
            label="Created At"
            margin="normal"
            fullWidth
            value={formatDate(dataset.created)}
            disabled
          />
          <TextField
            label="Created By"
            margin="normal"
            fullWidth
            value={dataset?.created_by?.full_name ?? ""}
            disabled
          />
          <TextField
            label="Description"
            fullWidth
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setHasChanges(true);
            }}
            onClick={() => handleDoubleClick("description")}
            InputProps={{ readOnly: !isEditing.description }}
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            label="Public Share Link"
            value={DATASET_SHARE_URL + dataset.onedata_share_id}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    variant="outline"
                    className="w-[100px]"
                    onClick={() =>
                      handleCopyToClipboard(
                        DATASET_SHARE_URL + dataset.onedata_share_id
                      )
                    }
                  >
                    <ClipboardCopy style={{ width: "25px", height: "25px" }} />
                  </Button>
                </InputAdornment>
              ),
            }}
            fullWidth
            margin="normal"
            disabled
          />

          <div className="mt-4">
            {isSchemaLoading ? (
              <div>
                <SkeletonTable></SkeletonTable>
              </div>
            ) : (
              renderMetadataFields()
            )}
          </div>
        </div>
      </BoundingBox>
      {hasChanges && (
        <div className="fixed bottom-4 right-4 flex space-x-4">
          <Button
            variant="destructive"
            size="xl"
            onClick={handleRevert}
            disabled={patchDataset.isPending}
          >
            Revert Changes
          </Button>
          <Button
            variant="default"
            size="xl"
            onClick={handleSave}
            disabled={patchDataset.isPending}
          >
            {patchDataset.isPending ? (
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

export default DatasetDetails;
