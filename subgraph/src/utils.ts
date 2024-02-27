import { BigInt, Bytes, JSONValue, JSONValueKind } from "@graphprotocol/graph-ts";

export const ZERO = BigInt.fromI32(0);
export const ONE = BigInt.fromI32(1);
export const ZERO_ADDRESS = Bytes.fromHexString("0x0000000000000000000000000000000000000000") as Bytes;

export enum ItemStatus {
  ABSENT,
  REGISTERED,
  REGISTRATION_REQUESTED,
  CLEARING_REQUESTED,
}

export const NONE = "None";
export const ACCEPT = "Accept";
export const REJECT = "Reject";

export const NO_RULING_CODE = 0;
export const REQUESTER_CODE = 1;
export const CHALLENGER_CODE = 2;

export function getStatus(index: i32): string {
  const statusArray = ["absent", "registered", "registrationRequested", "clearingRequested"];
  return statusArray.at(index) || "None";
}

export function getFinalRuling(outcome: number): string {
  if (outcome == 0) return NONE;
  if (outcome == 1) return ACCEPT;
  if (outcome == 2) return REJECT;
  return "Error";
}

export function JSONValueToMaybeString(value: JSONValue | null, _default: string = "-"): string {
  // Subgraph considers an empty string to be null and
  // the handler crashes when attempting to save the entity.
  // This is a security vulnerability because an adversary
  // could manually craft an item with missing columns
  // and the item would not show up in the UI, passing
  // the challenge period unoticed.
  //
  // We fix this by setting the field manually to a hifen.
  if (value == null || value.isNull()) {
    return "-";
  }

  switch (value.kind) {
    case JSONValueKind.BOOL:
      return value.toBool() == true ? "true" : "false";
    case JSONValueKind.STRING:
      return value.toString();
    case JSONValueKind.NUMBER:
      return value.toBigInt().toHexString();
    default:
      return _default;
  }
}

export function JSONValueToBool(value: JSONValue | null, _default: boolean = false): boolean {
  if (value == null || value.isNull()) {
    return _default;
  }

  switch (value.kind) {
    case JSONValueKind.BOOL:
      return value.toBool();
    case JSONValueKind.STRING:
      return value.toString() == "true";
    case JSONValueKind.NUMBER:
      return value.toBigInt().notEqual(BigInt.fromString("0"));
    default:
      return _default;
  }
}
