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
  useCurateV2GetArbitratorExtraData,
  useCurateV2RemovalBaseDeposit,
  useCurateV2RemoveItem,
  usePrepareCurateV2RemoveItem,
} from "hooks/contracts/generated";
import { useArbitrationCost } from "hooks/useArbitrationCostFromKlerosCore";
import { wrapWithToast } from "utils/wrapWithToast";

const ReStyledModal = styled(StyledModal)`
  gap: 32px;
`;

interface IRemoveModal extends IBaseModal {}

const alertMessage = (isItem: boolean) =>
  `When you request ${isItem ? "an item" : "a list"} to be removed it goes to the Pending state for a while.` +
  ` During that time the removal can be challenged starting a dispute. If the ${isItem ? "item" : "list"} is` +
  ` removed the deposit is reimbursed, in case the ${isItem ? "item" : "list"} is not removed the deposit is lost.` +
  ` Make sure you read and understand the Policy before proceeding.`;

const RemoveModal: React.FC<IRemoveModal> = ({ toggleModal, isItem, registryAddress, itemId, refetch }) => {
  const containerRef = useRef(null);
  useClickAway(containerRef, () => toggleModal());
  const { address } = useAccount();
  const publicClient = usePublicClient();

  const [isRemovingItem, setIsRemovingItem] = useState(false);

  const { data: userBalance, isLoading: isBalanceLoading } = useBalance({ address });

  const { data: arbitratorExtraData, isLoading: isLoadingExtradata } = useCurateV2GetArbitratorExtraData({
    //@ts-ignore
    address: registryAddress,
  });

  const { data: removalDeposit, isLoading: isRemovalDepositLoading } = useCurateV2RemovalBaseDeposit({
    //@ts-ignore
    address: registryAddress,
  });

  const { arbitrationCost, isLoading: isLoadingArbCost } = useArbitrationCost(arbitratorExtraData);

  const depositRequired = useMemo(() => {
    if (!arbitrationCost || !removalDeposit) return 0n;
    return (arbitrationCost as bigint) + removalDeposit;
  }, [arbitrationCost, removalDeposit]);

  const isLoading = useMemo(
    () => isBalanceLoading || isLoadingArbCost || isRemovalDepositLoading || isLoadingArbCost || isRemovingItem,
    [isBalanceLoading, isLoadingArbCost, isRemovalDepositLoading, isLoadingExtradata, isRemovingItem]
  );

  const isDisabled = useMemo(() => {
    if (!userBalance || !depositRequired) return true;
    return userBalance?.value < depositRequired;
  }, [depositRequired, userBalance]);

  const { config, isError } = usePrepareCurateV2RemoveItem({
    enabled: address && registryAddress && !isLoading && !isDisabled,
    //@ts-ignore
    address: registryAddress,
    args: [itemId as `0x${string}`, "{}"],
    value: depositRequired,
  });

  const { writeAsync: removeItem } = useCurateV2RemoveItem(config);

  return (
    <>
      <Overlay />
      <ReStyledModal ref={containerRef}>
        <Header text={`Remove ${isItem ? "Item" : "List"}`} />
        <DepositRequired value={depositRequired ?? 0} />
        <Info alertMessage={alertMessage(isItem)} />
        <Buttons
          buttonText="Remove"
          toggleModal={toggleModal}
          isDisabled={isDisabled || isError || isRemovingItem}
          isLoading={isLoading}
          callback={() => {
            if (!removeItem) return;
            setIsRemovingItem(true);
            wrapWithToast(
              async () =>
                await removeItem().then((response) => {
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
              .finally(() => setIsRemovingItem(false));
          }}
        />
      </ReStyledModal>
    </>
  );
};

export default RemoveModal;
