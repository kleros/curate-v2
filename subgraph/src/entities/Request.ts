import { log } from "@graphprotocol/graph-ts";
import { Item, Registry, Request } from "../../generated/schema";
import { Curate, RequestSubmitted } from "../../generated/templates/Curate/Curate";
import { NONE, ONE, ZERO } from "../utils";
import { ensureCounter } from "./Counters";
import { ensureUser } from "./User";

export function createRequestFromEvent(event: RequestSubmitted): void {
  let graphItemID = event.params._itemID.toHexString() + "@" + event.address.toHexString();

  let curate = Curate.bind(event.address);
  let item = Item.load(graphItemID);
  if (!item) {
    log.error(`Item for graphItemID {} not found.`, [graphItemID]);
    return;
  }

  const requestIndex = item.numberOfRequests.minus(ONE);
  const requestID = graphItemID + "-" + requestIndex.toString();
  const request = new Request(requestID);
  request.disputed = false;
  request.arbitrator = curate.getArbitrator();
  request.arbitratorExtraData = curate.getArbitratorExtraData();
  request.requester = ensureUser(event.transaction.from.toHexString()).id;
  request.item = item.id;
  request.registry = event.address.toHexString();
  request.registryAddress = event.address;
  request.resolutionTime = ZERO;
  request.disputeOutcome = NONE;
  request.resolved = false;
  request.submissionTime = event.block.timestamp;
  request.requestType = item.status;
  request.creationTx = event.transaction.hash;

  let counter = ensureCounter();
  let deposit = item.status.includes("registrationRequested")
    ? curate.submissionBaseDeposit()
    : curate.removalBaseDeposit();
  request.deposit = deposit;
  counter.totalDeposits = counter.totalDeposits.plus(deposit);

  counter.save();
  request.save();
}
