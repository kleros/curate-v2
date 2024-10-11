import React, { useMemo, useState } from "react";
import styled from "styled-components";
import Header from "./Header";
import Buttons from "./Buttons";
import DepositRequired from "./DepositRequired";
import Info from "./Info";
import { IBaseModal } from ".";
import { useAccount, useBalance, usePublicClient } from "wagmi";
import { useArbitrationCost } from "hooks/useArbitrationCostFromKlerosCore";
import { wrapWithToast } from "utils/wrapWithToast";
import { useItemDetailsQuery } from "hooks/queries/useItemDetailsQuery";
import Modal from "components/Modal";
import {
  useReadCurateV2GetArbitratorExtraData,
  useReadCurateV2SubmissionBaseDeposit,
  useSimulateCurateV2AddItem,
  useWriteCurateV2AddItem,
} from "hooks/useContract";
import ClosedCircleIcon from "components/StyledIcons/ClosedCircleIcon";

const ReStyledModal = styled(Modal)`
  gap: 32px;
`;

export const ErrorButtonMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: center;
  margin: 12px;
  color: ${({ theme }) => theme.error};
  font-size: 14px;
`;

interface ISubmitModal extends IBaseModal {}

const alertMessage = (isItem: boolean) =>
  `When you request ${isItem ? "an item" : "a list"} to be re-submitted it goes to the Pending state for a while.` +
  ` During that time the submission can be challenged starting a dispute. If the ${isItem ? "item" : "list"} is` +
  ` removed the deposit is reimbursed, in case the ${isItem ? "item" : "list"} is not removed the deposit is lost.` +
  ` Make sure you read and understand the Policy before proceeding.`;

const ResubmitModal: React.FC<ISubmitModal> = ({ toggleModal, isItem, registryAddress, itemId, refetch }) => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [isResubmittingItem, setIsResubmittingItem] = useState(false);
  const { data: userBalance, isLoading: isBalanceLoading } = useBalance({ address });
  const { data: itemData, isLoading: isItemDataLoading } = useItemDetailsQuery(`${itemId}@${registryAddress}`);

  const {
    data: arbitratorExtraData,
    isLoading: isLoadingExtradata,
    isError: isErrorExtradata,
  } = useReadCurateV2GetArbitratorExtraData({
    address: registryAddress,
  });

  const {
    data: removalDeposit,
    isLoading: isSubmissionDepositLoading,
    isError: isErrorSubmissionDeposit,
  } = useReadCurateV2SubmissionBaseDeposit({
    address: registryAddress,
  });

  const { arbitrationCost, isLoading: isLoadingArbCost } = useArbitrationCost(arbitratorExtraData);

  const depositRequired = useMemo(() => {
    if (!arbitrationCost || !removalDeposit) return 0n;
    return (arbitrationCost as bigint) + removalDeposit;
  }, [arbitrationCost, removalDeposit]);

  const isLoading = useMemo(
    () =>
      isBalanceLoading || isLoadingArbCost || isSubmissionDepositLoading || isLoadingExtradata || isResubmittingItem,
    [isBalanceLoading, isLoadingArbCost, isSubmissionDepositLoading, isLoadingExtradata, isResubmittingItem]
  );

  const insufficientBalance = useMemo(() => {
    if (!userBalance || !depositRequired) return true;
    return userBalance?.value < depositRequired;
  }, [userBalance, depositRequired]);

  const isDisabled = useMemo(() => {
    return Boolean(insufficientBalance || isErrorExtradata || isErrorSubmissionDeposit);
  }, [insufficientBalance, isErrorExtradata, isErrorSubmissionDeposit]);

  const { data: config, isError } = useSimulateCurateV2AddItem({
    query: {
      enabled: address && registryAddress && !isLoading && !isDisabled && !isItemDataLoading,
    },
    address: registryAddress,
    args: [itemData?.item?.data ?? ""],
    value: depositRequired,
  });

  const { writeContractAsync: resubmitItem } = useWriteCurateV2AddItem();

  return (
    <ReStyledModal {...{ toggleModal }}>
      <Header text={`Resubmit ${isItem ? "Item" : "List"}`} />
      <DepositRequired value={depositRequired ?? 0} />
      <Info alertMessage={alertMessage(isItem)} />
      <div>
        <Buttons
          buttonText="Resubmit"
          toggleModal={toggleModal}
          isDisabled={isDisabled || isError || isResubmittingItem}
          isLoading={isLoading}
          callback={() => {
            if (!resubmitItem || !config?.request || !publicClient) return;
            setIsResubmittingItem(true);
            wrapWithToast(async () => await resubmitItem(config.request), publicClient)
              .then((res) => {
                refetch();
                toggleModal();
              })
              .catch(() => {})
              .finally(() => setIsResubmittingItem(false));
          }}
        />
        {insufficientBalance && (
          <ErrorButtonMessage>
            <ClosedCircleIcon /> Insufficient balance
          </ErrorButtonMessage>
        )}
      </div>
    </ReStyledModal>
  );
};

export default ResubmitModal;
