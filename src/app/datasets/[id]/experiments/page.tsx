"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useState, useEffect, useRef } from "react"; // Import useRef
import { Breadcrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import {
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Notebook,
  Play,
  Square,
} from "lucide-react";
import { TypographyH2 } from "@/components/typography/typography-h2";
import { TypographyH2Ghost } from "@/components/typography/typography-h2-ghost";
import { formatDate, formatDateTime } from "@/utils/date-formater";
import { useApiServiceGetApiV1DatasetsById } from "../../../../../openapi/queries";
import { TypographyH3 } from "@/components/typography/typography-h3";
import { TypographyH4 } from "@/components/typography/typography-h4";
import BoundingBox from "@/components/bounding-box/bounding-box";
import { ExperimentInfoRow } from "@/components/experiment/experiment-info-row";
import { ExperimentsFilter } from "@/components/experiment/filtration/experiments-filters";
import { Experiment } from "../../../../../openapi/requests";
import ExperimentStateCard from "@/components/experiment/status/state-card";
import { StatusLottieDot } from "@/components/experiment/status/status-lottie-dot";
import { TypographyH5 } from "@/components/typography/typography-h5";
import { ExperimentsFilterState } from "@/components/experiment/types/experiments-filter-state";
import Loading from "../loading";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ImperativePanelHandle } from "react-resizable-panels";

export default function DatasetDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: dataset, isLoading } = useApiServiceGetApiV1DatasetsById({
    id: id as string,
  });
  const [selectedExperimentId, setSelectedExperimentId] = useState<
    string | null
  >(null);

  const [filter, setFilter] = useState<ExperimentsFilterState>({
    dateRange: {
      from: undefined,
      to: undefined,
    },
    sortOrder: "asc",
    search: "",
    status: "all",
  });

  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const panelRef = useRef<ImperativePanelHandle>(null);
  useEffect(() => {
    if (
      dataset?.experiments &&
      dataset.experiments.length > 0 &&
      !selectedExperimentId
    ) {
      setExperiments(dataset.experiments);
      setSelectedExperimentId(dataset.experiments[0].id);
    }
  }, [dataset, selectedExperimentId]);

  if (isLoading) {
    return <Loading />;
  }
  if (!dataset) return <div>Dataset not found.</div>;

  const selectedExperiment = experiments.find(
    (exp: any) => exp.id === selectedExperimentId
  );

  const filteredExperiments = experiments
    .filter((exp) => {
      const expDate = new Date(exp?.start_time ?? "");
      const from = filter.dateRange.from
        ? new Date(filter.dateRange.from)
        : null;
      const to = filter.dateRange.to ? new Date(filter.dateRange.to) : null;
      if (from && expDate < from) return false;
      if (to && expDate > to) return false;
      if (filter.status !== "all" && exp.status !== filter.status) return false;
      if (
        filter.search &&
        !exp?.name?.toLowerCase().includes(filter.search.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      const aTime = new Date(a.start_time ?? "").getTime();
      const bTime = new Date(b.start_time ?? "").getTime();
      return filter.sortOrder === "asc" ? aTime - bTime : bTime - aTime;
    });

  const togglePanel = () => {
    if (panelRef.current) {
      if (collapsed) {
        panelRef.current.expand();
      } else {
        panelRef.current.collapse();
      }
      setCollapsed(!collapsed);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div>
        <Breadcrumbs detailName={dataset.name} />
      </div>
      <div className="w-full flex items-center max-w-full mb-6">
        <div className="flex items-center space-x-4">
          <ChevronLeft
            onClick={() => router.back()}
            className="h-10 w-10 hover:bg-zinc-100 rounded-xl dark:hover:bg-zinc-800 cursor-pointer"
          />
          <div className="flex items-center gap-4">
            <TypographyH2 text="Experiments under Dataset: " />
            {dataset?.name && <TypographyH2Ghost text={dataset.name} />}
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <ExperimentsFilter filterState={filter} onChange={setFilter} />
      </div>
      <ResizablePanelGroup direction="horizontal" className="flex-grow">
        <ResizablePanel
          ref={panelRef}
          defaultSize={20}
          minSize={5}
          maxSize={40}
          collapsible={true}
          collapsedSize={9}
          className={`py-6 px-2 border-r transition-all duration-300`}
        >
          <div className="h-full flex flex-col gap-4">
            <div
              className={`flex items-center ${
                collapsed ? "justify-center" : "justify-between"
              }`}
            >
              {!collapsed && <TypographyH3 text={"Experiments:"} />}
              <Button
                variant="ghost"
                size="icon"
                className={collapsed ? "mr-4" : "ml-auto"}
                onClick={togglePanel}
                aria-label={collapsed ? "Expand panel" : "Collapse panel"}
              >
                <span
                  className={`transition-transform duration-300  ${
                    collapsed ? "rotate-180" : "rotate-0"
                  }`}
                  style={{ display: "inline-block" }}
                >
                  <ChevronLeft />
                </span>
              </Button>
            </div>
            <div
              className={`h-full flex flex-col gap-2 overflow-y-auto ${
                collapsed ? "items-center px-0" : ""
              }`}
            >
              {filteredExperiments.length > 0 ? (
                collapsed ? (
                  <TooltipProvider>
                    <div className="flex flex-col py-2 gap-2 items-center">
                      {filteredExperiments.map((exp: any) => (
                        <Tooltip key={exp.id}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={
                                selectedExperimentId === exp.id
                                  ? "default"
                                  : "outline"
                              }
                              size="icon"
                              className={`flex flex-col items-center justify-center w-12 h-16 p-0 rounded-lg ${
                                selectedExperimentId === exp.id
                                  ? "ring-2 ring-primary"
                                  : ""
                              }`}
                              style={{ minWidth: 48, minHeight: 56 }}
                              onClick={() => setSelectedExperimentId(exp.id)}
                            >
                              <StatusLottieDot status={exp.status} size={32} />
                              <span className="text-xs font-semibold mt-1 my-2 mb-2">
                                {exp.name?.slice(0, 3) ?? "???"}
                              </span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-xs">
                            <div className="flex flex-col gap-1 ">
                              <span className="font-semibold text-sm">
                                {exp.status}
                              </span>
                              <span className="text-xs break-all text-white">
                                {exp.name}
                              </span>
                              <span className="text-xs text-white">
                                {formatDate(exp.start_time)}
                              </span>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </TooltipProvider>
                ) : (
                  filteredExperiments.map((exp: any) => (
                    <Button
                      key={exp.id}
                      variant={
                        selectedExperimentId === exp.id ? "default" : "outline"
                      }
                      size={"xl"}
                      className="justify-between w-full"
                      onClick={() => setSelectedExperimentId(exp.id)}
                    >
                      <div className="flex items-center gap-2 justify-between w-full">
                        <div className="flex items-center gap-2">
                          <StatusLottieDot status={exp.status} size={60} />
                          <TypographyH5 text={exp.name} />
                        </div>
                        <TypographyH5
                          text={formatDate(exp.start_time)}
                          variant="ghost"
                        />
                      </div>
                    </Button>
                  ))
                )
              ) : (
                !collapsed && (
                  <div className="text-xs text-muted-foreground">
                    No experiments found.
                  </div>
                )
              )}
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={30} minSize={40} className="px-8">
          <BoundingBox>
            <div className="h-full flex flex-col gap-4">
              <div className="flex gap-4 ">
                <TypographyH3 text={"Experiments Details:"}></TypographyH3>
                <TypographyH3
                  text={selectedExperiment?.name ?? ""}
                  variant="ghost"
                />
              </div>
              <div className="flex-grow overflow-y-auto pr-2">
                {selectedExperiment ? (
                  <div className="space-y-4">
                    <div className="font-semibold mb-2"></div>
                    <div className="flex items-center gap-8">
                      <ExperimentInfoRow
                        title={"Start Time:"}
                        icon={<Play />}
                        value={formatDateTime(
                          selectedExperiment.start_time ?? ""
                        )}
                      />
                      <ExperimentInfoRow
                        title={"End Time:"}
                        icon={<Square />}
                        value={formatDateTime(
                          selectedExperiment.end_time ?? ""
                        )}
                      />
                    </div>

                    <ExperimentInfoRow
                      title={"Status:"}
                      icon={<CircleCheck />}
                      value={selectedExperiment.status ?? "Unknown"}
                      child={
                        <ExperimentStateCard
                          status={selectedExperiment.status ?? ""}
                        />
                      }
                    />

                    <ExperimentInfoRow
                      title={"Note:"}
                      icon={<Notebook />}
                      value={selectedExperiment.note ?? "Unknown"}
                    />

                    <TypographyH4 text="Experiment Data" />
                    <div className="mb-2">
                      <b>Onedata File ID:</b>{" "}
                      {selectedExperiment.onedata_file_id || "-"}
                    </div>
                    <div className="mt-4 text-xs text-muted-foreground">
                      <b>Created:</b> {formatDate(selectedExperiment.created)}
                      <br />
                      <b>Modified:</b> {formatDate(selectedExperiment.modified)}
                    </div>
                  </div>
                ) : (
                  <span className="text-muted-foreground">
                    Select an experiment to see details.
                  </span>
                )}
              </div>
            </div>
          </BoundingBox>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
