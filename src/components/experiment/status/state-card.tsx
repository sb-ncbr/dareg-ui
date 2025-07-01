import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusLottieDot } from "./status-lottie-dot";
import { ExperimentStatusEnum } from "../../../../openapi/requests";
import { Typography } from "@mui/material";
import { stat } from "fs";
import { TypographyH5 } from "@/components/typography/typography-h5";

export default function ExperimentStateCard({
  status,
}: {
  status: ExperimentStatusEnum | "";
}) {
  return (
    <div className="w-[200px] flex items-center justify-between">
      <div>
        <div className="flex items-center justify-center">
          <StatusLottieDot status={status} size={40} />
          <TypographyH5 variant={"ghost"} text={status} />
        </div>
      </div>
    </div>
  );
}
