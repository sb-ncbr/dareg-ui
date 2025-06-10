import ReusableDropdown from "@/components/dropdowns/common/reusable-dropdown";
import { useApiServiceGetApiV1Facilities } from "../../../openapi/queries";

const FacilitiesDropdown = () => {
  const fetchFacilities = () => {
    const { data, isLoading, error } = useApiServiceGetApiV1Facilities();

    return {
      data: data?.results || [],
      isLoading,
      error,
    };
  };

  return (
    <ReusableDropdown
      fetchData={fetchFacilities}
      getItemLabel={(facility) => (facility as any).name}
      getItemId={(facility) => (facility as any).id}
      placeholder="Select a facility"
    />
  );
};

export default FacilitiesDropdown;
