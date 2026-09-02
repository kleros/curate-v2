import { expect } from "chai";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { deployCurate, itemID, Party, Status, CHALLENGE_PERIOD, REQUEST_VALUE, Setup } from "./helpers";

// The plain item lifecycle. Used for the gas report; it does not depend on the history head.
describe("CurateV2 lifecycle", () => {
  let s: Setup;
  const item = '{"columns":[],"values":{"Name":"lifecycle"}}';
  const id = itemID(item);

  beforeEach(async () => {
    s = await deployCurate();
  });

  it("registers, removes, challenges and rules", async () => {
    await s.curate.connect(s.requester).addItem(item, { value: REQUEST_VALUE });
    expect((await s.curate.getItemInfo(id)).status).to.equal(Status.RegistrationRequested);

    await time.increase(CHALLENGE_PERIOD + 1);
    await s.curate.executeRequest(id);
    expect((await s.curate.getItemInfo(id)).status).to.equal(Status.Registered);

    await s.curate.connect(s.requester).removeItem(id, "", { value: REQUEST_VALUE });
    expect((await s.curate.getItemInfo(id)).status).to.equal(Status.ClearingRequested);

    await s.curate.connect(s.challenger).challengeRequest(id, "", { value: REQUEST_VALUE });
    const disputeID = await s.arbitrator.disputeCount();
    await s.arbitrator.giveRuling(disputeID, Party.Challenger);
    expect((await s.curate.getItemInfo(id)).status).to.equal(Status.Registered);
  });

  it("adds and removes directly through the relayer", async () => {
    await s.curate.connect(s.relayer).addItemDirectly(item);
    expect((await s.curate.getItemInfo(id)).status).to.equal(Status.Registered);
    await s.curate.connect(s.relayer).removeItemDirectly(id);
    expect((await s.curate.getItemInfo(id)).status).to.equal(Status.Absent);
  });
});
