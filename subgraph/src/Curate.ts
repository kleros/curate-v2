/* eslint-disable prefer-const */
import { Bytes, BigInt, Address, log } from "@graphprotocol/graph-ts";
import { Item, ItemProp, Request, Round, Registry, Contribution, EvidenceGroup } from "../generated/schema";

import {
  ItemStatusChange,
  RequestSubmitted,
  NewItem,
  Ruling,
  ConnectedTCRSet as ConnectedTCRSetEvent,
  Curate,
} from "../generated/templates/Curate/Curate";
import {
  CLEARING_REQUESTED_CODE,
  NONE,
  ONE,
  REGISTRATION_REQUESTED_CODE,
  ZERO,
  ZERO_ADDRESS,
  getExtendedStatus,
  getFinalRuling,
  getStatus,
} from "./utils";
import { updateCounters } from "./Counters";
import { createRequestFromEvent } from "./entities/Request";
import { createItemFromEvent } from "./entities/Item";

// Items on a TCR can be in 1 of 4 states:
// - (0) Absent: The item is not registered on the TCR and there are no pending requests.
// - (1) Registered: The item is registered and there are no pending requests.
// - (2) Registration Requested: The item is not registered on the TCR, but there is a pending
//       registration request.
// - (3) Clearing Requested: The item is registered on the TCR, but there is a pending removal
//       request. These are sometimes also called removal requests.
//
// Registration and removal requests can be challenged. Once the request resolves (either by
// passing the challenge period or via dispute resolution), the item state is updated to 0 or 1.
// Note that in this mapping, we also use extended status, which just map the combination
// of the item status and disputed status.
//
// A variable naming convention regarding arrays and entities:
// Index: This is the position of the in-contract array.
// ID: This is the entity id.
//
// Example:
// requestIndex: 0
// requestID: <itemID>@<tcrAddress>-0
//
// The only exception to this rule is the itemID, which is the in-contract itemID.
//
// TIP: Before reading an event handler for the very first time, we recommend
// looking at where that event is emitted in the contract. Remember that
// the order in which events are emitted define the order in which
// handlers are run.

export function handleNewItem(event: NewItem): void {
  createItemFromEvent(event);
}

export function handleRequestSubmitted(event: RequestSubmitted): void {
  let graphItemID = event.params._itemID.toHexString() + "@" + event.address.toHexString();

  let curate = Curate.bind(event.address);
  let itemInfo = curate.getItemInfo(event.params._itemID);

  let item = Item.load(graphItemID);
  if (!item) {
    log.error(`Item for graphItemID {} not found.`, [graphItemID]);
    return;
  }

  // `previousStatus` and `newStatus` are used for accounting.
  // Note that if this is the very first request of an item,
  // item.status and item.dispute are dirty because they were set by
  // handleNewItem, executed before this handler and so `previousStatus`
  // would be wrong. We use a condition to detect if its the very
  // first request and if so, ignore its contents (see below in accounting).
  let previousStatus = getExtendedStatus(item.disputed, item.status);
  let newStatus = getExtendedStatus(item.disputed, item.status);

  item.numberOfRequests = item.numberOfRequests.plus(ONE);
  item.status = getStatus(itemInfo.value0);
  item.latestRequester = event.transaction.from;
  item.latestRequestResolutionTime = ZERO;
  item.latestRequestSubmissionTime = event.block.timestamp;

  createRequestFromEvent(event);

  // Accounting.
  if (itemInfo.value1.equals(ONE)) {
    let registry = Registry.load(event.address.toHexString());
    if (!registry) {
      log.error(`Registry at address {} not found`, [event.address.toHexString()]);
      return;
    }
    // This is the first request for this item, which must be
    // a registration request.
    registry.numberOfRegistrationRequested = registry.numberOfRegistrationRequested.plus(ONE);
    registry.save();
  } else {
    updateCounters(previousStatus, newStatus, event.address);
  }
  item.save();
}

export function handleStatusUpdated(event: ItemStatusChange): void {
  // This handler is used to handle transations to item statuses 0 and 1.
  // All other status updates are handled elsewhere.
  let curate = Curate.bind(event.address);
  let itemInfo = curate.getItemInfo(event.params._itemID);
  if (itemInfo.value0 == REGISTRATION_REQUESTED_CODE || itemInfo.value0 == CLEARING_REQUESTED_CODE) {
    // Request not yet resolved. No-op as changes are handled
    // elsewhere.
    return;
  }

  let graphItemID = event.params._itemID.toHexString() + "@" + event.address.toHexString();
  let item = Item.load(graphItemID);
  if (!item) {
    log.error(`Item {} not found.`, [graphItemID]);
    return;
  }

  // We take the previous and new extended statuses for accounting purposes.
  let previousStatus = getExtendedStatus(item.disputed, item.status);
  item.status = getStatus(itemInfo.value0);
  item.disputed = false;
  let newStatus = getExtendedStatus(item.disputed, item.status);

  if (previousStatus != newStatus) {
    // Accounting.
    updateCounters(previousStatus, newStatus, event.address);
  }

  if (event.params._updatedDirectly) {
    // Direct actions (e.g. addItemDirectly and removeItemDirectly)
    // don't envolve any requests. Only the item is updated.
    item.save();

    return;
  }
  item.save();

  // TODO : handle this in Ruling Event
  // item.latestRequestResolutionTime = event.block.timestamp;

  // let requestIndex = item.numberOfRequests.minus(BigInt.fromI32(1));
  // let requestInfo = tcr.getRequestInfo(event.params._itemID, requestIndex);

  // let requestID = graphItemID + '-' + requestIndex.toString();
  // let request = Request.load(requestID);
  // if (!request) {
  //   log.error(`Request {} not found.`, [requestID]);
  //   return;
  // }

  // request.resolved = true;
  // request.resolutionTime = event.block.timestamp;
  // request.resolutionTx = event.transaction.hash;
  // // requestInfo.value6 is request.ruling.
  // request.disputeOutcome = getFinalRuling(requestInfo.value6);

  // // Iterate over every contribution and mark it as withdrawable if it is.
  // // Start from the second round as the first is automatically withdrawn
  // // when the request resolves.
  // for (
  //   let i = BigInt.fromI32(1);
  //   i.lt(request.numberOfRounds);
  //   i = i.plus(BigInt.fromI32(1))
  // ) {
  //   // Iterate over every round of the request.
  //   let roundID = requestID + '-' + i.toString();
  //   let round = Round.load(roundID);
  //   if (!round) {
  //     log.error(`Round {} not found.`, [roundID]);
  //     return;
  //   }

  //   for (
  //     let j = BigInt.fromI32(0);
  //     j.lt(round.numberOfContributions);
  //     j = j.plus(BigInt.fromI32(1))
  //   ) {
  //     // Iterate over every contribution of the round.
  //     let contributionID = roundID + '-' + j.toString();
  //     let contribution = Contribution.load(contributionID);
  //     if (!contribution) {
  //       log.error(`Contribution {} not found.`, [contributionID]);
  //       return;
  //     }

  //     if (requestInfo.value6 == NO_RULING_CODE) {
  //       // The final ruling is refuse to rule. There is no winner
  //       // or loser so every contribution is withdrawable.
  //       contribution.withdrawable = true;
  //     } else if (requestInfo.value6 == REQUESTER_CODE) {
  //       // The requester won so only contributions to the requester
  //       // are withdrawable.
  //       // The only exception is in the case the last round the loser
  //       // (challenger in this case) raised some funds but not enough
  //       // to be fully funded before the deadline. In this case
  //       // the contributors get to withdraw.
  //       if (contribution.side == BigInt.fromI32(REQUESTER_CODE)) {
  //         contribution.withdrawable = true;
  //       } else if (i.equals(request.numberOfRounds.minus(BigInt.fromI32(1)))) {
  //         // Contribution was made to the challenger (loser) and this
  //         // is the last round.
  //         contribution.withdrawable = true;
  //       }
  //     } else {
  //       // The challenger won so only contributions to the challenger
  //       // are withdrawable.
  //       // The only exception is in the case the last round the loser
  //       // (requester in this case) raised some funds but not enough
  //       // to be fully funded before the deadline. In this case
  //       // the contributors get to withdraw.
  //       if (contribution.side == BigInt.fromI32(CHALLENGER_CODE)) {
  //         contribution.withdrawable = true;
  //       } else if (i.equals(request.numberOfRounds.minus(BigInt.fromI32(1)))) {
  //         // Contribution was made to the requester (loser) and this
  //         // is the last round.
  //         contribution.withdrawable = true;
  //       }
  //     }

  //     contribution.save();
  //   }
  // }

  // request.save();
}

export function handleConnectedTCRSet(event: ConnectedTCRSetEvent): void {
  let registry = Registry.load(event.address.toHexString());
  if (!registry) {
    log.error(`Registry {} not found.`, [event.address.toHexString()]);
    return;
  }
  registry.connectedTCR = event.params._connectedTCR;

  registry.save();
}

//   export function handleRuling(event: Ruling): void {
//     let tcr = LightGeneralizedTCR.bind(event.address);
//     let itemID = tcr.arbitratorDisputeIDToItemID(
//       event.params._arbitrator,
//       event.params._disputeID,
//     );
//     let graphItemID = itemID.toHexString() + '@' + event.address.toHexString();
//     let item = Item.load(graphItemID);
//     if (!item) {
//       log.error(`Ruling Item {} not found. tx {}`, [
//         graphItemID,
//         event.transaction.hash.toHexString(),
//       ]);
//       return;
//     }

//     let requestID =
//       item.id + '-' + item.numberOfRequests.minus(BigInt.fromI32(1)).toString();
//     let request = Request.load(requestID);
//     if (!request) {
//       log.error(`Ruling Request {} not found. tx {}`, [
//         requestID,
//         event.transaction.hash.toHexString(),
//       ]);
//       return;
//     }

//     request.finalRuling = event.params._ruling;
//     request.resolutionTime = event.block.timestamp;
//     request.save();
//   }

// TODO: link this to DisputeRequest?
//   export function handleRequestChallenged(event: Dispute): void {
//     let curate = Curate.bind(event.address);
//     let itemID = curate.arbitratorDisputeIDToItemID(
//       event.params._arbitrator,
//       event.params._disputeID,
//     );
//     let graphItemID = itemID.toHexString() + '@' + event.address.toHexString();
//     let item = Item.load(graphItemID);
//     if (!item) {
//       log.warning(`Item {} not found.`, [graphItemID]);
//       return;
//     }

//     let previousStatus = getExtendedStatus(item.disputed, item.status);
//     item.disputed = true;
//     item.latestChallenger = event.transaction.from;
//     let newStatus = getExtendedStatus(item.disputed, item.status);

//     let requestIndex = item.numberOfRequests.minus(BigInt.fromI32(1));
//     let requestID = graphItemID + '-' + requestIndex.toString();
//     let request = Request.load(requestID);
//     if (!request) {
//       log.error(`Request {} not found.`, [requestID]);
//       return;
//     }

//     request.disputed = true;
//     request.challenger = event.transaction.from;
//     request.numberOfRounds = BigInt.fromI32(2);
//     request.disputeID = event.params._disputeID;

//     let newRoundID = requestID + '-1'; // When a dispute is created, the new round is always id 1
//     let newRound = buildNewRound(newRoundID, request.id, event.block.timestamp);

//     // Accounting.
//     updateCounters(previousStatus, newStatus, event.address);

//     newRound.save();
//     request.save();
//     item.save();
//   }
