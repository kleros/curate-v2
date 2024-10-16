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
import EvidenceUpload, { Evidence } from "./EvidenceUpload";
import Modal from "components/Modal";
import { isUndefined } from "src/utils";
import {
  useReadCurateV2GetArbitratorExtraData,
  useReadCurateV2RemovalBaseDeposit,
  useSimulateCurateV2RemoveItem,
  useWriteCurateV2RemoveItem,
} from "hooks/useContract";

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

  const { data: arbitratorExtraData, isLoading: isLoadingExtradata } = useReadCurateV2GetArbitratorExtraData({
    address: registryAddress,
  });

  const { data: removalDeposit, isLoading: isRemovalDepositLoading } = useReadCurateV2RemovalBaseDeposit({
    address: registryAddress,
  });

  const { arbitrationCost, isLoading: isLoadingArbCost } = useArbitrationCost(arbitratorExtraData);

  const depositRequired = useMemo(() => {
    if (!arbitrationCost || !removalDeposit) return 0n;
    return (arbitrationCost as bigint) + removalDeposit;
  }, [arbitrationCost, removalDeposit]);

  const isEvidenceValid = useMemo(() => evidence?.name !== "" && evidence?.description !== "", [evidence]);

  const insufficientBalance = useMemo(() => {
    if (!userBalance || !depositRequired) return true;
    return userBalance?.value < depositRequired;
  }, [userBalance, depositRequired]);

  const isDisabled = useMemo(() => {
    if (!userBalance || !depositRequired || isEvidenceUploading || !isEvidenceValid) return true;
    return userBalance?.value < depositRequired;
  }, [depositRequired, userBalance, isEvidenceUploading, isEvidenceValid]);

  const {
    data: config,
    isLoading: isConfigLoading,
    isError: isConfigError,
  } = useSimulateCurateV2RemoveItem({
    query: { enabled: !isDisabled && !isUndefined(evidence) },
    address: registryAddress,
    args: [itemId as `0x${string}`, JSON.stringify(evidence)],
    value: depositRequired,
  });

  const { writeContractAsync: removeItem } = useWriteCurateV2RemoveItem();

  const isLoading = useMemo(() => {
    return (
      isBalanceLoading ||
      isRemovalDepositLoading ||
      isLoadingExtradata ||
      isRemovingItem ||
      isEvidenceUploading ||
      isConfigLoading ||
      isLoadingArbCost
    );
  }, [
    isBalanceLoading,
    isLoadingArbCost,
    isRemovalDepositLoading,
    isLoadingExtradata,
    isRemovingItem,
    isEvidenceUploading,
    isConfigLoading,
  ]);

  return (
    <ReStyledModal {...{ toggleModal }}>
      <Header text={`Remove ${isItem ? "Item" : "List"}`} />
      <DepositRequired value={depositRequired ?? 0} />
      <EvidenceUpload setEvidence={setEvidence} setIsEvidenceUploading={setIsEvidenceUploading} />
      <Info alertMessage={alertMessage(isItem)} />
      <div>
        <Buttons
          buttonText="Remove"
          isDisabled={isDisabled || isLoading || isRemovingItem || isConfigError || insufficientBalance}
          isLoading={isLoading && !insufficientBalance}
          callback={() => {
            if (removeItem && publicClient && config) {
              setIsRemovingItem(true);
              wrapWithToast(async () => await removeItem(config.request), publicClient)
                .then((res) => {
                  refetch();
                  toggleModal();
                })
                .finally(() => setIsRemovingItem(false));
            }
          }}
          {...{ toggleModal, insufficientBalance }}
        />
      </div>
    </ReStyledModal>
  );
};

export default RemoveModal;
