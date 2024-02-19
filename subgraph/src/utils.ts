import { BigInt, Bytes, JSONValue, JSONValueKind } from "@graphprotocol/graph-ts";

export const ZERO = BigInt.fromI32(0);
export const ONE = BigInt.fromI32(1);
export const ZERO_ADDRESS = Bytes.fromHexString("0x0000000000000000000000000000000000000000") as Bytes;

export const ABSENT = "Absent";
export const REGISTERED = "Registered";
export const REGISTRATION_REQUESTED = "RegistrationRequested";
export const CLEARING_REQUESTED = "ClearingRequested";

export const NONE = "None";
export const ACCEPT = "Accept";
export const REJECT = "Reject";

export const NO_RULING_CODE = 0;
export const REQUESTER_CODE = 1;
export const CHALLENGER_CODE = 2;

export const ABSENT_CODE = 0;
export const REGISTERED_CODE = 1;
export const REGISTRATION_REQUESTED_CODE = 2;
export const CLEARING_REQUESTED_CODE = 3;
export const CHALLENGED_REGISTRATION_REQUEST_CODE = 4;
export const CHALLENGED_CLEARING_REQUEST_CODE = 5;
export const CONTRACT_STATUS_EXTENDED = new Map<string, number>();
CONTRACT_STATUS_EXTENDED.set(ABSENT, ABSENT_CODE);
CONTRACT_STATUS_EXTENDED.set(REGISTERED, REGISTERED_CODE);
CONTRACT_STATUS_EXTENDED.set(REGISTRATION_REQUESTED, REGISTRATION_REQUESTED_CODE);
CONTRACT_STATUS_EXTENDED.set(CLEARING_REQUESTED, CLEARING_REQUESTED_CODE);

export const CONTRACT_STATUS_NAMES = new Map<number, string>();
CONTRACT_STATUS_NAMES.set(ABSENT_CODE, "Absent");
CONTRACT_STATUS_NAMES.set(REGISTERED_CODE, "Registered");
CONTRACT_STATUS_NAMES.set(REGISTRATION_REQUESTED_CODE, "RegistrationRequested");
CONTRACT_STATUS_NAMES.set(CLEARING_REQUESTED_CODE, "ClearingRequested");

export function getExtendedStatus(disputed: boolean, status: string): number {
  if (disputed) {
    if (status == CONTRACT_STATUS_NAMES.get(REGISTRATION_REQUESTED_CODE)) return CHALLENGED_REGISTRATION_REQUEST_CODE;
    else return CHALLENGED_CLEARING_REQUEST_CODE;
  }

  return CONTRACT_STATUS_EXTENDED.get(status) || 0;
}

export function getStatus(status: number): string {
  if (status == ABSENT_CODE) return ABSENT;
  if (status == REGISTERED_CODE) return REGISTERED;
  if (status == REGISTRATION_REQUESTED_CODE) return REGISTRATION_REQUESTED;
  if (status == CLEARING_REQUESTED_CODE) return CLEARING_REQUESTED;
  return "Error";
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
