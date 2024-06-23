import { IList, IListData, IListMetadata, ListField } from "context/SubmitListContext";
import { prepareArbitratorExtradata } from "./prepareArbitratorExtradata";
import { Address, Log, decodeEventLog, isAddress, parseAbi, parseEther, zeroAddress } from "viem";
import { isUndefined } from ".";
import { TEMPLATE_REGISTRY } from "consts/arbitration";
import { ItemDetailsFragment, Status } from "src/graphql/graphql";
import { arbitrum } from "viem/chains";

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
    registrationTemplateParameters: [registrationTemplate, dataMappings],
    removalTemplateParameters: [removalTemplate, dataMappings],
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
  return JSON.stringify({
    columns: [
      {
        label: "List",
        description: "The List address",
        type: "address",
        isIdentifier: true,
      },
    ],
    values: {
      List: listAddress?.toString().toLowerCase(),
    },
  });
};

export const retrieveDeployedListAddress = (eventLog: Log) =>
  decodeEventLog({
    abi: parseAbi(["event NewList(address indexed _address)"]),
    data: eventLog.data,
    topics: eventLog.topics,
  }).args._address;

export const retrieveSubmittedListId = (eventLog: Log) =>
  decodeEventLog({
    abi: parseAbi(["event NewItem(bytes32 indexed _itemID, string _data, bool _addedDirectly)"]),
    data: eventLog.data,
    topics: eventLog.topics,
  }).args._itemID;

export const constructItemWithMockValues = (data: IListMetadata): ItemDetailsFragment => {
  const props: ListField & { value: ReturnType<typeof getMockValueForType> }[] = [];
  for (const column of data.columns) {
    props.push({ ...column, value: getMockValueForType(column.type) });
  }

  return {
    id: "1",
    status: Status.RegistrationRequested,
    disputed: false,
    registerer: {
      id: getMockValueForType("address") as string,
    },
    props,
  };
};

const getMockValueForType = (type: string) => {
  switch (type) {
    case "text":
      return "Ethereum";
    case "longText":
      return "Lorem ipsum dolor sit amet, consectetur amet";
    case "address":
      return "0x922911F4f80a569a4425fa083456239838F7F003";
    case "link":
      return "https://kleros.io/";
    case "image":
      return "ipfs://QmWfxEmfEWwM6LDgER2Qp2XZpK1MbDtNp7uGqCS4UPNtgJ/symbol-CURATE.png";
    case "file":
      return "/ipfs/QmU4X2mjdi7QtcV8TnDKzvR782oDZbKkFPrRLPQnHjy8SW/PoH Origin Constitution (final draft).pdf";
    case "number":
      return 21;
    case "boolean":
      return true;
    case "chain":
      return arbitrum.id.toString();
    default:
      return "Ethereum";
  }
};

const sharedTemplateProperties = `
  "policyURI": "{{{policyURI}}}",
  "frontendUrl": "https://curate-v2.kleros.builders/#/lists/item/{{itemID}}",
  "arbitrableChainID": "421614",
  "arbitrableAddress": "{{arbitrableAddress}}",
  "arbitratorChainID": "421614",
  "arbitratorAddress": "0xD08Ab99480d02bf9C092828043f611BcDFEA917b",
  "metadata": {
    "itemName": "{{itemName}}",
    "itemDescription": "{{itemDescription}}",
    "registryTitle": "{{registryTitle}}",
    "registryDescription": "{{registryDescription}}"
  },
  "category": "Curated Lists",
  "version": "1.0"`;

const registrationTemplate = `{
  "$schema": "../NewDisputeTemplate.schema.json",
  "title": "Add a {{itemName}} to {{registryTitle}}",
  "description": "Someone requested to add an {{itemName}} to {{registryTitle}}",
  "question": "Does the {{itemName}} comply with the required criteria?",
  "answers": [
    {
      "title": "Yes, Add It",
      "description": "Select this if you think that the {{itemName}} does comply with the required criteria and should be added."
    },
    {
      "title": "No, Don't Add It",
      "description": "Select this if you think that the {{itemName}} does not comply with the required criteria and should not be added."
    }
  ], ${sharedTemplateProperties}
}
`;

const removalTemplate = `{
  "$schema": "../NewDisputeTemplate.schema.json",
  "title": "Remove a {{itemName}} from {{registryTitle}}",
  "description": "Someone requested to remove a {{itemName}} from {{registryTitle}}",
  "question": "Does the {{itemName}} comply with the required criteria?",
  "answers": [
    {
      "title": "Yes, Remove It",
      "description": "Select this if you think that the {{itemName}} does not comply with the required criteria and should be removed."
    },
    {
      "title": "No, Don't Remove It",
      "description": "Select this if you think that the {{itemName}} does comply with the required criteria and should not be removed."
    }
  ], ${sharedTemplateProperties}
}
`;

const dataMappings = `[
  {
    "type": "graphql",
    "endpoint": "https://gateway-arbitrum.network.thegraph.com/api/{{{graphApiKey}}}/subgraphs/id/H93eWJbDpYKAtkLmsMn7Su3ZLZwAwLN5VoyvQH4NbGAv",
    "query": "query SearchRequestByDisputeID($externalDisputeID: BigInt!) { requests(where: { externalDisputeID: $externalDisputeID }) { id disputeID submissionTime resolved requester { id } challenger { id } arbitrator arbitratorExtraData deposit disputeOutcome requestType item { id itemID data status registry { id title description policyURI } } } }",
    "variables": {
      "externalDisputeID": "{{externalDisputeID}}"
    },
    "seek": [
      "requests[0].item.registry.title",
      "requests[0].item.registry.description",
      "requests[0].item.registry.policyURI",
      "requests[0].item.id",
      "requests[0].item.data",
      "requests[0].item.status",
      "requests[0].item.registry.id"
    ],
    "populate": [
      "registryTitle",
      "registryDescription",
      "policyURI",
      "itemID",
      "itemData",
      "itemStatus",
      "listAddress"
    ]
  },
  {
    "type": "json",
    "value": "{{{itemData}}}",
    "seek": [
      "columns[0].label",
      "columns[0].description"
    ],
    "populate": [
      "itemName",
      "itemDescription"
    ]
  }
]`;
