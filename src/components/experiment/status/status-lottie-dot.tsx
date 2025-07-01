import Lottie from "lottie-react";
import newDot from "../../../../public/lottie/green-pulse-dot_new.json";
import preparedDot from "../../../../public/lottie/green-pulse-dot_prepared.json";
import runningDot from "../../../../public/lottie/green-pulse-dot_running.json";
import synchronizingDot from "../../../../public/lottie/green-pulse-dot_synchronizing.json";
import successDot from "../../../../public/lottie/green-pulse-dot_success.json";
import failureDot from "../../../../public/lottie/green-pulse-dot_failure.json";
import discardedDot from "../../../../public/lottie/green-pulse-dot_discarded.json";
import { ExperimentStatusEnum } from "../../../../openapi/requests";

const statusToLottie: Record<ExperimentStatusEnum | "", any> = {
  new: newDot,
  prepared: preparedDot,
  running: runningDot,
  synchronizing: synchronizingDot,
  success: successDot,
  failure: failureDot,
  discarded: discardedDot,
  "": newDot, // Fallback for unknown status
};

export function StatusLottieDot({
  status,
  size = 32,
}: {
  status: ExperimentStatusEnum | "";
  size?: number;
}) {
  const animationData = statusToLottie[status] || newDot;
  return (
    <Lottie
      animationData={animationData}
      loop
      autoplay
      style={{ width: size, height: size }}
    />
  );
}
