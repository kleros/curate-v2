import React, { useMemo, useState } from "react";
import styled from "styled-components";
import Header from "./Header";
import Buttons from "./Buttons";
import DepositRequired from "./DepositRequired";
import Info from "./Info";
import { useArbitrationCost } from "hooks/useArbitrationCostFromKlerosCore";
import { useAccount, useBalance, usePublicClient } from "wagmi";
import { wrapWithToast } from "utils/wrapWithToast";
import { IBaseModal } from ".";
import EvidenceUpload, { Evidence } from "./EvidenceUpload";
import Modal from "components/Modal";
import { isUndefined } from "src/utils";
import {
  useReadCurateV2GetArbitratorExtraData,
  useReadCurateV2RemovalChallengeBaseDeposit,
  useReadCurateV2SubmissionChallengeBaseDeposit,
  useSimulateCurateV2ChallengeRequest,
  useWriteCurateV2ChallengeRequest,
} from "hooks/useContract";
import ClosedCircleIcon from "components/StyledIcons/ClosedCircleIcon";
import { ErrorButtonMessage } from "pages/SubmitItem/NavigationButtons/SubmitItemButton";

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

  const [isChallengingItem, setIsChallengingItem] = useState(false);
  const [isEvidenceUploading, setIsEvidenceUploading] = useState(false);
  const [evidence, setEvidence] = useState<Evidence>();

  const { data: userBalance, isLoading: isBalanceLoading } = useBalance({ address });

  const { data: arbitratorExtraData, isLoading: isLoadingExtradata } = useReadCurateV2GetArbitratorExtraData({
    address: registryAddress,
  });

  const { data: submissionChallengeDeposit, isLoading: isSubmissionChallengeDepositLoading } =
    useReadCurateV2SubmissionChallengeBaseDeposit({ address: registryAddress });

  const { data: removalChallengeDeposit, isLoading: isRemovalChallengeDepositLoading } =
    useReadCurateV2RemovalChallengeBaseDeposit({
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

  const insufficientBalance = useMemo(() => {
    if (!userBalance || !depositRequired) return true;
    return Boolean(userBalance?.value < depositRequired);
  }, [userBalance, depositRequired]);

  const isDisabled = useMemo(() => {
    if (!userBalance || !depositRequired || isEvidenceUploading || !isEvidenceValid) return true;
    return userBalance?.value < depositRequired;
  }, [depositRequired, userBalance, isEvidenceUploading, isEvidenceValid]);

  const {
    data: config,
    isLoading: isConfigLoading,
    isError: isConfigError,
  } = useSimulateCurateV2ChallengeRequest({
    query: { enabled: !isUndefined(itemId) && !isUndefined(evidence) && !isDisabled },
    address: registryAddress,
    args: [itemId as `0x${string}`, JSON.stringify(evidence)],
    value: depositRequired,
  });

  const { writeContractAsync: challengeRequest } = useWriteCurateV2ChallengeRequest();

  const isLoading = useMemo(
    () =>
      isBalanceLoading ||
      isLoadingArbCost ||
      isSubmissionChallengeDepositLoading ||
      isRemovalChallengeDepositLoading ||
      isLoadingExtradata ||
      isChallengingItem ||
      isEvidenceUploading ||
      isConfigLoading,
    [
      isBalanceLoading,
      isLoadingArbCost,
      isSubmissionChallengeDepositLoading,
      isRemovalChallengeDepositLoading,
      isLoadingExtradata,
      isChallengingItem,
      isEvidenceUploading,
      isConfigLoading,
    ]
  );

  return (
    <ReStyledModal {...{ toggleModal }}>
      <Header text={`Challenge ${isItem ? "Item" : "List"}`} />
      <DepositRequired value={depositRequired} />
      <EvidenceUpload {...{ setEvidence, setIsEvidenceUploading }} />
      <Info alertMessage={alertMessage} />
      <div>
        <Buttons
          buttonText="Challenge"
          toggleModal={toggleModal}
          isDisabled={isDisabled || isChallengingItem || isConfigError}
          isLoading={isLoading}
          callback={() => {
            if (challengeRequest && publicClient && config) {
              setIsChallengingItem(true);
              wrapWithToast(async () => await challengeRequest(config.request), publicClient)
                .then(() => {
                  refetch();
                  toggleModal();
                })
                .finally(() => setIsChallengingItem(false));
            }
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

export default ChallengeItemModal;
