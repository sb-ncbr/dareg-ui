"use client";
import { useApiServiceGetApiV1Facilities } from "../../../openapi/queries";
import { Facility } from "../../../openapi/requests";
import { Skeleton } from "../ui/skeleton";
import { ReusableSelect } from "./common/reusable-select";

type FacilitiesSelectProps = {
  value?: string | null;
  onChange?: (facility: Facility) => void;
};

export default function FacilitiesSelect({
  value,
  onChange,
}: FacilitiesSelectProps) {
  const { data: facilities, isLoading } = useApiServiceGetApiV1Facilities();
  console.log("Facilities:", facilities);

  if (isLoading || !facilities) {
    return <Skeleton className="h-10 w-[200px]" />;
  }

  return (
    <ReusableSelect<Facility>
      items={facilities.results ?? []}
      getItemLabel={(f) => f.name}
      getItemId={(f) => f.id}
      placeholder="Select a facility"
      value={value}
      onChange={onChange}
    />
  );
}
