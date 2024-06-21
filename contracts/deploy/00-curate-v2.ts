import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { HomeChains, isSkipped } from "./utils";
import { CurateFactory, CurateV2 } from "../typechain-types";

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

const listMetadata = `{
  "title": "Kleros Curate",
  "description": "A list of all curated lists on Curate V2",
  "columns": [
    {
      "label": "Address",
      "description": "The list title.",
      "type": "address",
      "isIdentifier": true
    }
  ],
  "itemName": "list",
  "itemNamePlural": "lists",
  "logoURI": "/ipfs/QmQN9ZPubns9kpW3jxZefyt8sNbeUzj8KEcsT7i81SiXFf/standard-impact-logo-.png",
  "policyURI": "/ipfs/QmWciZMi8mBJg34FapRHK4Yh7a6UqmxrpcKQ3KRNMXzjfx",
  "isListofLists": true
}`;

// General court, 3 jurors
const extraData =
  "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000003";

const deploy: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts, getChainId } = hre;
  const { deploy } = deployments;

  // fallback to hardhat node signers on local network
  const deployer = (await getNamedAccounts()).deployer ?? (await hre.ethers.getSigners())[0].address;
  const chainId = Number(await getChainId());
  console.log("deploying to %s with deployer %s", HomeChains[chainId], deployer);

  const klerosCore = await deployments.get("KlerosCore");
  const evidenceModule = await deployments.get("EvidenceModule");
  const disputeTemplateRegistry = await deployments.get("DisputeTemplateRegistry");
  const fee = ethers.parseEther("0.00001");
  const timeout = 600; // 10 minutes

  // TODO: use OZ's initializer
  const curateAddress = await deploy("CurateV2", {
    from: deployer,
    args: [],
    log: true,
  }).then((c) => c.address);

  const curate = (await ethers.getContract("CurateV2")) as CurateV2;
  await curate.initialize(
    deployer,
    klerosCore.address,
    extraData,
    evidenceModule.address,
    ethers.ZeroAddress, // _connectedTCR
    {
      templateRegistry: disputeTemplateRegistry.address,
      registrationTemplateParameters: [registrationTemplate, dataMappings],
      removalTemplateParameters: [removalTemplate, dataMappings],
    },
    [fee, fee, fee, fee],
    timeout,
    deployer,
    listMetadata
  );

  await deploy("CurateFactory", {
    from: deployer,
    args: [curateAddress],
    log: true,
  });

  const curateFactory = (await ethers.getContract("CurateFactory")) as CurateFactory;
  await curateFactory.deploy(
    deployer,
    klerosCore.address,
    extraData,
    evidenceModule.address,
    ethers.ZeroAddress, // _connectedTCR
    {
      templateRegistry: disputeTemplateRegistry.address,
      registrationTemplateParameters: [registrationTemplate, ""],
      removalTemplateParameters: [removalTemplate, ""],
    },
    [fee, fee, fee, fee],
    timeout,
    deployer,
    listMetadata
  );

  await deploy("CurateView", {
    from: deployer,
    args: [],
    log: true,
  });
};

deploy.tags = ["CurateV2"];
deploy.skip = async ({ network }) => {
  return isSkipped(network, !HomeChains[network.config.chainId ?? 0]);
};

export default deploy;
