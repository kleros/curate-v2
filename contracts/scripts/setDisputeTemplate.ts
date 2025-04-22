import { task } from "hardhat/config";
import { CurateFactory, CurateV2 } from "../typechain-types";
import { registrationTemplate, removalTemplate, dataMappings } from "@kleros/curate-v2-templates";

// WARNING: The Devnet values are hardcoded!
// It needs to be refactored like in the Escrow: https://github.com/kleros/escrow-v2/blob/master/contracts/scripts/setDisputeTemplate.ts

task("set-dispute-template", "Sets the dispute template").setAction(async (args, hre) => {
  const { ethers } = hre;
  const deployer = await ethers.getSigners().then((signers) => signers[0].getAddress());

  const changeTemplates = async (curate: CurateV2) => {
    console.log("Changing registration template for", curate.target);
    await curate.changeRegistrationDisputeTemplate(registrationTemplate, dataMappings).then((tx) => tx.wait());

    console.log("Changing removal template for", curate.target);
    await curate.changeRemovalDisputeTemplate(removalTemplate, dataMappings).then((tx) => tx.wait());
  };

  // Update the master copy of CurateV2
  const curateMaster = await ethers.getContract<CurateV2>("CurateV2");
  await changeTemplates(curateMaster);

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

    await changeTemplates(curate);
  }
});
