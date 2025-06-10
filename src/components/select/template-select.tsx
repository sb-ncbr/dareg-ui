"use client";
import { useApiServiceGetApiV1Schemas } from "../../../openapi/queries";
import { ApiService, Schema } from "../../../openapi/requests";
import { Skeleton } from "../ui/skeleton";
import { ReusableSelect } from "./common/reusable-select";

type TemplateSelectSSRProps = {
  value?: string | null;
  onChange?: (schema: Schema) => void;
};

export default function TemplateSelectSSR({
  value,
  onChange,
}: TemplateSelectSSRProps) {
  const { data: templates, isLoading } = useApiServiceGetApiV1Schemas();
  if (isLoading || !templates) {
    <Skeleton className="h-10 w-[200px]" />;
  }
  console.log("Templates:", templates);
  return (
    <ReusableSelect<Schema>
      items={templates?.results ?? []}
      getItemLabel={(t) => t.name}
      getItemId={(t) => t.id}
      placeholder="Select a template"
      value={value}
      onChange={onChange}
    />
  );
}
