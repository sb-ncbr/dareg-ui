import { DateRange } from "react-day-picker";

export interface ExperimentsFilterState {
  dateRange: DateRange;
  sortOrder: "asc" | "desc";
  search: string;
  status: string;
}