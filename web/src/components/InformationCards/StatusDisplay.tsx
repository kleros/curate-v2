import React, { useMemo } from "react";
import { getStatusLabel, mapFromSubgraphStatus } from "../RegistryCard/StatusBanner";
import { Status } from "consts/status";
import { Status as SubgraphStatus } from "src/graphql/graphql";
import { useCountdown } from "hooks/useCountdown";
import { secondsToDayHourMinute } from "utils/date";
import { useReadCurateV2ChallengePeriodDuration } from "hooks/useContract";
import { cn } from "~src/utils";

const colorStyles: Record<Status, string> = {
  [Status.RegistrationPending]: "text-klerosUIComponentsPrimaryBlue",
  [Status.ClearingPending]: "text-klerosUIComponentsPrimaryBlue",
  [Status.Disputed]: "text-klerosUIComponentsSecondaryPurple",
  [Status.Included]: "text-klerosUIComponentsSuccess",
  [Status.Removed]: "text-klerosUIComponentsError",
};

const dotStyles: Record<Status, string> = {
  [Status.RegistrationPending]: "before:bg-klerosUIComponentsPrimaryBlue",
  [Status.ClearingPending]: "before:bg-klerosUIComponentsPrimaryBlue",
  [Status.Disputed]: "before:bg-klerosUIComponentsSecondaryPurple",
  [Status.Included]: "before:bg-klerosUIComponentsSuccess",
  [Status.Removed]: "before:bg-klerosUIComponentsError",
};

interface IStatusDisplay {
  status: SubgraphStatus;
  disputed: boolean;
  registryAddress: string;
  latestRequestSubmissionTime: string;
}
const StatusDisplay: React.FC<IStatusDisplay> = ({
  status,
  disputed,
  registryAddress,
  latestRequestSubmissionTime,
}) => {
  const processedStatus = mapFromSubgraphStatus(status, disputed);

  const { data: challengePeriodDuration } = useReadCurateV2ChallengePeriodDuration({
    address: registryAddress as `0x${string}`,
    query: {
      enabled: [Status.ClearingPending, Status.RegistrationPending].includes(processedStatus),
    },
  });

  const challengePeriodDeadline = useMemo(() => {
    if (!challengePeriodDuration || !latestRequestSubmissionTime) return 0;

    return parseInt(challengePeriodDuration.toString()) + parseInt(latestRequestSubmissionTime, 10);
  }, [latestRequestSubmissionTime, challengePeriodDuration]);

  const countdown = useCountdown(challengePeriodDeadline);

  const showCountdown =
    countdown && countdown > 0 && [Status.ClearingPending, Status.RegistrationPending].includes(processedStatus);

  return (
    <div className="flex flex-wrap gap-y-1 gap-x-2">
      <label
        className={cn(
          "flex items-center",
          "before:content-[''] before:inline-block before:h-2 before:w-2 before:rounded-[50%] before:mr-2 before:shrink-0",
          colorStyles[processedStatus],
          dotStyles[processedStatus]
        )}
      >
        {getStatusLabel(processedStatus)}
      </label>
      <label className={cn("flex items-center", colorStyles[processedStatus])}>
        {showCountdown ? secondsToDayHourMinute(countdown) : ""}
      </label>
    </div>
  );
};

export default StatusDisplay;
