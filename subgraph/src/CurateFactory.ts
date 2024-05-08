/* eslint-disable prefer-const */
import { NewList } from "../generated/CurateFactory/CurateFactory";
import { MainCurate, Registry, User } from "../generated/schema";
import { Curate } from "../generated/templates";
import { ensureCounter } from "./entities/Counters";
import { ensureUser } from "./entities/User";
import { ONE, ZERO } from "./utils";

export function handleNewCurate(event: NewList): void {
  Curate.create(event.params._address);

  let registry = new Registry(event.params._address.toHexString());
  let counter = ensureCounter();

  // set the first registry as the main curate
  let mainCurate = MainCurate.load("0");
  if (!mainCurate) {
    mainCurate = new MainCurate("0");
    mainCurate.address = event.params._address;
    mainCurate.save();
  }

  let doesCuratorExist = User.load(event.transaction.from.toHexString());
  if (!doesCuratorExist) counter.numberOfCurators = counter.numberOfCurators.plus(ONE);

  registry.registerer = ensureUser(event.transaction.from.toHexString()).id;
  registry.totalItems = ZERO;
  registry.numberOfAbsent = ZERO;
  registry.numberOfDisputed = ZERO;
  registry.numberOfPending = ZERO;
  registry.numberOfRegistered = ZERO;

  counter.save();
  registry.save();
}
