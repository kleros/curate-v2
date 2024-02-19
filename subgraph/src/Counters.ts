import { Address, log } from "@graphprotocol/graph-ts";
import { Registry } from "../generated/schema";
import {
  ABSENT_CODE,
  CHALLENGED_CLEARING_REQUEST_CODE,
  CHALLENGED_REGISTRATION_REQUEST_CODE,
  CLEARING_REQUESTED_CODE,
  ONE,
  REGISTERED_CODE,
  REGISTRATION_REQUESTED_CODE,
} from "./utils";

/**
 * Decrements and increments registry counters based on item status change.
 *
 * The user should ensure that this function is called once and only once for
 * each status update. What handlers were called before and which will be called
 * after the one this is being called on? Do they call updateCounters?
 * @param previousStatus The previous extended status of the item.
 * @param newStatus The new extended status of the item.
 * @param registry The registry to which update the counters.
 */
export function updateCounters(previousStatus: number, newStatus: number, registryAddress: Address): void {
  let registry = Registry.load(registryAddress.toHexString());
  if (!registry) {
    log.error(`Registry at {} not found.`, [registryAddress.toHexString()]);
    return;
  }

  if (previousStatus == ABSENT_CODE) {
    registry.numberOfAbsent = registry.numberOfAbsent.minus(ONE);
  } else if (previousStatus == REGISTERED_CODE) {
    registry.numberOfRegistered = registry.numberOfRegistered.minus(ONE);
  } else if (previousStatus == REGISTRATION_REQUESTED_CODE) {
    registry.numberOfRegistrationRequested = registry.numberOfRegistrationRequested.minus(ONE);
  } else if (previousStatus == CLEARING_REQUESTED_CODE) {
    registry.numberOfClearingRequested = registry.numberOfClearingRequested.minus(ONE);
  } else if (previousStatus == CHALLENGED_REGISTRATION_REQUEST_CODE) {
    registry.numberOfChallengedRegistrations = registry.numberOfChallengedRegistrations.minus(ONE);
  } else if (previousStatus == CHALLENGED_CLEARING_REQUEST_CODE) {
    registry.numberOfChallengedClearing = registry.numberOfChallengedClearing.minus(ONE);
  }

  if (newStatus == ABSENT_CODE) {
    registry.numberOfAbsent = registry.numberOfAbsent.plus(ONE);
  } else if (newStatus == REGISTERED_CODE) {
    registry.numberOfRegistered = registry.numberOfRegistered.plus(ONE);
  } else if (newStatus == REGISTRATION_REQUESTED_CODE) {
    registry.numberOfRegistrationRequested = registry.numberOfRegistrationRequested.plus(ONE);
  } else if (newStatus == CLEARING_REQUESTED_CODE) {
    registry.numberOfClearingRequested = registry.numberOfClearingRequested.plus(ONE);
  } else if (newStatus == CHALLENGED_REGISTRATION_REQUEST_CODE) {
    registry.numberOfChallengedRegistrations = registry.numberOfChallengedRegistrations.plus(ONE);
  } else if (newStatus == CHALLENGED_CLEARING_REQUEST_CODE) {
    registry.numberOfChallengedClearing = registry.numberOfChallengedClearing.plus(ONE);
  }

  registry.save();
}
