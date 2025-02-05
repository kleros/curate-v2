import { task } from "hardhat/config";
import { CurateV2 } from "../typechain-types";
import { registrationTemplate, removalTemplate, dataMappings } from "@kleros/curate-v2-templates";

// WARNING: The Devnet values are hardcoded!
// It needs to be refactored like in the Escrow: https://github.com/kleros/escrow-v2/blob/master/contracts/scripts/setDisputeTemplate.ts

task("setDisputeTemplate", "Sets the dispute template").setAction(async (args, hre) => {
  const { ethers } = hre;
  const curate = (await ethers.getContract("CurateV2")) as CurateV2;
  await curate.changeRegistrationDisputeTemplate(registrationTemplate, dataMappings).then((tx) => tx.wait());
  await curate.changeRemovalDisputeTemplate(removalTemplate, dataMappings).then((tx) => tx.wait());
});
