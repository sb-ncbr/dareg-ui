"use client";
import TemplatesDropdown from "@/components/dropdowns/templates-dropdown";
import FormsWrapped from "@/components/forms/form-wraper/forms-wraped";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  useApiServiceGetApiV1ProjectsById,
  useApiServiceGetApiV1SchemasById,
  useApiServicePostApiV1Datasets,
  useApiServicePostApiV1DatasetsCreateDataset,
} from "../../../../../../openapi/queries";
import { TypographyH2 } from "@/components/typography/typography-h2";
import { TextField } from "@mui/material";
import { TypographyP } from "@/components/typography/typography-p";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import { Dataset } from "../../../../../../openapi/requests";
import { TypographyH2Ghost } from "@/components/typography/typography-h2-ghost";
import { Breadcrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import BoundingBox from "@/components/bounding-box/bounding-box";

const CreateDatasetPage = () => {
  const { id } = useParams();

  const [schema, setSchema] = useState<any | undefined>();
  const [errors, setErrors] = useState<any>([]);
  const [datasetName, setDatasetName] = useState("");
  const [datasetDescription, setDatasetDescription] = useState("");
  const [formData, setFormData] = useState<any>({});
  const [hasChanges, setHasChanges] = useState(false);

  const { data: collectionData, isLoading: collectionLoading } =
    useApiServiceGetApiV1ProjectsById({ id: id as string });

  const { data: schemaData, isLoading: isSchemaLoading } =
    useApiServiceGetApiV1SchemasById({
      id: collectionData?.default_dataset_schema?.id as string,
    });

  useEffect(() => {
    if (!isSchemaLoading && schemaData && !schema) {
      setSchema(schemaData);
    }
  }, [isSchemaLoading, schemaData, schema]);

  useEffect(() => {
    if (
      datasetName.trim() ||
      datasetDescription.trim() ||
      (formData && Object.keys(formData).length > 0)
    ) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [datasetName, datasetDescription, formData]);

  const createDataset = useApiServicePostApiV1DatasetsCreateDataset();

  const handleSave = async () => {
    if (!datasetName.trim()) {
      toast.error("Dataset name is required.");
      return;
    }
    try {
      const newDataset: Partial<Dataset> = {
        name: datasetName,
        description: datasetDescription,
        project: id as string,
        schema: schema?.id,
        metadata: formData,
      };

      await createDataset.mutateAsync({
        requestBody: newDataset as Dataset,
      });

      toast.success("Dataset created successfully!");
      setHasChanges(false);
    } catch (error: any) {
      toast.error("Failed to create dataset. Error: " + error.message);
    }
  };

  const handleChange = (inputId: string, value: any) => {
    if (inputId === "metadata") {
      setFormData(value);
    }
  };

  if (collectionLoading || isSchemaLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <Breadcrumbs detailName={collectionData?.name} />
      <div className="flex items-center gap-4">
        <TypographyH2 text="Create New Dataset In Project:" />
        {collectionData?.name && (
          <TypographyH2Ghost text={collectionData.name} />
        )}
      </div>
      <BoundingBox>
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
        <div className="py-8">
          <TemplatesDropdown onSelect={setSchema} />
        </div>
        {schema != undefined ? (
          <div>
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

        {hasChanges && (
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
