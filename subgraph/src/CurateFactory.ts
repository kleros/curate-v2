/* eslint-disable prefer-const */
import { NewGTCR } from "../generated/CurateFactory/CurateFactory";
import { Registry, User } from "../generated/schema";
import { Curate } from "../generated/templates";
import { ensureCounter } from "./entities/Counters";
import { ensureUser } from "./entities/User";
import { ONE } from "./utils";

export function handleNewCurate(event: NewGTCR): void {
  Curate.create(event.params._address);

  let registry = new Registry(event.params._address.toHexString());
  let counter = ensureCounter();

  counter.totalRegistries = counter.totalRegistries.plus(ONE);
  let doesCuratorExist = User.load(event.transaction.from.toHexString());
  if (!doesCuratorExist) counter.numberOfCurators = counter.numberOfCurators.plus(ONE);

  registry.registerer = ensureUser(event.transaction.from.toHexString()).id;

  counter.save();
  registry.save();
}
