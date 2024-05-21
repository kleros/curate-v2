import React, { useMemo } from "react";
import { getStatusColor, getStatusLabel, mapFromSubgraphStatus } from "../RegistryCard/StatusBanner";
import styled from "styled-components";
import { Status } from "consts/status";
import { Status as SubgraphStatus } from "src/graphql/graphql";
import { useCurateV2ChallengePeriodDuration } from "hooks/contracts/generated";
import { useCountdown } from "hooks/useCountdown";
import { secondsToDayHourMinute } from "utils/date";

const StatusContainer = styled.div<{ status: Status; isList: boolean }>`
  display: flex;
  .dot {
    ::before {
      content: "";
      display: inline-block;
      height: 8px;
      width: 8px;
      border-radius: 50%;
      margin-right: 8px;
    }
  }
  ${({ theme, status }) => {
    const [frontColor] = getStatusColor(status, theme);
    return `
      .front-color {
        color: ${frontColor};
      }
      .dot {
        ::before {
          background-color: ${frontColor};
        }
      }
    `;
  }};
`;
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
  const { data: challengePeriodDuration } = useCurateV2ChallengePeriodDuration({
    //@ts-ignore
    address: registryAddress,
    enabled: [Status.ClearingPending, Status.RegistrationPending].includes(processedStatus),
  });

  const challengePeriodDeadline = useMemo(() => {
    if (!challengePeriodDuration || !latestRequestSubmissionTime) return 0;

    return parseInt(challengePeriodDuration.toString()) + parseInt(latestRequestSubmissionTime, 10);
  }, [latestRequestSubmissionTime, challengePeriodDuration]);

  const countdown = useCountdown(challengePeriodDeadline);

  const showCountdown =
    countdown && countdown > 0 && [Status.ClearingPending, Status.RegistrationPending].includes(processedStatus);

  return (
    <StatusContainer {...{ status: processedStatus, isList: false }}>
      <label className="front-color dot">
        {getStatusLabel(processedStatus)} {showCountdown ? secondsToDayHourMinute(countdown) : ""}
      </label>
    </StatusContainer>
  );
};

export default StatusDisplay;
