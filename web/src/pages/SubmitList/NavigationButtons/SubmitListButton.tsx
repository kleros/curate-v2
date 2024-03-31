import React, { useEffect, useMemo } from "react";
import { Button } from "@kleros/ui-components-library";
import CheckCircle from "svgs/icons/check-circle-outline.svg";
import styled from "styled-components";
import { IList, IListData, IListMetadata, ListProgress, useSubmitListContext } from "context/SubmitListContext";
import { useCurateFactoryDeploy, usePrepareCurateFactoryDeploy } from "hooks/contracts/generated";
import { isUndefined } from "utils/index";
import { wrapWithToast } from "utils/wrapWithToast";
import { usePublicClient } from "wagmi";
import { prepareArbitratorExtradata } from "utils/prepareArbitratorExtradata";
import { isAddress, parseEther, zeroAddress } from "viem";
import { useNavigate } from "react-router-dom";
import { formatUnitsWei } from "utils/format";

const StyledCheckCircle = styled(CheckCircle)`
  path {
    fill: #000;
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

  const listParams = useMemo(() => constructListParams(listData, listMetadata), [listData, listMetadata]);

  const { data: config } = usePrepareCurateFactoryDeploy({
    enabled: areListParamsValid(listParams),
    args: [
      listParams.governor,
      listParams.arbitrator,
      prepareArbitratorExtradata(listData.courtId ?? "1", listData.numberOfJurors),
      listParams.evidenceModule,
      listParams.connectedList,
      listParams.templateRegistryParams,
      listParams.baseDeposits,
      BigInt(listParams.challengePeriodDuration),
      listParams.relayerContract,
      listParams.listMetadata ?? "",
    ],
  });

  const { writeAsync: submit } = useCurateFactoryDeploy(config);

  // estimate gas cost
  useEffect(() => {
    const estimateDeployCost = async () => {
      if (!config?.request) return;
      const price = await publicClient.getGasPrice();
      const gasRequired = await publicClient.estimateContractGas(config.request);

      setListData({ ...listData, deployCost: formatUnitsWei(gasRequired * price) });
    };

    estimateDeployCost();
  }, [config]);

  const isButtonDisabled = useMemo(
    () => isSubmittingList || !areListParamsValid(listParams),
    [isSubmittingList, listParams]
  );

  return progress === ListProgress.Success ? (
    <Button text="View List" onClick={() => navigate("/lists/1/list/1/desc/all")} />
  ) : (
    <Button
      text="Create List"
      Icon={StyledCheckCircle}
      disabled={isButtonDisabled}
      onClick={() => {
        if (submit) {
          setIsSubmittingList(true);
          setProgress(ListProgress.Confirming);
          wrapWithToast(
            async () =>
              await submit().then((response) => {
                setProgress(ListProgress.Confirmed);
                return response.hash;
              }),
            publicClient
          )
            .then((res) => {
              console.log({ res });

              if (res.status && !isUndefined(res.result)) {
                setProgress(ListProgress.Success);
                resetListData();
              } else {
                setProgress(ListProgress.Failed);
              }
            })
            .finally(() => {
              setIsSubmittingList(false);
            });
        }
      }}
    />
  );
};

const constructListParams = (listData: IListData, listMetadata: IListMetadata) => {
  const baseTemplate = { ...listData } as IList;

  if (!isUndefined(listMetadata.policyURI) && listMetadata.policyURI === "") delete listMetadata.policyURI;
  baseTemplate.listMetadata = JSON.stringify(listMetadata);
  baseTemplate.baseDeposits = [
    parseEther(listData.submissionBaseDeposit),
    parseEther(listData.removalBaseDeposit),
    parseEther(listData.submissionChallengeBaseDeposit),
    parseEther(listData.removalChallengeBaseDeposit),
  ];
  baseTemplate.challengePeriodDuration = listData.challengePeriodDuration * 60 * 60;
  baseTemplate.connectedList = listData.connectedList ?? zeroAddress;
  baseTemplate.relayerContract = baseTemplate.relayerContract ?? baseTemplate.governor;

  return baseTemplate;
};

const areListParamsValid = (params: IList) => {
  const areAddressesValid =
    isAddress(params.governor) &&
    isAddress(params.arbitrator) &&
    isAddress(params.connectedList) &&
    isAddress(params.evidenceModule) &&
    isAddress(params.relayerContract) &&
    isAddress(params.templateRegistryParams.templateRegistry);

  return (areAddressesValid && params.challengePeriodDuration && params.listMetadata !== "") as boolean;
};

export default SubmitListButton;
