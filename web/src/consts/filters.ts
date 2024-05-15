import { Status } from "src/graphql/graphql";

export const List_filters = {
  Pending: { status_in: [Status.RegistrationRequested, Status.ClearingRequested], disputed: false },
  Disputed: { disputed: true },
  Included: { status: Status.Registered },
  Removed: { status: Status.Absent },
};
