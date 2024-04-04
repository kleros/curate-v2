import { IList, IListData, IListMetadata } from "context/SubmitListContext";
import { prepareArbitratorExtradata } from "./prepareArbitratorExtradata";
import { Address, Log, decodeEventLog, isAddress, parseAbi, parseEther, zeroAddress } from "viem";
import { isUndefined } from ".";
import { KLEROS_ARBITRATOR, TEMPLATE_REGISTRY } from "~src/consts/arbitration";

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
  baseTemplate.templateRegistryParams = {
    templateRegistry: TEMPLATE_REGISTRY,
    registrationTemplateParameters: [constructRegistrationTemplate(listData, listMetadata), ""],
    removalTemplateParameters: [constructRemovalTemplate(listData, listMetadata), ""],
  };
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

const constructRegistrationTemplate = (listData: IListData, listMetadata: IListMetadata) => {
  return JSON.stringify({
    title: `Add ${
      listMetadata.itemName
        ? isVowel(listMetadata.itemName[0])
          ? `an ${listMetadata.itemName.toLowerCase()}`
          : `a ${listMetadata.itemName.toLowerCase()}`
        : "an item"
    } to ${listMetadata.title}`,
    description: `Someone requested to add ${
      listMetadata.itemName
        ? isVowel(listMetadata.itemName[0])
          ? `an ${listMetadata.itemName.toLowerCase()}`
          : `a ${listMetadata.itemName.toLowerCase()}`
        : "an item"
    } to ${listMetadata.title}`,
    question: `Does the ${
      (listMetadata.itemName && listMetadata.itemName.toLowerCase()) || "item"
    } comply with the required criteria?`,
    answers: [
      {
        title: "Yes, Add It",
        description: `Select this if you think the ${
          (listMetadata.itemName && listMetadata.itemName.toLowerCase()) || "item"
        } complies with the required criteria and should be added.`,
      },
      {
        title: "No, Don't Add It",
        description: `Select this if you think the ${
          (listMetadata.itemName && listMetadata.itemName.toLowerCase()) || "item"
        } does not comply with the required criteria and should not be added.`,
      },
    ],
    category: "Curated Lists",

    policyURI: listMetadata.policyURI,
    frontendUrl: window.origin,
    arbitratorChainID: "421614",
    arbitratorAddress: KLEROS_ARBITRATOR,
  });
};

const constructRemovalTemplate = (listData: IListData, listMetadata: IListMetadata) => {
  return JSON.stringify({
    title: `Remove ${
      listMetadata.itemName
        ? isVowel(listMetadata.itemName[0])
          ? `an ${listMetadata.itemName.toLowerCase()}`
          : `a ${listMetadata.itemName.toLowerCase()}`
        : "an item"
    } to ${listMetadata.title}`,
    description: `Someone requested to remove ${
      listMetadata.itemName
        ? isVowel(listMetadata.itemName[0])
          ? `an ${listMetadata.itemName.toLowerCase()}`
          : `a ${listMetadata.itemName.toLowerCase()}`
        : "an item"
    } to ${listMetadata.title}`,
    question: `Does the ${
      (listMetadata.itemName && listMetadata.itemName.toLowerCase()) || "item"
    } comply with the required criteria?`,
    answers: [
      {
        title: "Yes, Remove It",
        description: `Select this if you think the ${
          (listMetadata.itemName && listMetadata.itemName.toLowerCase()) || "item"
        } does not comply with the required criteria and should not be added.`,
      },
      {
        title: "No, Don't Remove It",
        description: `Select this if you think the ${
          (listMetadata.itemName && listMetadata.itemName.toLowerCase()) || "item"
        } complies with the required criteria and should be added.`,
      },
    ],
    category: "Curated Lists",

    policyURI: listMetadata.policyURI,
    frontendUrl: window.origin,
    arbitratorChainID: "421614",
    arbitratorAddress: KLEROS_ARBITRATOR,
  });
};
const isVowel = (x: string) => /[aeiouAEIOU]/.test(x);
