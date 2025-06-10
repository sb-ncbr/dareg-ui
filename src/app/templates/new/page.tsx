"use client";
import { useState } from "react";
import { TypographyH2 } from "@/components/typography/typography-h2";
import { TypographyH2Ghost } from "@/components/typography/typography-h2-ghost";
import { TypographyP } from "@/components/typography/typography-p";
import { Breadcrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import BoundingBox from "@/components/bounding-box/bounding-box";
import { TextField } from "@mui/material";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import FormsWrapped from "@/components/forms/form-wraper/forms-wraped";
import { useApiServicePostApiV1Schemas } from "../../../../openapi/queries";

const CreateTemplatePage = () => {
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [schema, setSchema] = useState<any>({});
  const [uiSchema, setUiSchema] = useState<any>({});
  const [formData, setFormData] = useState<any>({});
  const [hasChanges, setHasChanges] = useState(false);

  const createTemplate = useApiServicePostApiV1Schemas();

  const handleSave = async () => {
    if (!templateName.trim()) {
      toast.error("Template name is required.");
      return;
    }
    try {
      await createTemplate.mutateAsync({
        requestBody: {
          name: templateName,
          description: templateDescription,
          schema,
          uischema: uiSchema,
          metadata: formData,
        },
      });
      toast.success("Template created successfully!");
      setHasChanges(false);
    } catch (error: any) {
      toast.error("Failed to create template. Error: " + error.message);
    }
  };

  return (
    <main>
      <Breadcrumbs />
      <div className="flex items-center gap-4">
        <TypographyH2 text="Create New Template" />
      </div>
      <BoundingBox>
        <TextField
          label="Template Name"
          fullWidth
          margin="normal"
          value={templateName}
          onChange={(e) => {
            setTemplateName(e.target.value);
            setHasChanges(true);
          }}
        />
        <TextField
          label="Template Description"
          fullWidth
          margin="normal"
          value={templateDescription}
          onChange={(e) => {
            setTemplateDescription(e.target.value);
            setHasChanges(true);
          }}
        />
        <div className="my-8">
          <TypographyP text="Define your template schema and UI schema below." />
        </div>
        {schema && Object.keys(schema).length > 0 ? (
          <FormsWrapped
            schema={schema}
            uischema={uiSchema}
            data={formData}
            setData={setFormData}
          />
        ) : (
          <TypographyP text="Please define a schema to preview the form." />
        )}

        {hasChanges && (
          <div className="fixed bottom-4 right-4 flex space-x-4 z-50">
            <Button
              variant="default"
              size="xl"
              onClick={handleSave}
              disabled={createTemplate.isPending}
            >
              {createTemplate.isPending ? (
                <span className="animate-pulse ml-1">Creating...</span>
              ) : (
                "Create Template"
              )}
            </Button>
          </div>
        )}
      </BoundingBox>
      <ToastContainer />
    </main>
  );
};

export default CreateTemplatePage;
