import { Counter } from "../../generated/schema";
import { ZERO } from "../utils";

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
