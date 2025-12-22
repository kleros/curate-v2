/* eslint-disable prefer-const */
import { BigInt, json, JSONValueKind, log } from "@graphprotocol/graph-ts";
import { Item, Request, Registry, FieldProp } from "../generated/schema";

import {
  ItemStatusChange,
  RequestSubmitted,
  NewItem,
  Ruling,
  Curate,
  ConnectedListSet,
  ListMetadataSet,
  RequestChallenged,
} from "../generated/templates/Curate/Curate";
import {
  ItemStatus,
  JSONValueToBool,
  JSONValueToMaybeString,
  ONE,
  ZERO,
  getExtendedStatus,
  getFinalRuling,
  getStatus,
} from "./utils";
import { createRequestFromEvent } from "./entities/Request";
import { createItemFromEvent } from "./entities/Item";
import { ensureUser } from "./entities/User";
import { updateCounters } from "./entities/Counters";

// Items on a List can be in 1 of 4 states:
// - (0) Absent: The item is not registered on the List and there are no pending requests.
// - (1) Registered: The item is registered and there are no pending requests.
// - (2) Registration Requested: The item is not registered on the List, but there is a pending
//       registration request.
// - (3) Clearing Requested: The item is registered on the List, but there is a pending removal
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
// requestID: <itemID>@<listAddress>-0
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

  let registry = Registry.load(event.address.toHexString());

  if (!registry) {
    log.error(`Registry : {} , for graphItemID {} not found.`, [event.address.toHexString(), graphItemID]);
    return;
  }

  let curate = Curate.bind(event.address);
  let itemInfo = curate.getItemInfo(event.params._itemID);

  let item = Item.load(graphItemID);
  if (!item) {
    log.error(`Item for graphItemID {} not found.`, [graphItemID]);
    return;
  }

  let prevStatus = getExtendedStatus(item.status, item.disputed);
  item.numberOfRequests = item.numberOfRequests.plus(ONE);
  item.status = getStatus(itemInfo.value0);
  item.latestRequester = ensureUser(event.transaction.from.toHexString()).id;
  item.latestRequestResolutionTime = ZERO;
  item.latestRequestSubmissionTime = event.block.timestamp;
  item.save();

  let newStatus = getExtendedStatus(item.status, item.disputed);

  if (itemInfo.value1.equals(ONE)) {
    registry.numberOfPending = registry.numberOfPending.plus(ONE);
    registry.save();
  } else {
    updateCounters(prevStatus, newStatus, event.address);
  }

  createRequestFromEvent(event);
}

export function handleStatusUpdated(event: ItemStatusChange): void {
  // This handler is used to handle transations to item statuses 0 and 1.
  // All other status updates are handled elsewhere.
  let curate = Curate.bind(event.address);
  let itemInfo = curate.getItemInfo(event.params._itemID);
  if (itemInfo.value0 == ItemStatus.REGISTRATION_REQUESTED || itemInfo.value0 == ItemStatus.CLEARING_REQUESTED) {
    // Request not yet resolved. No-op as changes are handled
    // elsewhere. (RequestSubmitted handler)
    return;
  }

  let graphItemID = event.params._itemID.toHexString() + "@" + event.address.toHexString();
  let item = Item.load(graphItemID);
  if (!item) {
    log.error(`Item {} not found.`, [graphItemID]);
    return;
  }

  let prevStatus = getExtendedStatus(item.status, item.disputed);
  item.status = getStatus(itemInfo.value0);
  item.disputed = false;
  let newStatus = getExtendedStatus(item.status, item.disputed);

  if (prevStatus != newStatus) {
    updateCounters(prevStatus, newStatus, event.address);
  }

  if (event.params._updatedDirectly) {
    // Direct actions (e.g. addItemDirectly and removeItemDirectly)
    // don't envolve any requests. Only the item is updated.
    item.save();

    return;
  }

  item.latestRequestResolutionTime = event.block.timestamp;

  let requestIndex = item.numberOfRequests.minus(ONE);
  let requestInfo = curate.getRequestInfo(event.params._itemID, requestIndex);

  let requestID = graphItemID + "-" + requestIndex.toString();
  let request = Request.load(requestID);
  if (!request) {
    log.error(`Request {} not found.`, [requestID]);
    return;
  }

  request.resolved = true;
  request.resolutionTime = event.block.timestamp;
  request.resolutionTx = event.transaction.hash;
  // requestInfo.value5 is request.ruling.
  request.disputeOutcome = getFinalRuling(requestInfo.value5);

  item.save();
  request.save();
}

export function handleConnectedListSet(event: ConnectedListSet): void {
  let registry = Registry.load(event.address.toHexString());
  if (!registry) {
    log.error(`Registry {} not found.`, [event.address.toHexString()]);
    return;
  }
  registry.connectedList = event.params._connectedList;

  registry.save();
}

export function handleListMetadataSet(event: ListMetadataSet): void {
  let registry = Registry.load(event.address.toHexString());
  if (!registry) {
    log.error(`Registry {} not found.`, [event.address.toHexString()]);
    return;
  }

  registry.metadata = event.params._listMetadata;

  let jsonObjValueAndSuccess = json.try_fromString(event.params._listMetadata);

  if (!jsonObjValueAndSuccess.isOk || jsonObjValueAndSuccess.isError) {
    log.error(`Error getting json object value for registry metadata {}`, [registry.id]);
    registry.save();
    return;
  }

  if (jsonObjValueAndSuccess.value.isNull() || jsonObjValueAndSuccess.value.kind !== JSONValueKind.OBJECT) {
    log.error(`Encountered invalid parsed value for registry metadata {}`, [registry.id]);
    registry.save();
    return;
  }

  let jsonObj = jsonObjValueAndSuccess.value.toObject();
  if (!jsonObj) {
    log.error(`Error converting object for registry metadata {}`, [registry.id]);
    registry.save();
    return;
  }

  registry.title = JSONValueToMaybeString(jsonObj.get("title"));
  registry.description = JSONValueToMaybeString(jsonObj.get("description"));
  registry.logoURI = JSONValueToMaybeString(jsonObj.get("logoURI"));
  registry.policyURI = JSONValueToMaybeString(jsonObj.get("policyURI"));
  registry.itemName = JSONValueToMaybeString(jsonObj.get("itemName"));
  registry.itemNamePlural = JSONValueToMaybeString(jsonObj.get("itemNamePlural"));
  registry.isListOfLists = JSONValueToBool(jsonObj.get("isListOfLists"));

  let columnsValue = jsonObj.get("columns");
  if (!columnsValue) {
    log.error(`Error getting column values for registry {}`, [registry.id]);
    registry.save();
    return;
  }
  let columns = columnsValue.toArray();

  for (let i = 0; i < columns.length; i++) {
    let fieldPropId = registry.id + "-" + i.toString();

    let fieldProp = FieldProp.load(fieldPropId);
    if (!fieldProp) {
      fieldProp = new FieldProp(fieldPropId);
    }

    let col = columns[i];
    let colObj = col.toObject();

    let label = colObj.get("label");

    let description = colObj.get("description");
    let _type = colObj.get("type");
    let isIdentifier = colObj.get("isIdentifier");

    fieldProp.position = BigInt.fromI32(i);
    fieldProp.type = JSONValueToMaybeString(_type);
    fieldProp.label = JSONValueToMaybeString(label);
    fieldProp.description = JSONValueToMaybeString(description);
    fieldProp.isIdentifier = JSONValueToBool(isIdentifier);
    fieldProp.registry = registry.id;

    fieldProp.save();
  }

  registry.save();
}

export function handleRuling(event: Ruling): void {
  let curate = Curate.bind(event.address);
  let itemID = curate.arbitratorDisputeIDToItemID(event.params._arbitrator, event.params._disputeID);
  let graphItemID = itemID.toHexString() + "@" + event.address.toHexString();
  let item = Item.load(graphItemID);
  if (!item) {
    log.error(`Ruling Item {} not found. tx {}`, [graphItemID, event.transaction.hash.toHexString()]);
    return;
  }

  let requestID = item.id + "-" + item.numberOfRequests.minus(ONE).toString();
  let request = Request.load(requestID);
  if (!request) {
    log.error(`Ruling Request {} not found. tx {}`, [requestID, event.transaction.hash.toHexString()]);
    return;
  }

  request.finalRuling = event.params._ruling;
  request.resolutionTime = event.block.timestamp;
  request.save();
}

export function handleRequestChallenged(event: RequestChallenged): void {
  let curate = Curate.bind(event.address);
  let graphItemID = event.params._itemID.toHexString() + "@" + event.address.toHexString();
  let item = Item.load(graphItemID);
  if (!item) {
    log.warning(`Item {} not found.`, [graphItemID]);
    return;
  }
  let itemInfo = curate.try_getItemInfo(event.params._itemID);

  if (itemInfo.reverted) {
    log.error(`Item Info request failed for {}.`, [graphItemID]);
    return;
  }
  let prevStatus = getExtendedStatus(item.status, item.disputed);
  item.disputed = true;
  item.latestChallenger = ensureUser(event.transaction.from.toHexString()).id;
  item.status = getStatus(itemInfo.value.value0);
  let newStatus = getExtendedStatus(item.status, item.disputed);

  updateCounters(prevStatus, newStatus, event.address);

  let requestIndex = item.numberOfRequests.minus(ONE);
  let requestID = graphItemID + "-" + requestIndex.toString();
  let request = Request.load(requestID);
  if (!request) {
    log.error(`Request {} not found.`, [requestID]);
    return;
  }
  let disputeInfo = curate.try_requestsDisputeData(event.params._itemID, requestIndex);

  if (disputeInfo.reverted) {
    log.error(`DisputeInfo request reverted for {}.`, [requestID]);
    return;
  }
  request.disputed = true;
  request.challenger = ensureUser(event.transaction.from.toHexString()).id;
  request.challengeTime = event.block.timestamp;
  request.disputeID = disputeInfo.value.getDisputeID();
  request.challengerEvidence = event.params._evidence;

  request.save();
  item.save();
}
