import React, { useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { useClickAway } from "react-use";
import { Overlay } from "components/Overlay";
import Header from "./Header";
import Buttons from "./Buttons";
import DepositRequired from "./DepositRequired";
import { StyledModal } from "./StyledModal";
import Info from "./Info";
import { IBaseModal } from ".";
import { useAccount, useBalance, usePublicClient } from "wagmi";
import {
  useCurateV2AddItem,
  useCurateV2GetArbitratorExtraData,
  useCurateV2SubmissionBaseDeposit,
  usePrepareCurateV2AddItem,
} from "hooks/contracts/generated";
import { useArbitrationCost } from "hooks/useArbitrationCostFromKlerosCore";
import { wrapWithToast } from "utils/wrapWithToast";
import { useItemDetailsQuery } from "hooks/queries/useItemDetailsQuery";

const ReStyledModal = styled(StyledModal)`
  gap: 32px;
`;

interface ISubmitModal extends IBaseModal {}

const alertMessage = (isItem: boolean) =>
  `When you request ${isItem ? "an item" : "a list"} to be re-submitted it goes to the Pending state for a while.` +
  ` During that time the submission can be challenged starting a dispute. If the ${isItem ? "item" : "list"} is` +
  ` removed the deposit is reimbursed, in case the ${isItem ? "item" : "list"} is not removed the deposit is lost.` +
  ` Make sure you read and understand the Policy before proceeding.`;

const ResubmitModal: React.FC<ISubmitModal> = ({ toggleModal, isItem, registryAddress, itemId, refetch }) => {
  const containerRef = useRef(null);
  useClickAway(containerRef, () => toggleModal());
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [isResubmittingItem, setIsResubmittingItem] = useState(false);
  const { data: userBalance, isLoading: isBalanceLoading } = useBalance({ address });
  const { data: itemData, isLoading: isItemDataLoading } = useItemDetailsQuery(`${itemId}@${registryAddress}`);

  const { data: arbitratorExtraData, isLoading: isLoadingExtradata } = useCurateV2GetArbitratorExtraData({
    // @ts-ignore
    address: registryAddress,
  });

  const { data: removalDeposit, isLoading: isSubmissionDepositLoading } = useCurateV2SubmissionBaseDeposit({
    //@ts-ignore
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

  const isDisabled = useMemo(() => {
    if (!userBalance || !depositRequired) return true;
    return userBalance?.value < depositRequired;
  }, [depositRequired, userBalance]);

  const { config, isError } = usePrepareCurateV2AddItem({
    enabled: address && registryAddress && !isLoading && !isDisabled && !isItemDataLoading,
    //@ts-ignore
    address: registryAddress,
    args: [itemData?.item?.data ?? ""],
    value: depositRequired,
  });

  const { writeAsync: resubmitItem } = useCurateV2AddItem(config);

  return (
    <>
      <Overlay />
      <ReStyledModal ref={containerRef}>
        <Header text={`Resubmit ${isItem ? "Item" : "List"}`} />
        <DepositRequired value={depositRequired ?? 0} />
        <Info alertMessage={alertMessage(isItem)} />
        <Buttons
          buttonText="Resubmit"
          toggleModal={toggleModal}
          isDisabled={isDisabled || isError || isResubmittingItem}
          isLoading={isLoading}
          callback={() => {
            if (!resubmitItem) return;
            setIsResubmittingItem(true);
            wrapWithToast(
              async () =>
                await resubmitItem().then((response) => {
                  return response.hash;
                }),
              publicClient
            )
              .then((res) => {
                console.log({ res });
                refetch();
                toggleModal();
              })
              .catch(() => {})
              .finally(() => setIsResubmittingItem(false));
          }}
        />
      </ReStyledModal>
    </>
  );
};

export default ResubmitModal;
