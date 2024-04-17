import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { HomeChains, isSkipped } from "./utils";
import { CurateFactory, CurateV2 } from "../typechain-types";

const registrationTemplate = `{
  "$schema": "../NewDisputeTemplate.schema.json",
  "title": "Let's do this",
  "description": "We want to do this: %s",
  "question": "Does it comply with the policy?",
  "answers": [
    {
      "title": "Yes",
      "description": "Select this if you agree that it must be done."
    },
    {
      "title": "No",
      "description": "Select this if you do not agree that it must be done."
    }
  ],
  "policyURI": "/ipfs/Qmdvk...rSD6cE/policy.pdf",
  "frontendUrl": "https://kleros-v2.netlify.app/#/cases/%s/overview",
  "arbitratorChainID": "421614",
  "arbitratorAddress": "0xD08Ab99480d02bf9C092828043f611BcDFEA917b",
  "category": "Others",
  "specification": "KIP001",
  "lang": "en_US"
}
`;

const removalTemplate = `{
  "$schema": "../NewDisputeTemplate.schema.json",
  "title": "Let's do this",
  "description": "We want to do this: %s",
  "question": "Should this be removed?",
  "answers": [
    {
      "title": "Yes",
      "description": "Select this if you agree that it must be done."
    },
    {
      "title": "No",
      "description": "Select this if you do not agree that it must be done."
    }
  ],
  "policyURI": "/ipfs/Qmdvk...rSD6cE/policy.pdf",
  "frontendUrl": "https://kleros-v2.netlify.app/#/cases/%s/overview",
  "arbitratorChainID": "421614",
  "arbitratorAddress": "0xD08Ab99480d02bf9C092828043f611BcDFEA917b",
  "category": "Others",
  "specification": "KIP001",
  "lang": "en_US"
}
`;

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
      registrationTemplateParameters: [registrationTemplate, ""],
      removalTemplateParameters: [removalTemplate, ""],
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
