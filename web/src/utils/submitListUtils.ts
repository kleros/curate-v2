import { IList, IListData, IListMetadata, ListField } from "context/SubmitListContext";
import { prepareArbitratorExtradata } from "./prepareArbitratorExtradata";
import { Address, Log, decodeEventLog, isAddress, parseAbi, parseEther, zeroAddress } from "viem";
import { isEmpty, isUndefined } from ".";
import { TEMPLATE_REGISTRY } from "consts/arbitration";
import { ItemDetailsFragment, Status } from "src/graphql/graphql";
import { arbitrum } from "viem/chains";
import { registrationTemplate, removalTemplate, dataMappings } from "@kleros/curate-v2-templates";
import { useAccount } from "wagmi";

export const constructListParams = (listData: IListData, listMetadata: IListMetadata) => {
  const baseTemplate = { ...listData } as IList;

  if (!isUndefined(listMetadata.policyURI) && isEmpty(listMetadata.policyURI)) delete listMetadata.policyURI;
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
  const { address } = useAccount();
  const props: ListField & { value: ReturnType<typeof getMockValueForType> }[] = [];
  for (const column of data.columns) {
    props.push({ ...column, value: getMockValueForType(column.type) });
  }

  return {
    id: "1",
    status: Status.RegistrationRequested,
    disputed: false,
    registerer: {
      id: address ?? (getMockValueForType("address") as string),
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
