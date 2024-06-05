import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@kleros/ui-components-library";
import { Address } from "viem";
import { useAccount, useNetwork, usePublicClient } from "wagmi";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import CheckCircle from "svgs/icons/check-circle-outline.svg";
import { ListProgress, useSubmitListContext } from "context/SubmitListContext";
import { useArbitrationCost } from "hooks/useArbitrationCostFromKlerosCore";
import {
  curateV2ABI,
  curateV2Address,
  useCurateFactoryDeploy,
  useCurateV2AddItem,
  useCurateV2GetArbitratorExtraData,
  useCurateV2SubmissionBaseDeposit,
  usePrepareCurateFactoryDeploy,
} from "hooks/contracts/generated";

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
  const { chain } = useNetwork();
  const [isEstimatingCost, setIsEstimatingCost] = useState(false);
  const [submittedListItemId, setSubmittedListItemId] = useState("");

  const listParams = useMemo(() => constructListParams(listData, listMetadata), [listData, listMetadata]);

  const { data: config } = usePrepareCurateFactoryDeploy({
    enabled: areListParamsValid(listParams),
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

  const { writeAsync: submit } = useCurateFactoryDeploy(config);
  const { writeAsync: submitListToCurate } = useCurateV2AddItem({
    address: MAIN_CURATE_ADDRESS,
  });

  // calculate total cost to submit the list to Curate
  const { data: arbitratorExtraData, isLoading: isLoadingExtradata } = useCurateV2GetArbitratorExtraData();
  const { data: submissionBaseDeposit } = useCurateV2SubmissionBaseDeposit();
  const { arbitrationCost, isLoading: isLoadingArbCost } = useArbitrationCost(arbitratorExtraData);

  const totalCostToSubmit = useMemo(() => {
    if (!arbitrationCost || !submissionBaseDeposit) return;

    return (arbitrationCost as bigint) + submissionBaseDeposit;
  }, [arbitrationCost, submissionBaseDeposit]);

  // estimate gas cost
  useEffect(() => {
    const estimateTotalCost = async () => {
      if (!config?.request || !totalCostToSubmit || !address) return;
      setIsEstimatingCost(true);
      const price = await publicClient.getGasPrice();
      const gasRequiredToDeploy = await publicClient.estimateContractGas(config.request);
      const gasRequiredToSubmit = await publicClient.estimateContractGas({
        address: curateV2Address[chain?.id ?? 421614],
        abi: curateV2ABI,
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
  }, [config, totalCostToSubmit]);

  // submit deployed list to Curate
  const submitList = (deployedAddress: Address) => {
    if (!deployedAddress || !submitListToCurate || !totalCostToSubmit) {
      setProgress(ListProgress.Failed);
    }
    setProgress(ListProgress.ConfirmingSubmit);
    wrapWithToast(
      async () =>
        await submitListToCurate({ args: [createItemFromList(deployedAddress)], value: totalCostToSubmit }).then(
          (response) => {
            return response.hash;
          }
        ),
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
    if (submit) {
      setIsSubmittingList(true);
      setProgress(ListProgress.ConfirmingDeploy);
      wrapWithToast(
        async () =>
          await submit().then((response) => {
            return response.hash;
          }),
        publicClient
      )
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
