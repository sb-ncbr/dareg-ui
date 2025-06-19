"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useState, useEffect } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import { ChevronLeft, CircleCheck, Notebook, Play, Square } from "lucide-react";
import { TypographyH2 } from "@/components/typography/typography-h2";
import { TypographyH2Ghost } from "@/components/typography/typography-h2-ghost";
import { formatDate, formatDateTime } from "@/utils/date-formater";
import { useApiServiceGetApiV1DatasetsById } from "../../../../../openapi/queries";
import { TypographyH3 } from "@/components/typography/typography-h3";
import { CircularProgress } from "@mui/material";
import { TypographyP } from "@/components/typography/typography-p";
import { TypographyH4 } from "@/components/typography/typography-h4";
import BoundingBox from "@/components/bounding-box/bounding-box";
import { ExperimentInfoRow } from "@/components/experiment/experiment-info-row";

export default function DatasetDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: dataset, isLoading } = useApiServiceGetApiV1DatasetsById({
    id: id as string,
  });
  const [selectedExperimentId, setSelectedExperimentId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (
      dataset?.experiments &&
      dataset.experiments.length > 0 &&
      !selectedExperimentId
    ) {
      setSelectedExperimentId(dataset.experiments[0].id);
    }
  }, [dataset, selectedExperimentId]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }
  if (!dataset) return <div>Dataset not found.</div>;

  const experiments = dataset.experiments || [];
  const selectedExperiment = experiments.find(
    (exp: any) => exp.id === selectedExperimentId
  );

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
      <ResizablePanelGroup direction="horizontal" className="flex-grow">
        <ResizablePanel defaultSize={20} minSize={20} className="p-4 border-r">
          <div className="h-full flex flex-col gap-8">
            <TypographyH3 text={"Experiments:"}></TypographyH3>
            <div className="flex flex-col gap-2 overflow-y-auto">
              {experiments.length > 0 ? (
                experiments.map((exp: any) => (
                  <Button
                    key={exp.id}
                    variant={
                      selectedExperimentId === exp.id ? "default" : "outline"
                    }
                    className="justify-between w-full"
                    onClick={() => setSelectedExperimentId(exp.id)}
                  >
                    <TypographyP text={exp.name} />
                    <span className="text-xs text-muted-foreground">
                      {formatDate(exp.start_time)}
                    </span>
                  </Button>
                ))
              ) : (
                <div className="text-xs text-muted-foreground">
                  No experiments found.
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70} minSize={30} className="px-4">
          <BoundingBox>
            <div className="h-full flex flex-col gap-4">
              <div className="flex items-center gap-4 ">
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
