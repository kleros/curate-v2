import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import {
  deployCurate,
  foldHead,
  itemID,
  nextHead,
  Party,
  Status,
  CHALLENGE_PERIOD,
  REQUEST_VALUE,
  Setup,
} from "./helpers";

/// Replays every ItemStatusTransition event of the list from the zero head, checking each emitted head on the way.
async function replayHead(s: Setup): Promise<string> {
  const events = await s.curate.queryFilter(s.curate.filters.ItemStatusTransition());
  let head = ethers.ZeroHash;
  for (const event of events) {
    head = nextHead(head, event.args._itemID, Number(event.args._status));
    expect(event.args._historyHead).to.equal(head);
  }
  return head;
}

describe("CurateV2 historyHead", () => {
  let s: Setup;
  const item = '{"columns":[],"values":{"Name":"one"}}';
  const id = itemID(item);

  beforeEach(async () => {
    s = await deployCurate();
  });

  it("starts at zero and commits the first submission", async () => {
    expect(await s.curate.historyHead()).to.equal(ethers.ZeroHash);

    const expected = nextHead(ethers.ZeroHash, id, Status.RegistrationRequested);
    await expect(s.curate.connect(s.requester).addItem(item, { value: REQUEST_VALUE }))
      .to.emit(s.curate, "ItemStatusTransition")
      .withArgs(id, Status.RegistrationRequested, expected);
    expect(await s.curate.historyHead()).to.equal(expected);
  });

  it("commits every transition of a full lifecycle", async () => {
    await s.curate.connect(s.requester).addItem(item, { value: REQUEST_VALUE });
    await time.increase(CHALLENGE_PERIOD + 1);
    await s.curate.executeRequest(id);
    await s.curate.connect(s.requester).removeItem(id, "", { value: REQUEST_VALUE });
    await s.curate.connect(s.challenger).challengeRequest(id, "", { value: REQUEST_VALUE });
    await s.arbitrator.giveRuling(await s.arbitrator.disputeCount(), Party.Requester);
    expect((await s.curate.getItemInfo(id)).status).to.equal(Status.Absent);

    const expected = foldHead([
      [id, Status.RegistrationRequested],
      [id, Status.Registered],
      [id, Status.ClearingRequested],
      [id, Status.Absent],
    ]);
    expect(await s.curate.historyHead()).to.equal(expected);
    expect(await replayHead(s)).to.equal(expected);
  });

  it("commits rulings that restore the previous status", async () => {
    // Refused to arbitrate: back to Absent.
    await s.curate.connect(s.requester).addItem(item, { value: REQUEST_VALUE });
    await s.curate.connect(s.challenger).challengeRequest(id, "", { value: REQUEST_VALUE });
    await s.arbitrator.giveRuling(await s.arbitrator.disputeCount(), Party.None);
    expect((await s.curate.getItemInfo(id)).status).to.equal(Status.Absent);

    // Challenger wins: back to Absent again.
    await s.curate.connect(s.requester).addItem(item, { value: REQUEST_VALUE });
    await s.curate.connect(s.challenger).challengeRequest(id, "", { value: REQUEST_VALUE });
    await s.arbitrator.giveRuling(await s.arbitrator.disputeCount(), Party.Challenger);
    expect((await s.curate.getItemInfo(id)).status).to.equal(Status.Absent);

    const expected = foldHead([
      [id, Status.RegistrationRequested],
      [id, Status.Absent],
      [id, Status.RegistrationRequested],
      [id, Status.Absent],
    ]);
    expect(await s.curate.historyHead()).to.equal(expected);
    expect(await replayHead(s)).to.equal(expected);
  });

  it("commits direct relayer updates", async () => {
    await s.curate.connect(s.relayer).addItemDirectly(item);
    await s.curate.connect(s.relayer).removeItemDirectly(id);

    const expected = foldHead([
      [id, Status.Registered],
      [id, Status.Absent],
    ]);
    expect(await s.curate.historyHead()).to.equal(expected);
    expect(await replayHead(s)).to.equal(expected);
  });

  it("replays interleaved items to the same head, and detects a missing transition", async () => {
    const items = ["a", "b", "c"].map((name) => `{"columns":[],"values":{"Name":"${name}"}}`);
    const ids = items.map(itemID);

    await s.curate.connect(s.requester).addItem(items[0], { value: REQUEST_VALUE });
    await s.curate.connect(s.requester).addItem(items[1], { value: REQUEST_VALUE });
    await time.increase(CHALLENGE_PERIOD + 1);
    await s.curate.executeRequest(ids[1]);
    await s.curate.connect(s.relayer).addItemDirectly(items[2]);
    await s.curate.executeRequest(ids[0]);
    await s.curate.connect(s.requester).removeItem(ids[1], "", { value: REQUEST_VALUE });

    const transitions: Array<[string, number]> = [
      [ids[0], Status.RegistrationRequested],
      [ids[1], Status.RegistrationRequested],
      [ids[1], Status.Registered],
      [ids[2], Status.Registered],
      [ids[0], Status.Registered],
      [ids[1], Status.ClearingRequested],
    ];
    const expected = foldHead(transitions);
    expect(await s.curate.historyHead()).to.equal(expected);
    expect(await replayHead(s)).to.equal(expected);

    // Dropping any single transition from the replay changes the head.
    for (let i = 0; i < transitions.length; i++) {
      const incomplete = transitions.filter((_, j) => j !== i);
      expect(foldHead(incomplete)).to.not.equal(expected);
    }
  });
});
