import { IList, IListData, IListMetadata } from "context/SubmitListContext";
import { prepareArbitratorExtradata } from "./prepareArbitratorExtradata";
import { Address, Log, decodeEventLog, isAddress, parseAbi, parseEther, zeroAddress } from "viem";
import { isUndefined } from ".";

export const constructListParams = (listData: IListData, listMetadata: IListMetadata) => {
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
  baseTemplate.arbitratorExtraData = prepareArbitratorExtradata(listData.courtId ?? "1", listData.numberOfJurors) ?? "";

  return baseTemplate;
};

export const areListParamsValid = (params: IList) => {
  const areAddressesValid =
    isAddress(params.governor) &&
    isAddress(params.arbitrator) &&
    isAddress(params.connectedList) &&
    isAddress(params.evidenceModule) &&
    isAddress(params.relayerContract) &&
    isAddress(params.templateRegistryParams.templateRegistry);

  return (areAddressesValid && params.challengePeriodDuration && params.listMetadata !== "") as boolean;
};

export const createItemFromList = (listAddress?: Address) => {
  return `{
      "columns": [
        {
          "label": "List",
          "description": "The List address",
          "type": "address",
          "isIdentifier": true
        }
      ],
      "values": {
        "Logo": ${listAddress},
      }
    }`;
};

export const retrieveDeployedListAddress = (eventLog: Log) =>
  decodeEventLog({
    abi: parseAbi(["event NewList(address indexed _address)"]),
    data: eventLog.data,
    topics: eventLog.topics,
  }).args._address;
