import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@kleros/ui-components-library";
import { Address } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import CheckCircle from "svgs/icons/check-circle-outline.svg";
import { ListProgress, useSubmitListContext } from "context/SubmitListContext";
import { useArbitrationCost } from "hooks/useArbitrationCostFromKlerosCore";
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
import { curateV2Abi, useSimulateCurateFactoryDeploy, useWriteCurateFactoryDeploy } from "hooks/contracts/generated";

const StyledCheckCircle = styled(CheckCircle)`
  path {
    fill: ${({ theme }) => theme.whiteBackground};
  }
`;

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

  const listParams = useMemo(() => constructListParams(listData, listMetadata), [listData, listMetadata]);

  const { data: config } = useSimulateCurateFactoryDeploy({
    query: {
      enabled: areListParamsValid(listParams),
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

  // calculate total cost to submit the list to Curate
  const { data: arbitratorExtraData, isLoading: isLoadingExtradata } = useReadCurateV2GetArbitratorExtraData({
    address: MAIN_CURATE_ADDRESS as `0x${string}`,
  });
  const { data: submissionBaseDeposit } = useReadCurateV2SubmissionBaseDeposit({
    address: MAIN_CURATE_ADDRESS as `0x${string}`,
  });
  const { arbitrationCost, isLoading: isLoadingArbCost } = useArbitrationCost(arbitratorExtraData);

  const totalCostToSubmit = useMemo(() => {
    if (!arbitrationCost || !submissionBaseDeposit) return;

    return (arbitrationCost as bigint) + submissionBaseDeposit;
  }, [arbitrationCost, submissionBaseDeposit]);

  // estimate gas cost
  useEffect(() => {
    const estimateTotalCost = async () => {
      if (!config?.request || !totalCostToSubmit || !address || !publicClient) return;
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
    if (!deployedAddress || !submitListToCurate || !totalCostToSubmit || !publicClient) {
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
      isEstimatingCost ||
      isLoadingExtradata ||
      !totalCostToSubmit,
    [isSubmittingList, listParams, isLoadingArbCost, isEstimatingCost, isLoadingExtradata, totalCostToSubmit]
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
    <Button text="View List" onClick={() => navigate(`/lists/${submittedListItemId}/list/1/desc/all`)} />
  ) : (
    <EnsureChain>
      <Button text="Create List" Icon={StyledCheckCircle} disabled={isButtonDisabled} onClick={handleDeploy} />
    </EnsureChain>
  );
};

export default SubmitListButton;
