import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@kleros/ui-components-library";
import { Address } from "viem";
import { useAccount, useBalance, usePublicClient } from "wagmi";
import { useNavigate } from "react-router-dom";

import CheckCircle from "svgs/icons/check-circle-outline.svg";
import ClosedCircleIcon from "components/StyledIcons/ClosedCircleIcon";
import { ListProgress, useSubmitListContext } from "context/SubmitListContext";
import { isUndefined } from "utils/index";
import { wrapWithToast } from "utils/wrapWithToast";
import { formatUnitsWei } from "utils/format";
import {
  areListParamsValid,
  constructListParams,
  createItemFromList,
  retrieveDeployedListAddress,
  retrieveSubmittedListId,
} from "utils/submitListUtils";
import { EnsureChain } from "components/EnsureChain";
import { MAIN_CURATE_ADDRESS } from "src/consts";
import {
  useReadCurateV2GetArbitratorExtraData,
  useReadCurateV2SubmissionBaseDeposit,
  useWriteCurateV2AddItem,
} from "hooks/useContract";
import {
  curateV2Abi,
  useReadKlerosCoreArbitrationCost,
  useSimulateCurateFactoryDeploy,
  useWriteCurateFactoryDeploy,
} from "hooks/contracts/generated";
import { ErrorButtonMessage } from "components/ActionButton/Modal/Buttons/ErrorButtonMessage";

const SubmitListButton: React.FC = () => {
  const navigate = useNavigate();
  const {
    listData,
    listMetadata,
    isSubmittingList,
    setIsSubmittingList,
    progress,
    setProgress,
    resetListData,
    setListData,
  } = useSubmitListContext();
  const publicClient = usePublicClient();
  const { address } = useAccount();
  const [isEstimatingCost, setIsEstimatingCost] = useState(false);
  const [submittedListItemId, setSubmittedListItemId] = useState("");

  const { data: userBalance, isLoading: isBalanceLoading } = useBalance({ address });

  // calculate total cost to submit the list to Curate
  const { data: arbitratorExtraData, isLoading: isLoadingExtradata } = useReadCurateV2GetArbitratorExtraData({
    address: MAIN_CURATE_ADDRESS as `0x${string}`,
  });
  const { data: submissionBaseDeposit } = useReadCurateV2SubmissionBaseDeposit({
    address: MAIN_CURATE_ADDRESS as `0x${string}`,
  });

  const { data: arbitrationCost, isLoading: isLoadingArbCost } = useReadKlerosCoreArbitrationCost({
    query: {
      enabled: !isUndefined(arbitratorExtraData),
    },
    args: [arbitratorExtraData!],
  });

  const totalCostToSubmit = useMemo(() => {
    if (isUndefined(arbitrationCost) || isUndefined(submissionBaseDeposit)) return;

    return (arbitrationCost as bigint) + submissionBaseDeposit;
  }, [arbitrationCost, submissionBaseDeposit]);

  const insufficientBalance = useMemo(
    () => Boolean(totalCostToSubmit && userBalance && totalCostToSubmit > userBalance?.value),
    [userBalance, totalCostToSubmit]
  );

  const listParams = useMemo(() => constructListParams(listData, listMetadata), [listData, listMetadata]);

  const {
    data: config,
    isLoading: isConfigLoading,
    isError: isConfigError,
  } = useSimulateCurateFactoryDeploy({
    query: {
      enabled: areListParamsValid(listParams) && !insufficientBalance,
    },
    args: [
      listParams.governor as `0x${string}`,
      listParams.arbitrator as `0x${string}`,
      listParams.arbitratorExtraData as `0x${string}`,
      listParams.evidenceModule as `0x${string}`,
      listParams.connectedList as `0x${string}`,
      listParams.templateRegistryParams,
      listParams.baseDeposits,
      BigInt(listParams.challengePeriodDuration),
      listParams.relayerContract as `0x${string}`,
      listParams.listMetadata ?? "",
    ],
  });

  const { writeContractAsync: submit } = useWriteCurateFactoryDeploy();

  const { writeContractAsync: submitListToCurate } = useWriteCurateV2AddItem();

  // estimate gas cost
  useEffect(() => {
    const estimateTotalCost = async () => {
      if (!config?.request || isUndefined(totalCostToSubmit) || !address || isUndefined(publicClient)) return;
      setIsEstimatingCost(true);
      const price = await publicClient.getGasPrice();
      const gasRequiredToDeploy = await publicClient.estimateContractGas(config.request);
      const gasRequiredToSubmit = await publicClient.estimateContractGas({
        address: MAIN_CURATE_ADDRESS as `0x${string}`,
        abi: curateV2Abi,
        functionName: "addItem",
        account: address,
        args: [""],
        value: totalCostToSubmit,
      });

      const totalCost = (gasRequiredToDeploy + gasRequiredToSubmit) * price + totalCostToSubmit;
      setListData({ ...listData, deployCost: formatUnitsWei(totalCost) });
      setIsEstimatingCost(false);
    };

    estimateTotalCost();
  }, [config, totalCostToSubmit, publicClient, address]);

  // submit deployed list to Curate
  const submitList = (deployedAddress: Address) => {
    if (!deployedAddress || !submitListToCurate || isUndefined(totalCostToSubmit) || !publicClient) {
      setProgress(ListProgress.Failed);
      return;
    }
    setProgress(ListProgress.ConfirmingSubmit);
    wrapWithToast(
      async () =>
        await submitListToCurate({
          address: MAIN_CURATE_ADDRESS as `0x${string}`,
          args: [createItemFromList(deployedAddress)],
          value: totalCostToSubmit,
        }),
      publicClient
    )
      .then((res) => {
        if (res.status && !isUndefined(res.result)) {
          setProgress(ListProgress.SubmitSuccess);
          const submittedListId = retrieveSubmittedListId(res.result.logs[0]);

          setSubmittedListItemId(`${deployedAddress}-${submittedListId}@${MAIN_CURATE_ADDRESS}`);

          resetListData();
        } else {
          setProgress(ListProgress.Failed);
        }
      })
      .catch(() => {
        setProgress(ListProgress.Failed);
      })
      .finally(() => {
        setIsSubmittingList(false);
      });
  };

  const isButtonDisabled = useMemo(
    () =>
      isSubmittingList ||
      !areListParamsValid(listParams) ||
      isLoadingArbCost ||
      isBalanceLoading ||
      insufficientBalance ||
      isEstimatingCost ||
      isLoadingExtradata ||
      isUndefined(totalCostToSubmit) ||
      isConfigLoading ||
      isConfigError,
    [
      isSubmittingList,
      listParams,
      isLoadingArbCost,
      isBalanceLoading,
      insufficientBalance,
      isEstimatingCost,
      isLoadingExtradata,
      totalCostToSubmit,
      isConfigLoading,
      isConfigError,
    ]
  );

  const handleDeploy = () => {
    if (submit && config && publicClient) {
      setIsSubmittingList(true);
      setProgress(ListProgress.ConfirmingDeploy);
      wrapWithToast(async () => await submit(config.request), publicClient)
        .then((res) => {
          if (res.status && !isUndefined(res.result)) {
            setProgress(ListProgress.Deployed);
            const deployedList = retrieveDeployedListAddress(res.result.logs[3]);
            submitList(deployedList);
          } else {
            setProgress(ListProgress.Failed);
            setIsSubmittingList(false);
          }
        })
        .catch(() => {
          setIsSubmittingList(false);
          setProgress(ListProgress.Failed);
        });
    }
  };
  return progress === ListProgress.SubmitSuccess ? (
    <Button text="View List" onPress={() => navigate(`/lists/${submittedListItemId}/list/1/desc/all`)} />
  ) : (
    <EnsureChain>
      <div>
        <Button
          text="Create List"
          isLoading={
            (isConfigLoading ||
              isLoadingArbCost ||
              isBalanceLoading ||
              isSubmittingList ||
              isEstimatingCost ||
              isLoadingExtradata) &&
            !insufficientBalance
          }
          icon={<CheckCircle className="size-4 mr-2 [&_path]:fill-klerosUIComponentsWhiteBackground" />}
          isDisabled={isButtonDisabled}
          onPress={handleDeploy}
        />
        {insufficientBalance ? (
          <ErrorButtonMessage>
            <ClosedCircleIcon /> Insufficient balance
          </ErrorButtonMessage>
        ) : null}
      </div>
    </EnsureChain>
  );
};

export default SubmitListButton;
