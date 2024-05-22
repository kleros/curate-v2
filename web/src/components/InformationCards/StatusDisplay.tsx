import React, { useMemo } from "react";
import { getStatusColor, getStatusLabel, mapFromSubgraphStatus } from "../RegistryCard/StatusBanner";
import styled, { css, useTheme } from "styled-components";
import { Status } from "consts/status";
import { Status as SubgraphStatus } from "src/graphql/graphql";
import { useCurateV2ChallengePeriodDuration } from "hooks/contracts/generated";
import { useCountdown } from "hooks/useCountdown";
import { secondsToDayHourMinute } from "utils/date";

const StatusContainer = styled.div`
  display: flex;
  gap: 4px 8px;
  flex-wrap: wrap;
`;

const StyledLabel = styled.label<{ frontColor: string; withDot?: boolean }>`
  display: flex;
  align-items: center;
  color: ${({ frontColor }) => frontColor};
  ${({ withDot, frontColor }) =>
    withDot
      ? css`
          ::before {
            content: "";
            display: inline-block;
            height: 8px;
            width: 8px;
            border-radius: 50%;
            margin-right: 8px;
            background-color: ${frontColor};
            flex-shrink: 0;
          }
        `
      : null}
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
  const theme = useTheme();

  const processedStatus = mapFromSubgraphStatus(status, disputed);
  const [frontColor] = getStatusColor(processedStatus, theme);

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
    <StatusContainer>
      <StyledLabel frontColor={frontColor} withDot>
        {getStatusLabel(processedStatus)}
      </StyledLabel>
      <StyledLabel {...{ frontColor }}>{showCountdown ? secondsToDayHourMinute(countdown) : ""}</StyledLabel>
    </StatusContainer>
  );
};

export default StatusDisplay;
