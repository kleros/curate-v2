/* eslint-disable prefer-const */
import { Bytes, ipfs, json, log } from "@graphprotocol/graph-ts";
import { NewList } from "../generated/CurateFactory/CurateFactory";
import { Registry, User } from "../generated/schema";
import { Curate } from "../generated/templates";
import { ensureCounter } from "./entities/Counters";
import { ensureUser } from "./entities/User";
import { JSONValueToMaybeString, ONE } from "./utils";

export function handleNewCurate(event: NewList): void {
  Curate.create(event.params._address);

  let registry = new Registry(event.params._address.toHexString());
  let counter = ensureCounter();

  counter.totalRegistries = counter.totalRegistries.plus(ONE);
  let doesCuratorExist = User.load(event.transaction.from.toHexString());
  if (!doesCuratorExist) counter.numberOfCurators = counter.numberOfCurators.plus(ONE);

  registry.registerer = ensureUser(event.transaction.from.toHexString()).id;
  registry.metadataURI = event.params._listMetadata;

  let jsonStr = ipfs.cat(registry.metadataURI);
  if (!jsonStr) {
    log.error("Failed to fetch registry metadata #{} JSON: {}", [registry.id, registry.metadataURI]);
    registry.save();
    return;
  }

  let jsonObjValueAndSuccess = json.try_fromBytes(jsonStr as Bytes);
  if (!jsonObjValueAndSuccess.isOk) {
    log.error(`Error getting json object value for registry metadata {}`, [registry.id]);
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

  counter.save();
  registry.save();
}
