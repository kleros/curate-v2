import { Button } from "@kleros/ui-components-library";
import React, { useCallback, useMemo } from "react";
import { Address } from "viem";
import { COURT_SITE } from "consts/index";
import { Status } from "consts/status";
import { useItemRequests } from "queries/useRequestsQuery";
import KlerosIcon from "assets/svgs/icons/kleros.svg";
import styled from "styled-components";
import { useToggle } from "react-use";
import Modal, { getModalButtonText } from "./Modal";
import ExecuteButton from "./ExecuteButton";
import { useCurateV2ChallengePeriodDuration } from "hooks/contracts/generated";
import { useQueryClient } from "@tanstack/react-query";

const StyledKlerosIcon = styled(KlerosIcon)`
  path {
    fill: ${({ theme }) => theme.whiteBackground};
  }
`;

interface IActionButton {
  status: Status;
  registryAddress: Address;
  itemId: string;
  isItem: boolean;
}

const ActionButton: React.FC<IActionButton> = ({ status, registryAddress, itemId, isItem }) => {
  const queryClient = useQueryClient();

  const [isModalOpen, toggleModal] = useToggle(false);

  const { data: requests, isLoading } = useItemRequests(`${itemId}@${registryAddress}`);
  //@ts-ignore
  const { data: challengePeriodDuration } = useCurateV2ChallengePeriodDuration({ address: registryAddress });

  const latestRequest = requests?.requests?.[requests.requests.length - 1];
  const disputeId = latestRequest?.disputeID;

  const isExecutable = useMemo(() => {
    if (!latestRequest || !challengePeriodDuration) return false;
    return !latestRequest.resolved && Date.now() / 1000 - latestRequest.submissionTime > challengePeriodDuration;
  }, [latestRequest, challengePeriodDuration]);

  const refetch = useCallback(() => {
    queryClient.invalidateQueries(["refetchOnBlock", `itemDetailsQuery${itemId}@${registryAddress}`]);
    queryClient.invalidateQueries(["refetchOnBlock", `registryDetailsQuery${registryAddress}`]);
  }, [itemId, registryAddress, queryClient]);

  let ButtonComponent: JSX.Element | null = useMemo(() => {
    if (status === Status.Disputed)
      return (
        <a href={`${COURT_SITE}/cases/${disputeId}/overview`} target="_blank" rel="noreferrer">
          <Button disabled={isLoading} Icon={StyledKlerosIcon} text={`View Case #${disputeId ?? 0}`} />
        </a>
      );

    if (isExecutable && ![Status.Included, Status.Removed].includes(status))
      return <ExecuteButton {...{ registryAddress, itemId, refetch }} />;

    return <Button variant="secondary" text={getModalButtonText(status ?? 0, isItem)} onClick={toggleModal} />;
  }, [isExecutable, registryAddress, status, itemId, isLoading, disputeId]);

  return (
    <>
      {ButtonComponent}
      {isModalOpen ? <Modal {...{ registryAddress, itemId, isItem, status, toggleModal, refetch }} /> : null}
    </>
  );
};

export default ActionButton;
