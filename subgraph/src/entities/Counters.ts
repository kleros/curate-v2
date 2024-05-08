import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { Counter, Registry } from "../../generated/schema";
import { ExtendedStatus, ZERO } from "../utils";

export function ensureCounter(): Counter {
  const counter = Counter.load("0");
  if (counter) return counter;

  let newCounter = new Counter("0");
  newCounter.totalDeposits = ZERO;
  newCounter.totalItems = ZERO;
  newCounter.totalRegistries = ZERO;
  newCounter.numberOfCurators = ZERO;
  newCounter.save();
  return newCounter;
}

export function updateCounters(
  previousStatus: ExtendedStatus,
  newStatus: ExtendedStatus,
  registryAddress: Address
): void {
  let registry = Registry.load(registryAddress.toHexString());
  if (!registry) {
    log.error(`Registry at {} not found.`, [registryAddress.toHexString()]);
    return;
  }

  if (previousStatus == ExtendedStatus.Removed) {
    registry.numberOfAbsent = registry.numberOfAbsent.minus(BigInt.fromI32(1));
  } else if (previousStatus == ExtendedStatus.Included) {
    registry.numberOfRegistered = registry.numberOfRegistered.minus(BigInt.fromI32(1));
  } else if (previousStatus == ExtendedStatus.Disputed) {
    registry.numberOfDisputed = registry.numberOfDisputed.minus(BigInt.fromI32(1));
  } else if (previousStatus == ExtendedStatus.Pending) {
    registry.numberOfPending = registry.numberOfPending.minus(BigInt.fromI32(1));
  }

  if (newStatus == ExtendedStatus.Removed) {
    registry.numberOfAbsent = registry.numberOfAbsent.plus(BigInt.fromI32(1));
  } else if (newStatus == ExtendedStatus.Included) {
    registry.numberOfRegistered = registry.numberOfRegistered.plus(BigInt.fromI32(1));
  } else if (newStatus == ExtendedStatus.Pending) {
    registry.numberOfPending = registry.numberOfPending.plus(BigInt.fromI32(1));
  } else if (newStatus == ExtendedStatus.Disputed) {
    registry.numberOfDisputed = registry.numberOfDisputed.plus(BigInt.fromI32(1));
  }

  registry.save();
}
