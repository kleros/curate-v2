/* eslint-disable prefer-const */
import { NewGTCR } from "../generated/CurateFactory/CurateFactory";
import { Registry } from "../generated/schema";
import { Curate } from "../generated/templates";
import { ZERO } from "./utils";

export function handleNewCurate(event: NewGTCR): void {
  Curate.create(event.params._address);

  let registry = new Registry(event.params._address.toHexString());

  registry.numberOfAbsent = ZERO;
  registry.numberOfRegistered = ZERO;
  registry.numberOfRegistrationRequested = ZERO;
  registry.numberOfClearingRequested = ZERO;
  registry.numberOfChallengedRegistrations = ZERO;
  registry.numberOfChallengedClearing = ZERO;
  registry.save();
}
