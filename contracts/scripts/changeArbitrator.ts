import { task } from "hardhat/config";
import { CurateFactory, CurateV2 } from "../typechain-types";
import { DeploymentName, getContractsEthers } from "@kleros/kleros-v2-contracts";

const NETWORK_TO_DEPLOYMENT: Record<string, DeploymentName> = {
  arbitrumSepoliaDevnet: "devnet",
  arbitrumSepolia: "testnet",
  arbitrum: "mainnetNeo",
} as const;

task("change-arbitrator", "Changes the arbitrator").setAction(async (args, hre) => {
  const { ethers, deployments } = hre;
  const deployer = await ethers.getSigners().then((signers) => signers[0].getAddress());
  const networkName = deployments.getNetworkName();
  const deploymentName = NETWORK_TO_DEPLOYMENT[networkName];
  const { klerosCore, evidence } = await getContractsEthers(ethers.provider, deploymentName);

  const changeArbitrator = async (curate: CurateV2) => {
    const extraData = await curate.getArbitratorExtraData();
    console.log("Changing the arbitrator for", curate.target);
    console.log("klerosCore.target", klerosCore.target);
    console.log("extraData", extraData);
    console.log("evidence.target", evidence.target);
    const tx = await curate
      .changeArbitrationParams(klerosCore.target, extraData, evidence.target)
      .then((tx) => tx.wait());
    console.log("Arbitration params changed", tx?.hash);
  };

  // Update the master copy of CurateV2
  console.log("Updating the CurateV2 master copy...");
  const curateMaster = await ethers.getContract<CurateV2>("CurateV2");
  await changeArbitrator(curateMaster);

  // Update every curated lists created by the factory
  const factory = await ethers.getContract<CurateFactory>("CurateFactory");
  const events = await factory.queryFilter(factory.filters.NewList(), 0, "latest");
  console.log(`Found ${events.length} NewList events:`);
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const curate = await ethers.getContractAtWithSignerAddress<CurateV2>("CurateV2", event.args._address, deployer);
    const governor = await curate.governor();
    console.log(
      `${i + 1}. List address: ${
        curate.target
      }, governor: ${governor}, templateIdRegistration: ${await curate.templateIdRegistration()}, templateIdRemoval: ${await curate.templateIdRemoval()}`
    );

    if (deployer.toLowerCase() !== governor.toLowerCase()) {
      console.log(`Skipping curate ${curate.target} - signer ${deployer} is not the governor ${governor}`);
      continue;
    }

    await changeArbitrator(curate);
  }

  hre.run("set-dispute-template");
});
