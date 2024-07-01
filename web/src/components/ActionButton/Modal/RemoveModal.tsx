import React, { useMemo, useState } from "react";
import styled from "styled-components";
import Header from "./Header";
import Buttons from "./Buttons";
import DepositRequired from "./DepositRequired";
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
import EvidenceUpload, { Evidence } from "./EvidenceUpload";
import { uploadFileToIPFS } from "utils/uploadFileToIPFS";
import Modal from "components/Modal";
import { isUndefined } from "src/utils";

const ReStyledModal = styled(Modal)`
  gap: 32px;
`;

interface IRemoveModal extends IBaseModal {}

const alertMessage = (isItem: boolean) =>
  `When you request ${isItem ? "an item" : "a list"} to be removed it goes to the Pending state for a while.` +
  ` During that time the removal can be challenged starting a dispute. If the ${isItem ? "item" : "list"} is` +
  ` removed the deposit is reimbursed, in case the ${isItem ? "item" : "list"} is not removed the deposit is lost.` +
  ` Make sure you read and understand the Policy before proceeding.`;

const RemoveModal: React.FC<IRemoveModal> = ({ toggleModal, isItem, registryAddress, itemId, refetch }) => {
  const { address } = useAccount();
  const publicClient = usePublicClient();

  const [isEvidenceUploading, setIsEvidenceUploading] = useState(false);
  const [evidence, setEvidence] = useState<Evidence>();
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

  const isEvidenceValid = useMemo(() => evidence?.name !== "" && evidence?.description !== "", [evidence]);

  const isDisabled = useMemo(() => {
    if (!userBalance || !depositRequired || isEvidenceUploading || !isEvidenceValid) return true;
    return userBalance?.value < depositRequired;
  }, [depositRequired, userBalance, isEvidenceUploading, isEvidenceValid]);

  const { config } = usePrepareCurateV2RemoveItem({
    enabled: !isDisabled || !isUndefined(evidence),
    //@ts-ignore
    address: registryAddress,
    functionName: "removeItem",
    args: [itemId as `0x${string}`, JSON.stringify(evidence)],
    value: depositRequired,
  });

  const { writeAsync: removeItem } = useCurateV2RemoveItem(config);
  const isLoading = useMemo(
    () =>
      isBalanceLoading ||
      isLoadingArbCost ||
      isRemovalDepositLoading ||
      isLoadingArbCost ||
      isRemovingItem ||
      isEvidenceUploading,
    [
      isBalanceLoading,
      isLoadingArbCost,
      isRemovalDepositLoading,
      isLoadingExtradata,
      isRemovingItem,
      isEvidenceUploading,
    ]
  );

  return (
    <ReStyledModal {...{ toggleModal }}>
      <Header text={`Remove ${isItem ? "Item" : "List"}`} />
      <DepositRequired value={depositRequired ?? 0} />
      <EvidenceUpload setEvidence={setEvidence} setIsEvidenceUploading={setIsEvidenceUploading} />
      <Info alertMessage={alertMessage(isItem)} />
      <Buttons
        buttonText="Remove"
        toggleModal={toggleModal}
        isDisabled={isDisabled || isRemovingItem}
        isLoading={isLoading}
        callback={() => {
          if (removeItem) {
            setIsRemovingItem(true);
            wrapWithToast(async () => await removeItem().then((response) => response.hash), publicClient)
              .then((res) => {
                refetch();
                toggleModal();
              })
              .finally(() => setIsRemovingItem(false));
          }
        }}
      />
    </ReStyledModal>
  );
};

export default RemoveModal;
