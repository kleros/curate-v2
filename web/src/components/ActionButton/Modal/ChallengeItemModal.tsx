import React, { useMemo, useState } from "react";
import styled from "styled-components";
import Header from "./Header";
import Buttons from "./Buttons";
import DepositRequired from "./DepositRequired";
import Info from "./Info";
import {
  prepareWriteCurateV2,
  useCurateV2GetArbitratorExtraData,
  useCurateV2RemovalChallengeBaseDeposit,
  useCurateV2SubmissionChallengeBaseDeposit,
} from "hooks/contracts/generated";
import { useArbitrationCost } from "hooks/useArbitrationCostFromKlerosCore";
import { useAccount, useBalance, usePublicClient, useWalletClient } from "wagmi";
import { wrapWithToast } from "utils/wrapWithToast";
import { IBaseModal } from ".";
import EvidenceUpload, { Evidence } from "./EvidenceUpload";
import { uploadFileToIPFS } from "utils/uploadFileToIPFS";
import Modal from "components/Modal";

const ReStyledModal = styled(Modal)`
  gap: 32px;
`;

export enum ChallengeType {
  Submission,
  Removal,
}
interface IChallengeItemModal extends IBaseModal {
  challengeType: ChallengeType;
}

const alertMessage =
  "When you challenge an item a dispute starts. Random jurors are selected to decide if" +
  " the item should be removed or included. In case the challenger wins the deposit is" +
  " reimbursed, in case the challenger loses the deposit is lost. Make sure you read" +
  " and understand the Policy before proceeding.";

const ChallengeItemModal: React.FC<IChallengeItemModal> = ({
  toggleModal,
  itemId,
  registryAddress,
  isItem,
  challengeType,
  refetch,
}) => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [isChallengingItem, setIsChallengingItem] = useState(false);
  const [isEvidenceUploading, setIsEvidenceUploading] = useState(false);
  const [evidence, setEvidence] = useState<Evidence>();

  const { data: userBalance, isLoading: isBalanceLoading } = useBalance({ address });

  const { data: arbitratorExtraData, isLoading: isLoadingExtradata } = useCurateV2GetArbitratorExtraData({
    // @ts-ignore
    address: registryAddress,
  });

  const { data: submissionChallengeDeposit, isLoading: isSubmissionChallengeDepositLoading } =
    //@ts-ignore
    useCurateV2SubmissionChallengeBaseDeposit({ address: registryAddress });

  const { data: removalChallengeDeposit, isLoading: isRemovalChallengeDepositLoading } =
    useCurateV2RemovalChallengeBaseDeposit({
      //@ts-ignore
      address: registryAddress,
    });

  const { arbitrationCost, isLoading: isLoadingArbCost } = useArbitrationCost(arbitratorExtraData);

  const depositRequired = useMemo(() => {
    if (!arbitrationCost || !submissionChallengeDeposit || !removalChallengeDeposit) return 0n;
    return (
      (arbitrationCost as bigint) +
      (challengeType === ChallengeType.Submission ? submissionChallengeDeposit : removalChallengeDeposit)
    );
  }, [arbitrationCost, removalChallengeDeposit, submissionChallengeDeposit]);

  const isEvidenceValid = useMemo(() => evidence?.name !== "" && evidence?.description !== "", [evidence]);

  const isLoading = useMemo(
    () =>
      isBalanceLoading ||
      isLoadingArbCost ||
      isSubmissionChallengeDepositLoading ||
      isRemovalChallengeDepositLoading ||
      isLoadingExtradata ||
      isChallengingItem ||
      isEvidenceUploading,
    [
      isBalanceLoading,
      isLoadingArbCost,
      isSubmissionChallengeDepositLoading,
      isRemovalChallengeDepositLoading,
      isLoadingArbCost,
      isChallengingItem,
      isEvidenceUploading,
    ]
  );

  const isDisabled = useMemo(() => {
    if (!userBalance || !depositRequired || isEvidenceUploading || !isEvidenceValid) return true;
    return userBalance?.value < depositRequired;
  }, [depositRequired, userBalance, isEvidenceUploading, isEvidenceValid]);

  return (
    <ReStyledModal {...{ toggleModal }}>
      <Header text={`Challenge ${isItem ? "Item" : "List"}`} />
      <DepositRequired value={depositRequired} />
      <EvidenceUpload {...{ setEvidence, setIsEvidenceUploading }} />
      <Info alertMessage={alertMessage} />
      <Buttons
        buttonText="Challenge"
        toggleModal={toggleModal}
        isDisabled={isDisabled || isChallengingItem}
        isLoading={isLoading}
        callback={async () => {
          setIsChallengingItem(true);

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
                  functionName: "challengeRequest",
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
            .finally(() => setIsChallengingItem(false));
        }}
      />
    </ReStyledModal>
  );
};

export default ChallengeItemModal;
