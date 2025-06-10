import ReusableDropdown from "@/components/dropdowns/common/reusable-dropdown";
import { useApiServiceGetApiV1Schemas } from "../../../openapi/queries";
import { Schema } from "../../../openapi/requests";
import { Skeleton } from "@/components/ui/skeleton";

type TemplatesDropdownProps = {
  onSelect: (template: Schema) => void;
};

const TemplatesDropdown = ({ onSelect }: TemplatesDropdownProps) => {
  const { data, isLoading, error } = useApiServiceGetApiV1Schemas();

  const fetchTemplates = () => ({
    data: data?.results || [],
    isLoading,
    error,
  });

  if (isLoading) {
    return <Skeleton className="h-4 w-[200px]" />;
  }

  return (
    <ReusableDropdown
      fetchData={fetchTemplates}
      getItemLabel={(template) => (template as any).name}
      getItemId={(template) => (template as any).id}
      placeholder="Select a template"
      onChange={onSelect}
    />
  );
};

export default TemplatesDropdown;
