import { json, log } from "@graphprotocol/graph-ts";
import { Item, ItemProp, MainCurate, Registry, User } from "../../generated/schema";
import { Curate, NewItem } from "../../generated/templates/Curate/Curate";
import { JSONValueToBool, JSONValueToMaybeString, ONE, ZERO, getStatus } from "../utils";
import { ensureCounter } from "./Counters";
import { ensureUser } from "./User";

export function createItemFromEvent(event: NewItem): void {
  // We assume this is an item added via addItemDirectly and care
  // only about saving the item json data.
  // If it was emitted via addItem, all the missing/wrong data regarding
  // things like submission time, arbitrator and deposit will be set in
  // handleRequestSubmitted.

  let graphItemID = event.params._itemID.toHexString() + "@" + event.address.toHexString();
  let curate = Curate.bind(event.address);
  let registry = Registry.load(event.address.toHexString());
  if (!registry) {
    log.error(`Registry {} not found`, [event.address.toHexString()]);
    return;
  }

  let counter = ensureCounter();
  let mainCurate = MainCurate.load("0");

  let isRegistry = mainCurate != null && mainCurate.address == event.address;

  // check if the item is being added to main curate, then it's a new registry
  if (isRegistry) {
    counter.totalRegistries = counter.totalRegistries.plus(ONE);
  } else {
    counter.totalItems = counter.totalItems.plus(ONE);
  }
  registry.totalItems = registry.totalItems.plus(ONE);

  let doesCuratorExist = User.load(event.transaction.from.toHexString());
  if (!doesCuratorExist) counter.numberOfCurators = counter.numberOfCurators.plus(ONE);
  counter.save();

  let itemInfo = curate.getItemInfo(event.params._itemID);

  let item = new Item(graphItemID);
  item.itemID = event.params._itemID;
  item.data = event.params._data;
  item.numberOfRequests = ZERO;
  item.registry = registry.id;
  item.registryAddress = event.address;
  item.disputed = false;
  item.status = getStatus(itemInfo.value0);
  item.registerer = ensureUser(event.transaction.from.toHexString()).id;
  item.latestRequestResolutionTime = ZERO;
  item.latestRequestSubmissionTime = ZERO;

  item.keywords = event.address.toHexString();

  let jsonObjValueAndSuccess = json.try_fromString(event.params._data);
  if (!jsonObjValueAndSuccess.isOk) {
    log.error(`Error getting json object value for graphItemID {}`, [graphItemID]);
    item.save();
    registry.save();
    return;
  }

  let jsonObj = jsonObjValueAndSuccess.value.toObject();
  if (!jsonObj) {
    log.error(`Error converting object for graphItemID {}`, [graphItemID]);
    item.save();
    registry.save();
    return;
  }

  let columnsValue = jsonObj.get("columns");
  if (!columnsValue) {
    log.error(`Error getting column values for graphItemID {}`, [graphItemID]);
    item.save();
    registry.save();
    return;
  }
  let columns = columnsValue.toArray();

  let valuesValue = jsonObj.get("values");
  if (!valuesValue) {
    log.error(`Error getting valuesValue for graphItemID {}`, [graphItemID]);
    item.save();
    registry.save();
    return;
  }
  let values = valuesValue.toObject();

  let identifier = 0;
  for (let i = 0; i < columns.length; i++) {
    let col = columns[i];
    let colObj = col.toObject();

    let label = colObj.get("label");

    // We must account for items with missing fields.
    let checkedLabel = label ? label.toString() : "missing-label".concat(i.toString());

    let description = colObj.get("description");
    let _type = colObj.get("type");
    let isIdentifier = colObj.get("isIdentifier");
    let value = values.get(checkedLabel);
    let itemPropId = graphItemID + "@" + checkedLabel;
    let itemProp = new ItemProp(itemPropId);

    itemProp.value = JSONValueToMaybeString(value);
    itemProp.type = JSONValueToMaybeString(_type);
    itemProp.label = JSONValueToMaybeString(label);
    itemProp.description = JSONValueToMaybeString(description);
    itemProp.isIdentifier = JSONValueToBool(isIdentifier);
    itemProp.item = item.id;

    if (itemProp.isIdentifier) {
      if (identifier == 0) item.key0 = itemProp.value;
      else if (identifier == 1) item.key1 = itemProp.value;
      else if (identifier == 2) item.key2 = itemProp.value;
      else if (identifier == 3) item.key3 = itemProp.value;
      else if (identifier == 4) item.key4 = itemProp.value;
      identifier += 1;
    }

    if (itemProp.isIdentifier && itemProp.value != null && item.keywords) {
      item.keywords = (item.keywords as string) + " | " + (itemProp.value as string);
    }

    itemProp.save();
  }

  // if the item is a registry add the registry title to keyword to enhance search
  if (isRegistry && values.get("List")) {
    let registryAddress = JSONValueToMaybeString(values.get("List"));
    let itemAsRegistry = Registry.load(registryAddress);

    if (!itemAsRegistry || itemAsRegistry.title === null) return;

    item.keywords = (item.keywords as string) + " | " + (itemAsRegistry.title as string);
  }

  item.save();
  registry.save();
}
