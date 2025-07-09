"use client";
import { useState, useMemo } from "react";
import { TypographyH2 } from "@/components/typography/typography-h2";
import { TypographyH2Ghost } from "@/components/typography/typography-h2-ghost";
import { TypographyP } from "@/components/typography/typography-p";
import { Skeleton, TextField } from "@mui/material";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import FormsWrapped from "@/components/forms/form-wraper/forms-wraped";
import {
  useApiServiceGetApiV1Projects,
  useApiServiceGetApiV1ProjectsById,
  useApiServiceGetApiV1SchemasById,
  useApiServicePostApiV1Datasets,
  useApiServicePostApiV1DatasetsCreateDataset,
} from "../../../../openapi/queries";
import { Dataset } from "../../../../openapi/requests";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TemplateSelectSSR from "@/components/select/template-select";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import BoundingBox from "@/components/bounding-box/bounding-box";
import { Label } from "@/components/ui/label";

const CreateDatasetPage = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [schemaOverride, setSchemaOverride] = useState<any>();
  const [errors, setErrors] = useState<any>([]);
  const [datasetName, setDatasetName] = useState("");
  const [datasetDescription, setDatasetDescription] = useState("");
  const [formData, setFormData] = useState<any>({});

  const router = useRouter();

  const { data: allProjects, isLoading: isProjectsLoading } =
    useApiServiceGetApiV1Projects({});
  const { data: projectData } = useApiServiceGetApiV1ProjectsById(
    selectedProjectId ? { id: selectedProjectId } : { id: "" }
  );
  const { data: schemaData } = useApiServiceGetApiV1SchemasById(
    projectData?.default_dataset_schema?.id
      ? { id: projectData.default_dataset_schema.id }
      : { id: "" }
  );

  const schema = useMemo(() => {
    return schemaOverride ?? schemaData;
  }, [schemaOverride, schemaData]);

  const hasChanges = useMemo(() => {
    return (
      datasetName.trim() !== "" ||
      datasetDescription.trim() !== "" ||
      (formData && Object.keys(formData).length > 0)
    );
  }, [datasetName, datasetDescription, formData]);

  const createDataset = useApiServicePostApiV1Datasets();

  const handleSave = async () => {
    if (!datasetName.trim()) {
      toast.error("Dataset name is required.");
      return;
    }
    if (!selectedProjectId) {
      toast.error("Please select a collection.");
      return;
    }

    try {
      const newDataset: Partial<Dataset> = {
        name: datasetName,
        description: datasetDescription,
        project: selectedProjectId,
        schema: schema?.id,
        metadata: formData, // <-- now it's a string!
      };

      console.log("Creating dataset with data:", newDataset);

      await createDataset.mutateAsync({
        requestBody: newDataset as Dataset,
      });

      toast.success("Dataset created successfully!");
      router.push("/datasets");
    } catch (error: any) {
      toast.error("Failed to create dataset: \n" + error.message);
    }
  };

  const handleChange = (inputId: string, value: any) => {
    if (inputId === "metadata") {
      setFormData(value);
    }
  };

  const renderProjectDropdown = () => {
    if (isProjectsLoading) return <Skeleton className="w-[320px]" />;
    return (
      <div>
        <Label htmlFor="collection-select" className="mb-2 block">
          Select Collection
        </Label>
        <Select
          value={selectedProjectId ?? ""}
          onValueChange={(value) => {
            setSelectedProjectId(value || null);
            setSchemaOverride(undefined);
          }}
        >
          <SelectTrigger id="collection-select" className="w-[320px]">
            <SelectValue placeholder="Select a collection..." />
          </SelectTrigger>
          <SelectContent>
            {allProjects?.results?.map((proj: any) => (
              <SelectItem key={proj.id} value={proj.id}>
                {proj.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  return (
    <main className="">
      <Breadcrumbs />
      <div className="flex items-center gap-4">
        <ChevronLeft
          onClick={() => router.back()}
          className="h-10 w-10 hover:bg-zinc-100 rounded-xl dark:hover:bg-zinc-800 cursor-pointer"
        />
        <TypographyH2 text="Create New Dataset" />
        {projectData?.name && <TypographyH2Ghost text={projectData.name} />}
      </div>
      <BoundingBox>
        <div>{renderProjectDropdown()}</div>

        {selectedProjectId && (
          <>
            <div>
              <Label htmlFor="collection-select" className="mb-2 block">
                Select Schema
              </Label>
              <TemplateSelectSSR onChange={setSchemaOverride} />
            </div>
            <TextField
              label="Dataset Name"
              fullWidth
              margin="normal"
              value={datasetName}
              onChange={(e) => setDatasetName(e.target.value)}
            />
            <TextField
              label="Dataset Description"
              fullWidth
              margin="normal"
              value={datasetDescription}
              onChange={(e) => setDatasetDescription(e.target.value)}
            />

            {schema ? (
              <div className="mt-4">
                <FormsWrapped
                  setErrors={setErrors}
                  schema={schema.schema as object}
                  uischema={schema.uischema as object}
                  data={formData}
                  setData={(value) => handleChange("metadata", value)}
                />
              </div>
            ) : (
              <TypographyP text="Please select a template to create a new dataset." />
            )}
          </>
        )}

        {hasChanges && selectedProjectId && (
          <div className="fixed bottom-4 right-4 flex space-x-4 z-50">
            <Button
              variant="default"
              size="xl"
              onClick={handleSave}
              disabled={createDataset.isPending}
            >
              {createDataset.isPending ? (
                <span className="animate-pulse ml-1">Creating...</span>
              ) : (
                "Create Dataset"
              )}
            </Button>
          </div>
        )}
      </BoundingBox>

      <ToastContainer />
    </main>
  );
};

export default CreateDatasetPage;
