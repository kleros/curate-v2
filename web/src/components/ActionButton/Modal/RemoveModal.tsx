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
import { useAccount, useBalance, usePublicClient, useWalletClient } from "wagmi";
import {
  prepareWriteCurateV2,
  useCurateV2GetArbitratorExtraData,
  useCurateV2RemovalBaseDeposit,
} from "hooks/contracts/generated";
import { useArbitrationCost } from "hooks/useArbitrationCostFromKlerosCore";
import { wrapWithToast } from "utils/wrapWithToast";
import EvidenceUpload, { Evidence } from "./EvidenceUpload";
import { uploadFileToIPFS } from "utils/uploadFileToIPFS";

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
  const { data: walletClient } = useWalletClient();

  const [isRemovingItem, setIsRemovingItem] = useState(false);
  const [isEvidenceUploading, setIsEvidenceUploading] = useState(false);
  const [evidence, setEvidence] = useState<Evidence>();

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

  const isDisabled = useMemo(() => {
    if (!userBalance || !depositRequired || isEvidenceUploading || !isEvidenceValid) return true;
    return userBalance?.value < depositRequired;
  }, [depositRequired, userBalance, isEvidenceUploading, isEvidenceValid]);

  return (
    <>
      <Overlay />
      <ReStyledModal ref={containerRef}>
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
            setIsRemovingItem(true);

            const evidenceFile = new File([JSON.stringify(evidence)], "evidence.json", {
              type: "application/json",
            });

            uploadFileToIPFS(evidenceFile)
              .then(async (res) => {
                if (res.status === 200 && walletClient) {
                  const response = await res.json();
                  const fileURI = response["cids"][0];

                  const { request } = await prepareWriteCurateV2({
                    //@ts-ignore
                    address: registryAddress,
                    functionName: "removeItem",
                    args: [itemId as `0x${string}`, fileURI],
                    value: depositRequired,
                  });

                  wrapWithToast(async () => await walletClient.writeContract(request), publicClient).then((res) => {
                    console.log({ res });
                    refetch();
                    toggleModal();
                  });
                }
              })
              .catch((err) => console.log(err))
              .finally(() => setIsRemovingItem(false));
          }}
        />
      </ReStyledModal>
    </>
  );
};

export default RemoveModal;
