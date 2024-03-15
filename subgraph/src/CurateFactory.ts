/* eslint-disable prefer-const */
import { Bytes, ipfs, json, log } from "@graphprotocol/graph-ts";
import { NewList } from "../generated/CurateFactory/CurateFactory";
import { FieldProp, Registry, User } from "../generated/schema";
import { Curate } from "../generated/templates";
import { ensureCounter } from "./entities/Counters";
import { ensureUser } from "./entities/User";
import { JSONValueToBool, JSONValueToMaybeString, ONE } from "./utils";

export function handleNewCurate(event: NewList): void {
  Curate.create(event.params._address);

  let registry = new Registry(event.params._address.toHexString());
  let counter = ensureCounter();

  counter.totalRegistries = counter.totalRegistries.plus(ONE);
  let doesCuratorExist = User.load(event.transaction.from.toHexString());
  if (!doesCuratorExist) counter.numberOfCurators = counter.numberOfCurators.plus(ONE);

  registry.registerer = ensureUser(event.transaction.from.toHexString()).id;
  registry.metadataURI = event.params._listMetadata;

  counter.save();
  registry.save();
  updateRegistryMetadata(registry.id, event.params._listMetadata);
}

export function updateRegistryMetadata(registryID: string, metadataURI: string): void {
  let registry = Registry.load(registryID);

  if (!registry) {
    log.error(`Registry {} not found.`, [registryID]);
    return;
  }

  registry.metadataURI = metadataURI;

  let jsonStr = ipfs.cat(metadataURI);
  if (!jsonStr) {
    log.error("Failed to fetch registry metadata #{} JSON: {}", [registry.id, metadataURI]);
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
  registry.itemName = JSONValueToMaybeString(jsonObj.get("itemName"));
  registry.itemNamePlural = JSONValueToMaybeString(jsonObj.get("itemNamePlural"));
  registry.isListOfLists = JSONValueToBool(jsonObj.get("isListOfLists"));

  let columnsValue = jsonObj.get("columns");
  if (!columnsValue) {
    log.error(`Error getting column values for registry {}`, [registryID]);
    registry.save();
    return;
  }
  let columns = columnsValue.toArray();

  for (let i = 0; i < columns.length; i++) {
    let col = columns[i];
    let colObj = col.toObject();

    let label = colObj.get("label");

    let checkedLabel = label ? label.toString() : "missing-label".concat(i.toString());

    let description = colObj.get("description");
    let _type = colObj.get("type");
    let isIdentifier = colObj.get("isIdentifier");
    let fieldPropId = registryID + "@" + checkedLabel;
    let fieldProp = new FieldProp(fieldPropId);

    fieldProp.type = JSONValueToMaybeString(_type);
    fieldProp.label = JSONValueToMaybeString(label);
    fieldProp.description = JSONValueToMaybeString(description);
    fieldProp.isIdentifier = JSONValueToBool(isIdentifier);
    fieldProp.registry = registry.id;

    fieldProp.save();
  }

  registry.save();
}
